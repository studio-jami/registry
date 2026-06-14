const DOCS_ORIGIN = "jami.mintlify.dev";
const PUBLIC_HOST = "registry.jami.studio";

// Cloudflare Web Analytics (RUM) beacon for registry.jami.studio. Cookieless,
// free-tier, privacy-light. Publishable beacon token (client-exposed, not a
// secret) — sourced from CLOUDFLARE_WEB_ANALYTICS_DOCS_TOKEN in _ops/.agents/.env.
// Mintlify's docs.json has no custom-head-script field, so we inject the beacon
// at the Cloudflare Pages serving layer (this advanced-mode Worker) into every
// HTML response we return — both the Mintlify-proxied /docs/* pages and the
// generated static preview pages — so all registry.jami.studio HTML is covered.
const CF_BEACON_TOKEN = "83a3145e5d2a495491f28c50698fe5b1";
const CF_BEACON = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${CF_BEACON_TOKEN}"}'></script>`;

class BeaconInjector {
  element(element) {
    // Append the beacon script to <head> while streaming (no buffering).
    element.append(CF_BEACON, { html: true });
  }
}

function withBeacon(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  return new HTMLRewriter().on("head", new BeaconInjector()).transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
      const localDocsPath = docsFallbackPath(url.pathname);
      if (localDocsPath) {
        const localDocsUrl = new URL(request.url);
        localDocsUrl.pathname = localDocsPath;
        localDocsUrl.search = "";
        return withBeacon(await env.ASSETS.fetch(new Request(localDocsUrl, request)));
      }

      const docsResponse = await proxyDocs(request, url);
      if (docsResponse.status !== 404) return withBeacon(docsResponse);

      const fallbackPath = docsFallbackPath(url.pathname);
      if (fallbackPath) {
        const fallbackUrl = new URL(request.url);
        fallbackUrl.pathname = fallbackPath;
        fallbackUrl.search = "";
        const fallbackRequest = new Request(fallbackUrl, request);
        return withBeacon(await env.ASSETS.fetch(fallbackRequest));
      }

      return withBeacon(docsResponse);
    }

    return withBeacon(await env.ASSETS.fetch(request));
  },
};

function docsFallbackPath(pathname) {
  if (pathname === "/docs/workbench") return "/preview-docs/workbench.html";
  if (pathname === "/docs/suites") return "/preview-docs/suites.html";
  return null;
}

function proxyDocs(request, incomingUrl) {
  const upstreamUrl = new URL(incomingUrl);
  upstreamUrl.hostname = DOCS_ORIGIN;

  const proxyRequest = new Request(upstreamUrl, request);
  proxyRequest.headers.set("Host", DOCS_ORIGIN);
  proxyRequest.headers.set("X-Forwarded-Host", PUBLIC_HOST);
  proxyRequest.headers.set("X-Forwarded-Proto", "https");

  return fetch(proxyRequest);
}

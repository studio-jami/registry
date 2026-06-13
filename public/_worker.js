const DOCS_ORIGIN = "jami.mintlify.dev";
const PUBLIC_HOST = "registry.jami.studio";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
      const localDocsPath = docsFallbackPath(url.pathname);
      if (localDocsPath) {
        const localDocsUrl = new URL(request.url);
        localDocsUrl.pathname = localDocsPath;
        localDocsUrl.search = "";
        return env.ASSETS.fetch(new Request(localDocsUrl, request));
      }

      const docsResponse = await proxyDocs(request, url);
      if (docsResponse.status !== 404) return docsResponse;

      const fallbackPath = docsFallbackPath(url.pathname);
      if (fallbackPath) {
        const fallbackUrl = new URL(request.url);
        fallbackUrl.pathname = fallbackPath;
        fallbackUrl.search = "";
        const fallbackRequest = new Request(fallbackUrl, request);
        return env.ASSETS.fetch(fallbackRequest);
      }

      return docsResponse;
    }

    return env.ASSETS.fetch(request);
  },
};

function docsFallbackPath(pathname) {
  if (pathname === "/docs/workbench") return "/docs/workbench.html";
  if (pathname === "/docs/suites") return "/docs/suites.html";
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

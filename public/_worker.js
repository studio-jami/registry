const DOCS_ORIGIN = "jami.mintlify.dev";
const PUBLIC_HOST = "registry.jami.studio";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/docs") {
      url.pathname = "/docs/";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname.startsWith("/docs/")) {
      return proxyDocs(request, url);
    }

    return env.ASSETS.fetch(request);
  },
};

function proxyDocs(request, incomingUrl) {
  const upstreamUrl = new URL(incomingUrl);
  upstreamUrl.hostname = DOCS_ORIGIN;

  const proxyRequest = new Request(upstreamUrl, request);
  proxyRequest.headers.set("Host", DOCS_ORIGIN);
  proxyRequest.headers.set("X-Forwarded-Host", PUBLIC_HOST);
  proxyRequest.headers.set("X-Forwarded-Proto", "https");

  return fetch(proxyRequest);
}

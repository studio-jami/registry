# Hosting And Docs Routing

Jami Registry uses one public hostname with two backing services:

- `registry.jami.studio/registry.json`, `/items/*`, and `/suites/*` are static files served by Cloudflare Pages.
- `registry.jami.studio/docs/*` is the user-facing docs route and should proxy to Mintlify.

Marketing stays at `jami.studio`.

## Current Status

- Static registry hosting is live at `https://registry.jami.studio/registry.json`.
- The npm packages are published at `0.1.0`.
- `https://registry.jami.studio/docs` requires the Mintlify subpath proxy. It will return 404 until that proxy is deployed.

## Mintlify Source

Mintlify should clone this repository directly. Do not use a zip export unless the GitHub integration cannot read the repository.

The docs source files are:

- `docs.json`
- `docs/index.md`
- `docs/registry.md`
- `docs/packages.md`
- `docs/release.md`
- `docs/studio-ui.md`
- `docs/harness.md`
- `docs/hosting.md`

## Cloudflare Subpath Proxy

After Mintlify finishes provisioning, route `registry.jami.studio/docs*` through a Cloudflare Worker or equivalent edge proxy to the final Mintlify origin.

Use the real Mintlify hostname from the project settings. The placeholder below assumes `jami.mintlify.dev`:

```js
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/docs")) {
    const docsOrigin = "jami.mintlify.dev";
    const publicHost = "registry.jami.studio";
    const upstream = new URL(request.url);
    upstream.hostname = docsOrigin;

    const proxyRequest = new Request(upstream, request);
    proxyRequest.headers.set("Host", docsOrigin);
    proxyRequest.headers.set("X-Forwarded-Host", publicHost);
    proxyRequest.headers.set("X-Forwarded-Proto", "https");

    return fetch(proxyRequest);
  }

  return fetch(request);
}
```

Smoke after deployment:

```bash
curl -I https://registry.jami.studio/docs
curl -I https://registry.jami.studio/registry.json
curl -I https://registry.jami.studio/items/button.registry-item.json
```

# Registry

The static registry bundle lives in `public/` and is intended to be served from Cloudflare Pages.

Current bundle shape:

- `public/registry.json`
- `public/items/*.registry-item.json`
- `public/suites/*.suite.json`
- suite implementation files under `public/suites/*`

The generated bundle is copied from the verified Studio UI registry output. Cloudflare should serve these files directly without an application server.

## Intended Route

`https://registry.jami.studio/registry.json`

Until the custom domain is attached, the verified hosted preview is `https://studio-ui-registry.pages.dev/registry.json`.

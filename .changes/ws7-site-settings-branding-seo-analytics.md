---
type: ops
surface: docs
---

Provision the docs-site settings (WS7): wire branding (the Jami fold mark as the
light/dark `logo` + the favicon set from `jami-favicon.zip`), SEO/Open Graph defaults
(`description` + `seo.metatags`, keeping `seo.indexing: all`), and AIEO (authored static
`public/llms.txt` + `public/llms-full.txt`, served at the apex). Wire the free-tier
analytics stack: PostHog `registry-docs` via `integrations.posthog`
(`sessionRecording: false`; replay + autocapture off, error tracking on; hosted PostHog uses
Mintlify's default proxy), GA4 docs stream `G-R39QQTKF5F` via `integrations.ga4`, and the
Cloudflare Web Analytics beacon injected into
the proxied docs `<head>` from the Cloudflare Pages advanced-mode Worker
(`public/_worker.js`) since Mintlify exposes no custom-head-script field. Publishable client
IDs (`phc_`/`G-`/beacon) are placed directly in `docs.json`/the worker (no env-interpolation
pipeline; the gitignored `_ops/.agents/.env` stays the source-of-truth record); no
private/secret token is committed. Add reusable Mintlify snippets (`snippets/variables.mdx`,
`snippets/registry-source.mdx`) for product names, the four Workspaces, versions, and base
URLs. Remove the inert `api{}` playground block (no OpenAPI spec — the reference is
SDK · CLI · Contracts). Document everything in `operations/docs-site.mdx`.

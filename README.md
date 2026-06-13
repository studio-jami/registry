# Jami Registry

Public registry and documentation source for Jami Studio packages and registry items.

This repository is the canonical public surface for:

- Studio UI registry metadata and installable item bundles.
- User-facing docs for the registry, Studio UI packages, and Jami Harness packages.
- Static registry hosting from Cloudflare Pages.
- Static Studio UI workbench and suite preview routes from the generated registry artifacts.
- Release artifacts that describe the public registry bundle.

Internal orchestration logs, planning notes, and worker checkouts live outside this repo.

## Layout

- `public/` - static registry bundle served by Cloudflare Pages.
- `public/index.html` and `public/suites/*` - generated workbench and suite preview routes.
- `*.mdx`, `components/`, `registry/`, `suites/`, `theming/`, and `operations/` - user-facing docs for Mintlify.
- `scripts/` - lightweight validation for the public bundle.
- `.github/workflows/` - validation and release automation.

## Hosting

Recommended public routes:

- Registry bundle: `https://registry.jami.studio/registry.json`
- Docs: `https://registry.jami.studio/docs`
- Workbench preview: `https://registry.jami.studio/`
- Suite previews: `https://registry.jami.studio/suites/solo/`, `/suites/business-ops/`, `/suites/mixed-media/`, and `/suites/research-writing/`

Marketing remains at `https://jami.studio`.

`/docs` is served by Mintlify through the Cloudflare Pages advanced-mode Worker
in `public/_worker.js`. The generated preview docs at `/docs/workbench` and
`/docs/suites` are served locally from `public/preview-docs/*.html`; the rest of
`/docs/*` proxies to Mintlify. The static registry, workbench, and suite routes
remain on Cloudflare Pages and fall through through `env.ASSETS`.

## Validate

```bash
node scripts/check-registry.mjs
```

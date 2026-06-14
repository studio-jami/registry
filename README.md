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
- `public/registry.json` and `public/items/*` - generated registry bundle and per-item descriptors.
- `public/workspaces/*` - generated per-workspace install-graph manifests and implementation evidence.
- `public/index.html` and `public/suites/*` - generated workbench and workspace preview route HTML.
- `*.mdx`, `components/`, `harness/`, `registry/`, `suites/`, `theming/`, and `operations/` - user-facing docs for Mintlify.
- `scripts/` - lightweight validation for the public bundle.
- `.github/workflows/` - validation and release automation.

## Regenerated Bundle Note (2026-06-14)

The published bundle under `public/` is regenerated from `studio-ui`
(`packages/registry/generated/*` plus the workbench preview build) and was
refreshed for the **workspace taxonomy rename** (the locked `workspace` model):
the four `*-suite` registry items became `*-workspace`, `type`/membership moved
from `suite`/`lane` to `workspace`, and the JSON install-graph manifests moved
from `public/suites/<lane>.suite.json` to `public/workspaces/<workspace>.workspace.json`.
The diff against the prior bundle is a suite -> workspace rename only, with no
item loss (45 items before and after). The value-keyed preview-route HTML stays
at `public/suites/<workspace>/` so hosting URLs are unchanged. Regenerate with
`pnpm -C ../studio-ui contracts:generate` + the workbench build, then validate
with `node scripts/check-registry.mjs`.

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

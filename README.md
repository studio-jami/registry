# Jami Registry

Public registry and documentation source for Jami Studio packages and registry items.

This repository is the canonical public surface for:

- Studio UI registry metadata and installable item bundles.
- User-facing docs for the registry, Studio UI packages, and Jami Harness packages.
- Static registry hosting from Cloudflare Pages.
- Release artifacts that describe the public registry bundle.

Internal orchestration logs, planning notes, and worker checkouts live outside this repo.

## Layout

- `public/` - static registry bundle served by Cloudflare Pages.
- `docs/` - user-facing docs for Mintlify.
- `scripts/` - lightweight validation for the public bundle.
- `.github/workflows/` - validation and release automation.

## Hosting

Recommended public routes:

- Registry bundle: `https://registry.jami.studio/registry.json`
- Docs: `https://registry.jami.studio/docs`

Marketing remains at `https://jami.studio`.

`/docs` is served by Mintlify through a Cloudflare subpath proxy. The static
registry bundle remains on Cloudflare Pages. Until the proxy is deployed,
`https://registry.jami.studio/docs` can return 404 while the registry JSON routes
continue to work.

## Validate

```bash
node scripts/check-registry.mjs
```

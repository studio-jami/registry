# Release Evidence

The current public release posture separates three kinds of evidence:

- Static registry hosting evidence from Cloudflare Pages.
- Public npm package provenance from GitHub Actions publishes.
- Clean external npm install/import smoke evidence.
- GitHub CI/package attestations where workflows generate attestable artifacts.

Do not describe CI/package attestations as GitHub Release artifact attestations. A GitHub Release must exist before release artifact attestation claims are made.

Public packages currently resolve at `0.1.0`:

- `@jami-studio/cli`
- `@jami-studio/registry`
- `@jami-studio/renderer`
- `@jami-studio/tokens`
- `@jami-studio/ui`
- `@jami-studio/harness-cli`
- `@jami-studio/harness-artifacts`
- `@jami-studio/harness-contracts`
- `@jami-studio/harness-core`
- `@jami-studio/harness-memory`
- `@jami-studio/harness-observability`
- `@jami-studio/harness-policy`
- `@jami-studio/harness-provider-local`
- `@jami-studio/harness-runtime`
- `@jami-studio/harness-sdk`
- `@jami-studio/harness-store-local`
- `@jami-studio/harness-tools`

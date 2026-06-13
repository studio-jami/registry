# Release Evidence

The current public release posture separates three kinds of evidence:

- Static registry hosting evidence from Cloudflare Pages.
- Local package dry-run and clean install smoke evidence.
- GitHub CI/package attestations where workflows generate attestable artifacts.

Do not describe CI/package attestations as GitHub Release artifact attestations. A GitHub Release must exist before release artifact attestation claims are made.

Do not describe local package smokes as public npm publication. Public package claims require packages to resolve from npm and provenance to verify.

# AGENTS.md — registry operating rules

registry is the single public docs host and registry-distribution surface for the Jami Studio
family: the Mintlify docs site, the static Studio UI registry bundle, and the hosted
workbench/workspace preview routes, served from Cloudflare Pages. Read this before editing.

Canonical repo identity: `registry` at `https://github.com/studio-jami/registry.git`.

## Source of truth

- The live site is authoritative: `docs.json` (site settings, IA, nav, branding), the `.mdx`
  pages, the generated `public/` bundle, and the Cloudflare Pages worker (`public/_worker.js`).
- Docs standards live in `docs/_standards/` (symlink to the canonical
  `_ops/planning/_standards/`). The docs this repo hosts follow the user-manual standard;
  registry carries no internal dev docs.
- Cross-repo planning, roadmaps, decisions, research, and agent coordination are canonical in
  `_ops` under `_ops/planning/registry/` (see `_ops/planning/source-of-truth-policy.md`).
  Orchestration logs, planning notes, and worker checkouts live outside this repo.
- A roadmap or report is a guide, not proof — verify against the live site and bundle.

## Owned surface

- The published Mintlify docs surface: IA, nav, site settings, branding, SEO/AIEO, analytics
  wiring, and variables in `docs.json` and the `.mdx` pages.
- The static registry distribution under `public/` (registry bundle, per-item descriptors,
  workspace install-graph manifests) and the hosted workbench/workspace preview routes.
- Bundle validation and release automation in `scripts/` and `.github/workflows/`.

## Boundary

registry hosts and publishes; it does not own product source. Product prose originates from
each product repo's `docs/` (jami-harness, studio-ui), and the registry bundle under `public/`
is **generated in `studio-ui`**. Fix product source in the owning repo and republish or
regenerate rather than diverging here, and do not restate product runtime/contract ownership
in this repo.

## Hard rules

- Customer-visible claims must match reality. Document only verified behavior; harness and
  studio-ui expose a Developer Reference (SDK · CLI · Contracts), not a REST API.
- Generated `public/` artifacts trace back to their `studio-ui` source. Regenerate; never
  hand-edit generated bundle or descriptor files.
- No mocks, placeholder pages, fabricated endpoints, hidden demo data, or weakened validation
  in the published surface.
- Use the locked `workspace` taxonomy in docs and item naming; do not introduce
  "suite"/"studio"/"lane" as product wording. Stable preview-route URLs may retain their
  existing path values where hosting requires it.
- Secrets never land in tracked files or generated output. Publishable analytics IDs are read
  from env per the active plan; `.env` is gitignored, `.env.example` carries names only.
- Work from first principles: ask why a constraint or surprise exists, several layers deep,
  before choosing a fix. Never trade away integrity, security, correctness, or evidence
  quality for speed.
- No-cost constraint: stay within approved subscriptions, credits, and free tiers. Cost is
  approved only once the product demands it; stop and report rather than incur spend.

## Verification

Run the narrowest complete set for what changed, then the full gate before claiming done.

- Docs/site: `node scripts/check-registry.mjs`; `mint broken-links` (zero) and `mint dev`
  render locally; `git diff --check`.
- Bundle: regenerate from `studio-ui` (`pnpm -C ../studio-ui contracts:generate` plus the
  workbench build), then `node scripts/check-registry.mjs`; diff `public/registry.json` for
  intended changes only, with no item loss.
- Secrets: scan tracked files and generated output → zero hits.

If a command cannot run because the surface does not exist yet, say so directly rather than
papering over it. GitHub Actions are a manual fallback while minutes are limited; do not push
unverified work and expect CI to catch it.

## Closeout

Before final response:

- Confirm no secrets were written to tracked files or command output.
- Keep the active `_ops` roadmap and durable docs accurate; leave unrelated changes untouched.
- Report what changed, what was verified, and what could not run.
- Stage only the intentional changeset, use a conventional commit subject and body, and push
  to the configured remote.

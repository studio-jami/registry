# Documentation Standards

This is the canonical documentation standard for the Jami Studio OSS family. Product repos may keep short pointer files for local navigation, but they must not fork this standard.

## Ownership

- The live implementation, schemas, generated artifacts, tests, release outputs, and deployed surfaces own executable truth.
- Durable architecture docs explain ownership, data flow, contracts, and runtime boundaries.
- Operations docs explain how to run, verify, publish, and support each surface safely.
- Product prose belongs in the repo that owns the surface and publishes through `registry` when it is public docs.
- Research and feasibility docs are dated source reports, not operating policy.
- Roadmaps hold active execution steps and retire after durable docs carry lasting rules.

## Canon Pipeline

One canon source should feed public docs, changelog entries, release notes, system maps, architecture diagrams, SDK/CLI/contract references, user guides, marketing claims, support runbooks, incident playbooks, and regression assertions.

Generated content must include enough metadata to identify its source contract, generation time, generator version, and verification state.

When implementation packages exist, keep docs, marketing, legal/support material, user manuals, architecture diagrams, system maps, changelogs, and release notes generated from accepted contracts, manifests, fragments, and evidence packets rather than copied by hand.

## Link Policy

- Prefer links to stable directories and source-owned files.
- Avoid links from durable docs to dated roadmap files unless describing history.
- Legacy links are allowed only when a doc is explicitly describing history.
- Do not add subdirectory README files unless the directory owns a stable index or executable truth.
- For Mintlify, keep page paths compatible with `docs.json`; avoid top-level `api` as a folder name because Mintlify reserves that route.

## Drift Controls

- Do not duplicate provider lists, model rosters, route maps, repository URLs, analytics IDs, framework versions, dependency pins, pricing, protocol versions, benchmark tables, or volatile status tables in durable docs when source data can own them.
- If a value is expected to change with setup or runtime status, point to the source artifact, deployment config, official provider docs, or a status record instead.
- Verify drift-prone external facts against official provider or standards sources before changing them.
- Do not promote a provider, model, framework, protocol, domain-routing, analytics, dependency, licensing, or benchmark claim to stable without recorded evidence or official-source citation.
- Public claims must be backed by accepted source records or verified artifacts.

## Status Handling

- Status docs record commands, dates, outputs, provider-access failures, and safety checks when they matter.
- Status docs are not the primary operating guide. If a status record creates a lasting rule, promote the rule into the durable doc that owns it.
- Do not leave hidden open decisions in prose. Put them in a roadmap, report, status note, or decision record.

## Security

- Never write secrets into docs, fixtures, screenshots, metadata, generated output, traces, logs, or examples.
- Redact account identifiers unless needed for local operator setup and safe to share.
- Separate documented environment variable names from actual values.
- Treat tool descriptions and external server metadata as untrusted unless they come from a trusted source.

## Retirement

- Retire completed or superseded plans only after their durable rules are promoted.
- Product repos may choose deletion or a `_legacy/` shelf according to their own operating policy, but public docs must not surface dead copies.
- When retiring or deleting a doc, repair active links and keep only the stable rule in the durable doc that owns it.

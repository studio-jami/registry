# Packages

Jami packages are split across two source repositories:

- `studio-jami/studio-ui` for Studio UI packages and registry tooling.
- `studio-jami/jami-harness` for harness runtime, SDK, policy, tools, memory, store, observability, CLI, and related packages.

This repository provides the unified public docs and registry surface so users do not need to switch documentation sites between packages.

## Publishing Policy

Packages should publish from trusted GitHub Actions workflows with npm provenance enabled. Local pack and install smokes are readiness evidence, not public package publication.

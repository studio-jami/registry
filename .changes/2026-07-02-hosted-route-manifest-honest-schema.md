---
type: ops
surface: registry
---

Reconcile the hosted-route manifest onto the honest schema across repos. The Studio UI
generator emits `status: "preview-artifacts-present"` with `registryPreviewArtifactPresent`
/ `docsPreviewArtifactPresent` / `workbenchPreviewArtifactPresent` /
`workspaceRoutePreviewArtifactsPresent` (local preview artifacts present; live serving is
proven by `hosted:live:check`, not asserted by the build). `check-registry.mjs` now asserts
those honest fields instead of the old `publicXClaimed`/"…live" names, and
`public/hosted-route-manifest.json` is synced to the honest build output — no more overclaim,
no cross-repo drift.

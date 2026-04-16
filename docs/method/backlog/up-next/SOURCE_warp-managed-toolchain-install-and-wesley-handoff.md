---
title: Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff
status: proposed
---

# Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff

## Why

`warp` now lives in Continuum, writes `warpspace.toml`, writes
`warpspace.lock.json`, applies a WARPspace template, materializes shared family
sources, stages the current-process Node runtime, and stages a sibling Wesley
entrypoint for the local demo profile.

The remaining missing product boundary is that released profiles still do not
install real downloadable toolchain artifacts and still do not default to a
managed Node bundle.

That means the user-facing story is not yet honest enough:

- released profiles should not depend on sibling-repo Wesley paths
- released profiles should not depend on the current process Node binary
- the managed toolchain should land under `.warpspace/packages/`
- the release path should use real package source sites rather than only
  `local-packages` or sibling proof modes

## Goal

Teach `warp` to acquire downloadable toolchain artifacts into `.warpspace/`,
install a managed Node bundle for released profiles, and invoke the managed
Wesley binary without sibling-repo assumptions.

## Done When

- released `warp init` installs Wesley from a downloadable managed artifact
  instead of a sibling-repo source path
- released `warp init` installs a managed Node runtime according to the profile
  policy instead of reusing the current process Node binary
- released `warp init` resolves those installs through a real package source
  site instead of the local proof-only `local-packages` source
- `warpspace.lock.json` records artifact digests, install receipts, exact tool
  locations, and resolved Node runtime provenance
- the first successful released-profile generation pass no longer depends on
  sibling-repo toolchain inputs

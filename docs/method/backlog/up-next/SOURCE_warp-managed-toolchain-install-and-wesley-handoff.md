---
title: Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff
status: proposed
---

# Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff

## Why

`warp` now lives in Continuum, writes `warpspace.toml`, writes
`warpspace.lock.json`, applies a WARPspace template, materializes shared family
sources, stages the current-process Node runtime, and can stage Wesley either
as a legacy Node entrypoint or as a native Rust binary.

The remaining missing product boundary is that released profiles still do not
install real downloadable toolchain artifacts and still do not default to a
managed Node bundle.

That means the user-facing story is not yet honest enough:

- released profiles should not depend on sibling-repo Wesley paths
- released profiles should not depend on npm or a Node-hosted Wesley entrypoint
- released profiles should not depend on the current process Node binary
- the managed toolchain should land under `.warpspace/packages/`
- the release path should use real package source sites rather than only
  `local-packages` or sibling proof modes

## Goal

Teach `warp` to acquire downloadable toolchain artifacts into `.warpspace/`,
install a managed Node bundle for released profiles, and invoke the managed
native Wesley binary without sibling-repo or npm-entrypoint assumptions.

## Current Proof Slice

`apps/warp/src/init.mjs` now records a Wesley runner and command set. The proof
harness supports:

- `node-entrypoint` with `legacy-node` commands for the old projection surface
- `native-binary` with `native-rust` commands for the Rust `wesley` CLI

`apps/warp/test/warp-init.test.mjs` proves that a sibling Rust `wesley` binary
can be staged under `.warpspace/packages/wesley/` and invoked directly with
`wesley emit typescript`.

The demo release manifest remains explicit about its legacy command set because
it still requests `zod`, `echo-ir`, and `warp-ttd` projections whose Rust-native
equivalents are not implemented yet.

## Done When

- released `warp init` installs Wesley from a downloadable managed artifact
  instead of a sibling-repo source path
- released `warp init` invokes the native Rust Wesley binary directly, not
  through Node
- released `warp init` installs a managed Node runtime according to the profile
  policy only for selected projections or host steps that actually require Node
- released `warp init` resolves those installs through a real package source
  site instead of the local proof-only `local-packages` source
- `warpspace.lock.json` records artifact digests, install receipts, exact tool
  locations, Wesley runner/command-set provenance, and resolved Node runtime
  provenance where applicable
- the first successful released-profile generation pass no longer depends on
  sibling-repo toolchain inputs

---
title: Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff
status: proposed
---

# Warp Managed Toolchain Install, Node Runtime, And Wesley Handoff

## Why

`warp` now lives in Continuum, writes `warpspace.toml`, writes
`warpspace.lock.json`, applies a WARPspace template, and materializes shared
family sources.

The remaining missing product boundary is that it still needs an explicit local
Wesley binary for generation and still has no real Node runtime policy.

That means the user-facing story is not yet honest enough:

- the user should not have to know where Wesley lives
- the user should not pass `--wesley-bin`
- the user should not have to guess whether Node is installed or compatible
- the managed toolchain should land under `.warpspace/packages/`

## Goal

Teach `warp` to acquire the stack toolchain into `.warpspace/`, establish a
compatible Node runtime, and invoke the managed Wesley binary automatically.

## Done When

- `warp init --profile demo` can install or unpack the selected Wesley tool
  into `.warpspace/packages/`
- `warp init --profile demo` can install or resolve the selected Node runtime
  according to the profile policy
- `warp init` can invoke that managed Wesley binary without `--wesley-bin`
- `warpspace.lock.json` records the managed install receipts, exact tool
  locations, and resolved Node runtime provenance
- the prototype no longer depends on sibling-repo Wesley paths for the first
  successful generation pass

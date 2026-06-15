---
title: Investigate Bun And Deno As Warp Managed Runtimes
status: proposed
---

# Investigate Bun And Deno As Warp Managed Runtimes

## Idea

Run a bounded runtime spike on Bun and Deno as possible managed runtimes for
`qw` to use internally when invoking Wesley and related JS/TS tooling.

The question is not whether `qw` itself should become a JS CLI.
The question is whether the managed runtime inside `.warpspace/packages/` could
be lighter-weight than Node without introducing semantic drift.

## Why It Is Interesting

The current safe default is still managed Node because Wesley is explicitly
Node-shaped today.

But Bun or Deno could still be worth testing if they might offer:

- smaller managed runtime footprint
- faster cold start for local bootstrap and generation
- simpler distribution posture for the internal JS toolchain

## Done When

- one narrow spike runs a representative Wesley command set under Bun
- one narrow spike runs the same set under Deno
- output parity or incompatibility is documented for each
- any required code changes are treated as evidence, not hand-waved away
- the result clearly says whether either runtime is credible for future
  managed-profile use

## Not Yet

Do not let this displace the current release rule:

- released WARPspace profiles still default to managed Node

Treat Bun and Deno as bounded investigation candidates, not as ambient reasons
to weaken the current runtime policy before there is evidence.

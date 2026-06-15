---
title: Add A Real Downloadable Warp Package Source Site
status: proposed
---

# Add A Real Downloadable Warp Package Source Site

## Idea

Add the first real downloadable package source-site kind for `qw`, so
released profiles can install managed toolchain artifacts without relying on
local sibling repos or the proof-only `local-packages` source.

Candidate source-site kinds could include:

- GitHub release assets
- Continuum-controlled HTTP artifact indexes
- internal mirrors

## Why It Is Interesting

`qw` now supports multiple source sites in principle and already has a
working `local-packages` proof path.

The next release-facing distribution problem is not package-source doctrine.
It is choosing and implementing one real downloadable source-site kind.

## Done When

- one real downloadable source-site kind is defined
- `qw` can resolve and stage at least one toolchain component from it
- manifest fields for URL, digest, archive shape, and entrypoint are frozen
- `local-packages` remains available as the local proof and test source

## Not Yet

Do not let this displace the current critical path around managed Node policy,
Wesley handoff, and bridge-debt removal.

This is a release-facing follow-on, not urgent stack surgery.

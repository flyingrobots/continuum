---
title: Wesley No-Sibling-Checkout Handoff
status: proposed
---

# Wesley No-Sibling-Checkout Handoff

## Why

The current Continuum checkout is not clone-and-run honest for Wesley work.
Several Continuum paths still assume a sibling `../wesley` checkout or a
workspace-relative Wesley source tree, which means a fresh clone of this repo
cannot execute the full Wesley-backed stack without extra local setup.

That is not an acceptable release posture.

## Current Evidence

The hard dependency still shows up in three places:

- `wesley/support/wesley-deps.mjs` prefers installed `@wesley/*` packages, but
  still falls back to `../wesley` source paths and sibling checkout layout
- `wesley/ttd/*` imports Wesley core ports directly from the sibling source
  tree instead of a packaged boundary
- `wesley/test/test_helper.bash` defaults the CLI to
  `../wesley/packages/wesley-host-node/bin/wesley.mjs`

The repo also contains Bats integration tests that assume a runnable Wesley CLI
at that path, so the test harness inherits the same hidden workspace contract.

## Goal

Make Continuum runnable from a standalone clone without requiring a sibling
Wesley checkout.

That means:

- no runtime import paths that point at `../wesley`
- no test helper defaults that depend on a sibling checkout
- no documentation that presents the sibling layout as the normal product path
- all Wesley dependencies resolved through published artifacts, explicit
  installed packages, or a repo-local shim that does not require another clone

## Proposed Boundary

Continuum should treat Wesley as one of these, but not both:

1. a published package boundary that the repo installs and imports through
   stable package names
2. a native CLI boundary that Continuum shells out to through a resolved
   executable path

The repo should not mix package resolution, sibling source imports, and local
workspace-relative assumptions in the same runtime path.

## Done When

- a fresh clone of Continuum can run the Wesley-backed tests without a sibling
  `../wesley` checkout
- all `wesley/support/wesley-deps.mjs` fallbacks that reach into sibling source
  are removed
- `wesley/ttd/*` no longer imports Wesley ports from workspace-relative source
  paths
- `wesley/test/test_helper.bash` no longer defaults to sibling checkout paths
- the README and local docs describe the released boundary, not the proof-only
  workspace layout

## Handoff Notes

The published Wesley crates are useful, but they do not by themselves fix the
current Node-side imports in this repo. The right next step is to pick a single
packaging boundary and remove the sibling fallback everywhere the repo currently
depends on it.


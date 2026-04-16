---
title: WARPspace Template And Host Scaffold Split
status: proposed
---

# WARPspace Template And Host Scaffold Split

## Why

The first `warpspace init` proof worked, but it exposed a boundary problem:

- the stack release manifest is carrying compatibility truth
- and also carrying demo-shaped host layout truth

That made the bootstrap good enough to generate files, but not yet good enough
to create a plausible starter app.

## Goal

Define one explicit WARPspace template layer that is separate from the stack
release manifest and consumed by the Continuum-owned `warp` CLI.

That template should own:

- package/crate/workspace skeleton
- default output roots
- dependency declarations
- minimal host bootstrap files

The stack manifest should then point at that template instead of hard-coding a
demo repo layout by path.

## Done When

- Continuum has one packet or note that separates stack manifest truth from
  host template truth
- the demo stack manifest points at a template id or template artifact
- `warp init` can scaffold the template before materializing the shared family
  and running generation
- a fresh host repo contains more than generated outputs and WARPspace config

---
title: Repo Cuts From Witness Stack
status: proposed
---

# Repo Cuts From Witness Stack

## Why

Continuum packets `0010` through `0013` now give a much sharper witness ladder:

- `R_core = (J, K, V)`
- `W_core`
- `ReceiptRecord = (W_core, S_receipt)`
- core refinement
- shell refinement
- purpose-indexed equivalence

That is enough structure to stop doing more math for a bit and ask:

> what should actually change in the active repos now?

## Concrete Next Cuts

### Echo

- Separate the Echo-runtime minimum from richer execution narration:
  - replay / admission-bearing core
  - reintegration-bearing core where applicable
  - richer runtime explanation / audit / delivery shell
- Stop flattening runtime truth into one catch-all tick/event envelope when the
  semantics really contains:
  - lawful committed step
  - hidden seam obligations or anchor correspondences
  - richer execution / scheduling / delivery explanation
- Align Echo runtime surfaces with the witness ladder so adapters and shared
  contracts can ask:
  - what is the minimal law-bearing carrier here?
  - what is extra runtime shell?

### `warp-ttd`

- Add an explicit split between:
  - minimal law-bearing local witness surfaces
  - richer explanatory / receipt surfaces
- Stop letting one blob stand in for:
  - site identity
  - reintegration-bearing evidence
  - candidate search explanation
- Shape a neighborhood / merge browser around:
  - `W_core`
  - `R_core`
  - optional `S_receipt`

### Wesley

- Compile core contract surfaces separately from explanatory shells.
- Avoid one omnibus "receipt/witness" surface.
- Make refinement relations explicit where possible:
  - same core, richer shell
  - stronger/weaker purpose-indexed core

### `git-warp`

- Audit current `TickPatch` / `TickReceipt` nouns against the new ladder:
  - replay core
  - reintegration-bearing core
  - explanatory shell
- Identify where current receipt payloads mix:
  - law-bearing minimum
  - host/runtime trace
  - candidate-set explanation
- Record where a first-class witness noun would clarify the existing envelope.

## Done When

- Echo has a design or backlog slice that maps runtime tick/admission
  surfaces onto:
  - witness core
  - optional receipt / runtime shell
- one real `warp-ttd` design slice uses the new core/shell split
- Wesley has a backlog/design note for core-vs-shell compilation surfaces
- `git-warp` has a noun audit or design note that maps `TickPatch` and
  `TickReceipt` onto the new ladder

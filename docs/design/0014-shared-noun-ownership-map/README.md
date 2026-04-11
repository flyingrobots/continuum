---
title: Shared Noun Ownership Map
status: proposed
---

# Shared Noun Ownership Map

**Cycle:** 0014-shared-noun-ownership-map  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze one small ownership law for the active stack so shared nouns stop
drifting across:

- Continuum
- Wesley
- Echo
- `git-warp`
- `warp-ttd`

The goal is not to make every repo say less. The goal is to make every repo
say the same thing at the right layer.

## Why This Exists

The stack is now rich enough that "owner" means several different things:

- who owns the semantics of a noun
- where the canonical authored contract lives
- which repo owns runtime truth for that noun
- which repo owns the observer-facing or product-facing surface

If we do not separate those axes, the same noun gets reinvented in five
places and every repo starts sounding canonical.

## Ownership Law

### 1. Continuum owns semantic vocabulary

Continuum owns the **meaning** of shared cross-repo nouns:

- lane
- worldline
- strand
- braid
- footprint
- witness
- receipt shell
- neighborhood core
- reintegration detail
- observer trace

This is the layer that says what the noun **is**.

### 2. Canonical authored contract homes are per-family, not universal

Shared contract surfaces do not all belong in one repo.

Today the canonical authored homes are split:

- **Continuum-authored shared families**
  - shared observer/debugger and witness/receipt family work under `schemas/`
- **`warp-ttd`-authored families**
  - debugger/session/browser protocol surfaces
- **host-local runtime schemas**
  - where a shared family does not yet exist

This is the layer that says where the noun is **declared for interchange**.

### 3. Wesley owns compilation and publication of shared contract families

Wesley is not the semantic owner of every noun and not the authored home of
every schema. Wesley owns:

- contract compilation
- generated consumer artifacts
- conformance / witness publication lanes
- realization manifests and publication boundaries

This is the layer that says how a contract family **travels**.

### 4. Echo and `git-warp` own runtime truth

Echo and `git-warp` own the substrate/runtime truth of the nouns they realize.

This is the layer that says how a noun **actually exists in execution**.

### 5. `warp-ttd` owns observer/session/product surfaces

`warp-ttd` owns:

- debugger session semantics
- browser/TUI/CLI/MCP delivery
- host-neutral observer/control protocol surfaces
- neighborhood browser / provenance / replay product behavior

This is the layer that says how a noun is **seen and operated on**.

## Map

| Noun | Semantic Owner | Canonical Authored Home | Runtime Truth Today | Product / Observer Owner | Current Debt |
| --- | --- | --- | --- | --- | --- |
| `Lane` | Continuum | Missing shared family | host-local only | `warp-ttd` consumes lane-like summaries | base kind not yet first-class in contracts |
| `Worldline` | Continuum | host-local today (`echo-runtime-schema`, `git-warp` types) | Echo + `git-warp` | `warp-ttd` | shared lane/worldline family missing |
| `Strand` | Continuum | host-local today | `git-warp` first-class; Echo partial | `warp-ttd` consumer | shared strand family missing |
| `Braid` | Continuum | missing | no first-class runtime owner yet | future `warp-ttd` / host adapters | still math-first |
| `Footprint` | Continuum | host-local today | Echo + `git-warp` | `warp-ttd` should consume summaries, not own semantics | focus-boundary-rich footprint not yet shared |
| `Observer` | Continuum | `warp-ttd` protocol/design vocabulary | host adapters synthesize from runtime truth | `warp-ttd` | host-local observer-trace shape missing |
| `Receipt` | Continuum | `schemas/continuum-receipt-family.graphql` + host-local realizations | Echo + `git-warp` | `warp-ttd` summaries | core vs shell split still uneven |
| `Witness` | Continuum | `schemas/continuum-receipt-family.graphql` and later shared witness families | partial in Echo + `git-warp` | `warp-ttd` consumes summaries | witness-core families not fully authored |
| `NeighborhoodCore` | Continuum | missing shared family today; first target is `warp-ttd` protocol | synthesized in hosts | `warp-ttd` | needs contract + adapter cutover |
| `ReintegrationDetail` | Continuum | missing shared family today; first target is `warp-ttd` protocol | synthesized in hosts | `warp-ttd` | needs `R_core`-shaped summaries |
| `ReceiptShell` | Continuum | split between Wesley receipt family and `warp-ttd` summaries | Echo + `git-warp` | `warp-ttd` | shell/core boundary still uneven |
| `EffectEmission` | Continuum | `warp-ttd` protocol summaries | Echo finalized channels / `git-warp` effect nodes | `warp-ttd` | summary contract exists; host semantics still differ |
| `ObserverTrace` | Continuum | missing shared family | not first-class in hosts yet | `warp-ttd` | needs explicit contract + adapter work |
| `DeliveryObservation` | Continuum | `schemas/continuum-receipt-family.graphql` and `warp-ttd` summary surfaces | host/policy-layer truth | `warp-ttd` | dual-home split needs tightening |
| `SessionMode` / `SessionSignal` | Continuum semantic framing | `warp-ttd` protocol + design | above substrate | `warp-ttd` | host adapters must surface mode/signal honestly |

## Immediate Consequences

### 1. Continuum should stop trying to own every schema

Continuum owns the semantic and coordination map. It should not become a shadow
schema repo for **every** contract next to Wesley or `warp-ttd`.

It should, however, own the authored home for shared cross-engine families that
need one canonical semantic source. Those live under [schemas](../../../schemas/README.md).

### 2. Wesley should compile family boundaries, not flatten them

Wesley should increasingly publish separate families or family cuts for:

- witness core
- receipt shell
- neighborhood core
- reintegration detail
- lane/worldline identity once authored

### 3. `warp-ttd` should stop treating host-local rows as if they were already neighborhoods

Neighborhood core and reintegration detail are their own nouns, not just
"receipt but with more tabs."

### 4. Echo and `git-warp` should expose host truth without pretending they already have the shared family

If a host must synthesize a neighborhood or observer trace today, that is fine.
It should be named as synthesis, not quietly presented as if the shared
contract already exists.

## Repo Cuts Triggered By This Map

### Continuum

- keep this map current
- pair it with the compatibility matrix and witness cuts

### Wesley

- separate witness core from receipt shell in compiled contract thinking
- compile Continuum-authored shared families without re-owning their authored source

### Echo

- narrow `ttd-browser` into a browser host bridge
- split `echo-session-proto` so retained TTD/browser framing stops sharing a bucket with dead transport residue

### `warp-ttd`

- introduce neighborhood core / reintegration detail as first-class protocol cuts
- add Browser TTD as a delivery adapter
- add observer trace and session signal surfaces without smearing them into effects

### `git-warp`

- surface local site / witness / receipt boundaries honestly for host-adapter work
- keep effect entities, observer traces, and delivery policy split clean

## Done Looks Like

- Continuum has one ownership law instead of repo folklore
- each downstream repo can point back here instead of re-arguing the split
- backlog notes in Echo, `git-warp`, `warp-ttd`, and Wesley align to the same noun map

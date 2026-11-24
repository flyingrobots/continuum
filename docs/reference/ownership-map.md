---
title: Shared Noun Ownership Map
status: current
---

# Shared Noun Ownership Map

This page is the ownership law for shared cross-repo nouns: for each noun it
records **four separate ownership axes** so the same noun stops being reinvented
in five repos. It is reference, not history; the original decision is recorded in
the [0014 design packet](../design/0014-shared-noun-ownership-map/README.md).

"Owner" is not one thing. Keep these axes distinct:

- **Semantic owner** — who defines what the noun *means*. For every shared
  cross-repo noun this is Continuum.
- **Authored home** — where the noun is *declared for interchange*. For families
  Continuum has authored, this is a file under [`schemas/`](../../schemas/README.md);
  otherwise it is host-local or not yet authored.
- **Runtime truth** — which repo makes the noun *exist in execution* (Echo,
  `git-warp`).
- **Product / observer owner** — which repo *surfaces and operates on* the noun
  (`warp-ttd`).

Per-family evidence and compatibility status live in the
[Contract Family Registry](../contract-family-registry.md); this page records
ownership, not evidence.

## Map

Authored homes below are the current authored families under `schemas/`. A noun
with no shared family is marked host-local — that is honest, not a defect.

| Noun | Semantic owner | Authored home | Runtime truth | Product / observer owner |
| --- | --- | --- | --- | --- |
| `Lane` | Continuum | none yet (host-local) | host-local | `warp-ttd` (consumes lane summaries) |
| `Worldline` | Continuum | none yet (host-local) | Echo + `git-warp` | `warp-ttd` |
| `Strand` | Continuum | none yet (host-local) | `git-warp` first-class; Echo partial | `warp-ttd` |
| `Braid` | Continuum | none yet | no first-class runtime owner | future host adapters |
| `Footprint` | Continuum | none yet (host-local) | Echo + `git-warp` | `warp-ttd` (summaries only) |
| `Receipt` | Continuum | [`continuum-receipt-family.graphql`](../../schemas/continuum-receipt-family.graphql) | Echo + `git-warp` | `warp-ttd` summaries |
| `Witness` | Continuum | [`continuum-receipt-family.graphql`](../../schemas/continuum-receipt-family.graphql) | partial in Echo + `git-warp` | `warp-ttd` summaries |
| `DeliveryObservation` | Continuum | [`continuum-receipt-family.graphql`](../../schemas/continuum-receipt-family.graphql) | host/policy-layer truth | `warp-ttd` |
| `Capability` | Continuum | [`continuum-receipt-family.graphql`](../../schemas/continuum-receipt-family.graphql) | host-local enforcement | `warp-ttd` |
| `NeighborhoodCore` / `NeighborhoodParticipant` | Continuum | [`continuum-neighborhood-core-family.graphql`](../../schemas/continuum-neighborhood-core-family.graphql) | synthesized in hosts | `warp-ttd` |
| Settlement nouns (`SettlementRequest`, `SettlementDelta`, `ImportCandidate`, `ConflictArtifact`, `SettlementDecision`, `SettlementPlan`, `SettlementResult`) | Continuum | [`continuum-settlement-family.graphql`](../../schemas/continuum-settlement-family.graphql) | synthesized / partial in hosts | `warp-ttd` |
| Runtime-boundary nouns (`IntentEnvelope`, `TickResult`, `ObserverPlan`, `ObservationRequest`, `ReadingEnvelope`, `ContinuumEvidenceStatus`, `WitnessedSuffixShell`, `CausalSuffixBundle`, `ImportOutcome`) | Continuum | [`continuum-runtime-boundary-family.graphql`](../../schemas/continuum-runtime-boundary-family.graphql) | not yet runtime-witnessed | `warp-ttd`, app hosts |
| `ReintegrationDetail` | Continuum | none yet | synthesized in hosts | `warp-ttd` |
| `ObserverTrace` | Continuum | none yet (closest authored surface is `ObserverPlan`) | not first-class in hosts | `warp-ttd` |

## Consequences

1. **Continuum does not own every schema.** It owns the semantic and ownership
   map plus the authored home for *shared* cross-engine families. App-local and
   engine-local schemas stay in their own repos.
2. **Wesley compiles family boundaries, it does not flatten them.** Witness core,
   receipt shell, neighborhood core, settlement, and runtime boundary stay
   separable families.
3. **Synthesis must be named as synthesis.** If a host must synthesize a noun
   that has no authored shared family yet (e.g. `ReintegrationDetail`,
   `ObserverTrace`), it says so rather than presenting the synthesis as the
   shared contract.

## Related

- [Contract Family Registry](../contract-family-registry.md) — evidence and compatibility status per family.
- [Schemas](../../schemas/README.md) — the authored homes themselves.
- [Continuum invariants](../invariants/CONTINUUM.md) — the rules these ownership axes serve.

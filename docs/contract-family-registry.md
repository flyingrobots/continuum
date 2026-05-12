---
title: Contract Family Registry
status: active
---

# Contract Family Registry

This registry is the Continuum-owned cross-repo map for shared contract
families.

It answers four practical questions:

- where is the family authored?
- what shared nouns does it publish?
- what evidence exists today?
- what compatibility cut is still missing?

The registry is not a runtime, compiler, schema replacement, or wire protocol.
It is coordination truth. The authored GraphQL family remains the contract
source. Wesley compiles and witnesses. Sibling runtimes and tools emit or
consume values that conform to those families.

## Registry Rules

1. A registry row names a shared family, not an implementation.
2. Authored home, compiler owner, runtime emitter, and consumer are separate
   roles.
3. Echo and `git-warp` are sibling Continuum runtime implementations. Neither
   one receives a privileged role from this registry.
4. Runtime posture terms such as browser-hosted, durable, archival, low-latency,
   offline-first, hot, or cold are deployment metadata. They do not assign
   protocol roles.
5. A family is not considered runtime-proven until a sibling runtime emits or
   consumes conforming values and a witness records the claim.
6. A mirror, generated artifact, fixture, or cache is not the authored family.

Registry keys are repo-local labels. They are not yet stable wire ids.

## Status Vocabulary

| Status | Meaning |
| --- | --- |
| `authored` | The GraphQL source exists in Continuum under `schemas/`. |
| `profiled` | The Continuum Wesley module has a named compile or bundle profile. |
| `fixture-witnessed` | Wesley tests check generated surfaces against fixtures. |
| `runtime-open` | Live sibling runtime emission or admission is not yet witnessed. |
| `interop-open` | Cross-runtime exchange has not yet been proven. |

## Family Matrix

| Registry key | Version | Authored home | Shared nouns | Wesley status | Runtime status | Primary consumers | Evidence today | Open cut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `receipt-family` | `0.1.0` | [`schemas/continuum-receipt-family.graphql`](../schemas/continuum-receipt-family.graphql) | `Receipt`, `DeliveryObservation`, `Capability`, `Witness` | `profiled`, `fixture-witnessed` | `runtime-open` | Echo, `git-warp`, `warp-ttd`, app/tool repos through generated artifacts | `wesley/test/witness-continuum.bats`, `wesley/test/contract.bats`, receipt fixtures | Replace fixture/mock vectors with live sibling-runtime receipt publication. |
| `settlement-family` | `0.1.0` | [`schemas/continuum-settlement-family.graphql`](../schemas/continuum-settlement-family.graphql) | `SettlementRequest`, `SettlementDelta`, `ImportCandidate`, `ConflictArtifact`, `SettlementDecision`, `SettlementPlan`, `SettlementResult` | `profiled`, `fixture-witnessed` | `runtime-open` | Echo, `git-warp`, `warp-ttd`, app/tool repos through generated artifacts | `wesley/test/witness-continuum.bats`, settlement fixtures | Prove live settlement values from sibling runtime suffix/import flows. |
| `neighborhood-core-family` | `0.1.0` | [`schemas/continuum-neighborhood-core-family.graphql`](../schemas/continuum-neighborhood-core-family.graphql) | `NeighborhoodCore`, `NeighborhoodParticipant`, `AdmissionOutcomeKind` | `authored` | `runtime-open` | `warp-ttd`, Echo, `git-warp`, app/tool observers | Authored schema and design packet `0022` | Add Wesley profile and fixture witness before claiming runtime support. |
| `runtime-boundary-family` | `0.1.0` | [`schemas/continuum-runtime-boundary-family.graphql`](../schemas/continuum-runtime-boundary-family.graphql) | `IntentEnvelope`, `TickResult`, `ObserverPlan`, `ObservationRequest`, `ReadingEnvelope`, `WitnessedSuffixShell`, `CausalSuffixBundle`, `ImportOutcome` | `authored` | `runtime-open`, `interop-open` | Echo, `git-warp`, Wesley, `warp-ttd`, app/tool hosts | Authored schema and design packets `0027`/`0028` | Add Wesley profile, then prove witnessed suffix exchange/admission between sibling runtimes. |

## Runtime-Boundary Noun Matrix

This section expands the active `runtime-boundary-family` spine because it is
the next compatibility target.

| Noun | Boundary role | Expected producers | Expected consumers | Evidence cut still missing |
| --- | --- | --- | --- | --- |
| `IntentEnvelope` | Set-side intent carrier. | App hosts, Echo, `git-warp`, or another sibling runtime. | Sibling runtimes and Wesley witness tooling. | Generated profile plus one runtime emission fixture. |
| `TickResult` | Immediate admission result. | Echo, `git-warp`, or another sibling runtime. | App hosts, `warp-ttd`, Wesley witness tooling. | Live admission value mapped to authored outcome kind. |
| `ObserverPlan` | Get-side observer plan. | App hosts, `warp-ttd`, runtime adapters. | Sibling runtimes and observer tooling. | Profile fixture that preserves plan identity and source metadata. |
| `ObservationRequest` | Request for one observer-relative reading. | App hosts, `warp-ttd`, runtime adapters. | Sibling runtimes and witness tooling. | Query/read path proof linking request to plan. |
| `ReadingEnvelope` | Observer-relative reading result. | Echo, `git-warp`, or another sibling runtime. | App hosts, `warp-ttd`, sibling runtimes. | Witness that reading links request, plan, lane, and backing shell. |
| `WitnessedSuffixShell` | Compact source suffix evidence: source worldline, tick bounds, ordered provenance entries, boundary witness, digest, and optional basis report. | Echo, `git-warp`, or another sibling runtime. | Sibling runtimes and Wesley witness tooling. | Export fixture matching Echo's witnessed suffix shell shape. |
| `CausalSuffixBundle` | Transport/import question: base frontier, target frontier, source shell, and bundle digest. | Echo, `git-warp`, or another sibling runtime. | Sibling runtimes and Wesley witness tooling. | Bundle fixture proving shell-equivalence identity. |
| `ImportOutcome` | Distributed suffix admission result wrapping novelty posture and `WitnessedSuffixAdmissionResponse`. | Target sibling runtime. | Source sibling runtime, `warp-ttd`, app hosts. | Admission witness linking outcome to `CausalSuffixBundle`. |

## Repo Role Matrix

| Repo | Registry role | Must not become |
| --- | --- | --- |
| Continuum | Semantic owner, authored home for shared families, registry owner. | A runtime, substrate, or third engine. |
| Wesley | Compiler, bundle, manifest, codec, witness, and drift-watch owner. | Semantic owner for Continuum families. |
| Echo | Sibling runtime implementation that may emit and consume conforming values. | A subordinate runtime below `git-warp`. |
| `git-warp` | Sibling runtime implementation that may emit and consume conforming values. | The durable half of Echo. |
| `warp-ttd` | Debugger, operator surface, and generated-artifact consumer. | A hand-normalized substitute for shared contracts. |
| Graft | Planned structural observer and review engine; expected consumer of runtime-boundary observer nouns such as `ObserverPlan`, `ObservationRequest`, and `ReadingEnvelope`; producer of app-local code-aware structural reading payloads until promotion is warranted. Graft is not a Family Matrix primary consumer until compatible generated-artifact or witness evidence exists. | A runtime implementation, debugger product, shadow Continuum semantic owner, or permanent host-normalization layer. |
| Other app/tool repos | Domain-family authors and generated-artifact consumers. | Shadow homes for Continuum-owned families. |

## Compatibility Claims

| Claim | Current status | Evidence needed before stronger wording |
| --- | --- | --- |
| Wesley can compile and witness the receipt family. | `fixture-witnessed` | Keep contract release, sync, witness, and drift-watch checks green. |
| Wesley can compile and witness the settlement family. | `fixture-witnessed` | Keep settlement witness fixtures and publication-boundary checks green. |
| Neighborhood core is a shared authored family. | `authored` | Add a Wesley profile and fixture witness. |
| Runtime boundary is the next sibling-runtime interop family. | `authored` | Add a Wesley profile and live suffix/admission witness. |
| Echo and `git-warp` interoperate through shared Continuum runtime-boundary values. | `interop-open` | Prove witnessed suffix exchange and admission between sibling runtimes. |

## Maintenance Rule

Update this file when any of these change:

- a Continuum-authored family is added, renamed, or removed
- a family version changes
- Wesley gains or loses a compile, bundle, witness, or drift-watch profile
- Echo, `git-warp`, `warp-ttd`, Graft, or an app repo publishes compatibility
  metadata
- a witness turns a compatibility gap into evidence

Do not update this registry to make a claim aspirationally true. Add the row as
a gap until there is inspectable evidence.

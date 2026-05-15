---
title: Minimum Runtime Boundary Contract Family
status: proposed
---

# Minimum Runtime Boundary Contract Family

**Cycle:** 0028-minimum-runtime-boundary-contract-family
**Legend:** SOURCE
**Type:** coordination cycle

Depends on:

- [0016 — Engine-local runtime vs shared observer contract](../0016-engine-local-vs-shared-observer-contract/README.md)
- [0020 — Shared admission and policy publication](../0020-shared-admission-and-policy-publication/README.md)
- [0027 — Witnessed causal suffix sync](../0027-witnessed-causal-suffix-sync/README.md)

## Hill

Freeze the smallest authored Continuum contract slice that the active stack can
actually build against next:

- one set-side envelope family
- one immediate admission result family
- one get-side observer/reading family
- one distributed suffix import/export family

This packet answers the practical question:

**What are the first shared contract nouns that Echo, `warp-ttd`, Wesley, and
apps such as `jedit` should all target before any further runtime-specific
surface work proceeds?**

## Why This Exists

The active repos are now close enough to drift in a more dangerous way.

They agree on the doctrine:

- there is no privileged graph-in-itself
- admission is the common kernel
- observers emit readings rather than expose substrate-owned state
- sync is witnessed suffix admission rather than naive state replication

But they do not yet share one minimum runtime boundary family that cashes this
out operationally.

Without that family:

- Echo may publish its own local envelopes
- `warp-ttd` may normalize by hand at the product boundary
- Wesley may keep generating registries and types without a stable envelope cut
- `jedit` may bind directly to substrate-shaped folklore

That is exactly the kind of shadow contract drift Continuum exists to stop.

## Decision

Continuum should freeze one minimum shared runtime-boundary family with eight
top-level contract nouns plus one explicit evidence-status distinction:

1. `IntentEnvelope`
2. `TickResult`
3. `ObserverPlan`
4. `ObservationRequest`
5. `ReadingEnvelope`
6. `WitnessedSuffixShell`
7. `CausalSuffixBundle`
8. `ImportOutcome`

Evidence status:

- `ContinuumEvidenceStatus`
- `ContinuumNativeEvidence`
- `TranslatedSubstrateEvidence`

This is the first stack-wide cut. It is intentionally smaller than the full
receipt ladder, smaller than full reintegration detail, and smaller than a full
session/control protocol.

Every noun in this packet is a **GraphQL-authored contract family**.

Wesley compiles artifacts for these families. Echo, `git-warp`, and other
sibling Continuum runtimes later produce actual values conforming to them.
Conforming values are not automatically native Continuum witnesses. A runtime
or adapter may use Continuum boundary vocabulary while still publishing only
translated compatibility evidence.

## Shared family meanings

### 1. `IntentEnvelope`

`IntentEnvelope` is the GraphQL-authored family for the shared set-side
carrier.

It names:

- the authored operation family
- the target lane
- the stable payload identity/digest
- enough summary to preserve operation identity without binding the runtime to
  one app's nouns

It is not the same thing as:

- a GraphQL mutation definition
- a runtime-local inbox object
- an admission result

### 2. `TickResult`

`TickResult` is the GraphQL-authored family for the immediate admission result.

It names:

- the admitted lane and coordinate
- the lawful outcome kind
- the immediate witness/receipt reference
- the resulting hologram or boundary reference

Echo, `git-warp`, or another sibling Continuum runtime may later emit actual
`TickResult` values conforming to this family.

It is not the later observer reading.

### 3. `ObserverPlan`

`ObserverPlan` is the GraphQL-authored family for the get-side plan shape.

It names, at minimum:

- aperture / projection identity
- basis identity
- observer state kind
- emission kind

Wesley may compile artifacts and registries for this family. Continuum tools
and sibling runtimes may later materialize actual plan values conforming to it.

It is not the observer instance and it is not the emitted reading.

### 4. `ObservationRequest`

`ObservationRequest` is the GraphQL-authored family for the request to produce
one reading at one coordinate, frontier, or hologram reference under one plan.

It names:

- the plan being used
- the lane being observed
- the source kind / coordinate selector
- the requested basis or hologram handle where applicable

### 5. `ReadingEnvelope`

`ReadingEnvelope` is the GraphQL-authored family for an observer-relative
reading result.

It names:

- which plan produced the reading
- which lane/coordinate it applies to
- the reading payload identity/digest
- the evidence status backing that reading
- the witness or shell reference backing that reading when one exists

Continuum sibling runtimes may later emit actual `ReadingEnvelope` values
conforming to this family. The envelope must still say whether its backing
evidence is native Continuum evidence or translated substrate evidence.

It is not the substrate itself and it is not the same thing as `TickResult`.
It is also not proof of native witnesshood by itself.

### Evidence status

`ContinuumEvidenceStatus` is the GraphQL-authored union that prevents
"Continuum-shaped" from silently becoming "Continuum-native".

It has two branches:

- `ContinuumNativeEvidence`: a runtime-produced native Continuum witness,
  currently represented by a `WitnessedSuffixShell`.
- `TranslatedSubstrateEvidence`: compatibility evidence translated from a
  substrate that is not publishing native Continuum boundary artifacts yet.

`TranslatedSubstrateEvidence.nativeContinuumWitness` is intentionally explicit
and must be false. This makes compatibility useful without allowing a Git range,
commit set, product-local snapshot, or hand-normalized adapter payload to pass
as a Continuum witness.

The doctrinal rule is:

**A project may use Continuum boundary vocabulary without being a native
Continuum publisher. Only Continuum-producing runtimes may claim
Continuum-native witnesshood.**

### 6. `WitnessedSuffixShell`

`WitnessedSuffixShell` is the GraphQL-authored family for the compact source
suffix evidence Echo already exposes at its runtime boundary.

It names:

- source worldline identity
- source suffix start and end ticks
- ordered source provenance entries
- optional boundary witness
- witness digest
- optional settlement/basis evidence

It is a witnessed suffix shell, not a bare patch list or materialized state
snapshot.

### 7. `CausalSuffixBundle`

`CausalSuffixBundle` is the GraphQL-authored family for the distributed
transport/import question.

It names:

- base frontier
- target frontier
- the `WitnessedSuffixShell`
- deterministic bundle digest

The bundle is the unit used for shell equivalence and loop prevention. It is not
a reading cache, snapshot, or local receipt.

### 8. `ImportOutcome`

`ImportOutcome` is the GraphQL-authored family for the distributed admission
result.

It names:

- the imported bundle digest and bundle
- the target runtime/worldline and basis
- the import novelty posture
- the nested `WitnessedSuffixAdmissionResponse`
- the relevant local receipt/witness reference

The suffix admission response preserves Echo's typed suffix outcome family:

- `Admitted`
- `Staged`
- `Plural`
- `Conflict`
- `Obstructed`

The older `SuffixShell` name was a placeholder. Echo is the first runtime
consumer for this boundary, so Continuum now promotes Echo's
`WitnessedSuffixShell` and `CausalSuffixBundle` vocabulary instead of requiring
Echo to adapt to the thinner placeholder.

## Contract Families Versus Artifacts Versus Values

This packet freezes one three-way distinction:

- contract families are authored in GraphQL
- Wesley compiles artifacts for those families
- runtimes and tools later produce actual values conforming to those families

So, for example:

- `ReadingEnvelope` is a family authored in GraphQL
- Wesley may compile TypeScript, Rust, registry, or codec artifacts for that
  family
- Echo may later emit actual `ReadingEnvelope` values at runtime

## What this family is for

This minimum family exists to shape the next real repo cuts:

- Echo should publish and consume these families generically.
- `git-warp` should publish and consume these families generically when it has
  native support; until then, consumers should model its committed-history facts
  as translated substrate evidence.
- Wesley should compile these families into generated artifacts rather than
  inferring them from repo-local folklore.
- `warp-ttd` should consume them instead of turning snapshot-first product
  assumptions into the de facto shared contract.
- `jedit` should author app-local set/get surfaces that compile into these
  carriers.

## What this family is not

This packet does **not** freeze:

- one universal receipt shell
- one universal reintegration detail family
- full session/control protocol families
- app-local mutation or reading nouns
- engine-local scheduler, inbox, or storage structs

Those remain adjacent work.

## Cruft posture

This packet also freezes one hygiene rule for Continuum itself:

- do not answer contract drift by adding overlapping packets that restate the
  same runtime boundary in slightly different words
- do not let smoke scaffolds or local proof artifacts become canonical repo
  truth
- do not let `apps/warp` invent a parallel runtime contract inside product
  bootstrap code

The minimum runtime boundary family should reduce overlap, not create a new
layer of it.

## Smallest honest artifact

The smallest honest artifact for this packet is one authored family:

- [schemas/continuum-runtime-boundary-family.graphql](../../../schemas/continuum-runtime-boundary-family.graphql)

That family is not the final word. It is the first concrete compiler/runtime
target that keeps the stack from guessing.

## Playback questions

### Human

- [ ] Can a human explain the difference between `TickResult` and
      `ReadingEnvelope` without repo-local folklore?
- [ ] Can a human explain why `IntentEnvelope` is not the same thing as a
      GraphQL mutation or host-local inbox row?

### Agent

- [ ] Can I identify one shared set-side envelope, one read-side plan/request
      split, and one suffix import/export shell without deriving them from
      runtime-specific code?
- [ ] Can I point at one Continuum-authored file that says what those nouns
      mean?

## Non-goals

- solving every shared family before the runtime work starts
- replacing settlement, receipt, or neighborhood families
- embedding app-level product semantics in Continuum
- making `warp-ttd` or Wesley the semantic owner of these nouns

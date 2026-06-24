---
title: Shared Noun Glossary
status: current
---

# Shared Noun Glossary

The canonical vocabulary for shared Continuum nouns. One canonical term per
concept; define unfamiliar terms here and link to this page rather than
re-explaining them. Who *owns* each noun is in the
[Shared Noun Ownership Map](ownership-map.md); where each is *authored* is under
[`schemas/`](../../schemas/README.md).

For the app-to-WARP noun mapping used by individual apps (e.g. `jedit`), see the
[app glossary](../../APP_GLOSSARY.md) — that is a per-app coordination aid; this
page is the shared vocabulary.

## Core temporal vocabulary

These are doctrine nouns (the model), not yet first-class schema types — schemas
carry them as `laneId` / `frameIndex` fields today.

| Term | Correct use | Common mistake |
| --- | --- | --- |
| `Lane` | Generic temporal carrier across canonical and speculative cases. | Using `worldline` as if it names every lane kind. |
| `Worldline` | A canonically admitted lane. | Teaching every speculative or plural object as a worldline. |
| `Strand` | A speculative lane with overlay/projection semantics. | Treating it as a frozen fork or as mere UI state. |
| `Braid` | A plural composition over lanes. | Treating it as "just a merge result waiting to happen." |
| `Footprint` | The local site-definition object (subject anchors, read/write/affect/reintegration boundaries). | Reducing it to "things read and written." |
| `Witness` / `Receipt` | Evidence for why admission or publication was lawful. | Treating it as optional metadata. |
| `Reading` | An observer-relative emitted result. | Treating it as the substrate itself. |
| `ObserverSpec` | An authored get-side declaration. | Treating a query DTO as the whole observer. |
| `ObserverInstance` | A hosted runtime observer with current state. | Collapsing it into the spec or the emitted reading. |
| `ContinuumRuntime` | Any sibling implementation that can publish, admit, observe, export, and import witnessed causal history per Continuum families and admission laws. | Treating Echo and `git-warp` as hot/cold halves of one privileged machine. |
| `RuntimePosture` | Deployment characteristics (latency, durability, hosting, archival, browser placement, offline support). | Treating posture as protocol ontology or assigning fixed roles. |

## Authored shared nouns

These nouns exist as authored types today. The authored home is the GraphQL
family; per-noun evidence and compatibility status are in the
[Contract Family Registry](../contract-family-registry.md).

### Receipt family — [`continuum-receipt-family.graphql`](../../schemas/continuum-receipt-family.graphql)

| Noun | Meaning |
| --- | --- |
| `Receipt` | The operational envelope around one realized rewrite. |
| `DeliveryObservation` | Delivery outcome adjacent to a receipt; not the same thing. |
| `Witness` | Minimal semantic residue for a receipt; not the receipt itself. |
| `Capability` | A declaration surface (scope + resource), not runtime policy by itself. |

### Settlement family — [`continuum-settlement-family.graphql`](../../schemas/continuum-settlement-family.graphql)

| Noun | Meaning |
| --- | --- |
| `SettlementRequest` | A request to settle a source lane into a target lane. |
| `SettlementDelta` | Transported suffix comparison window between lanes. |
| `ImportCandidate` | An admissible imported-suffix claim. |
| `ConflictArtifact` | A published artifact for a non-trivial failure to import cleanly. |
| `SettlementDecision` | One ordered judgement inside a settlement plan. |
| `SettlementPlan` | The plan shell over plural decisions. |
| `SettlementResult` | The published settlement outcome (adjacent to reintegration detail, not identical to it). |

### Neighborhood-core family — [`continuum-neighborhood-core-family.graphql`](../../schemas/continuum-neighborhood-core-family.graphql)

| Noun | Meaning |
| --- | --- |
| `NeighborhoodCore` | Shared publication of a local admitted situation around an anchor lane and frame; not the whole braid witness. |
| `NeighborhoodParticipant` | One participant in the published local-site geometry. |
| `AdmissionOutcomeKind` | The shared admission outcome ladder: `DERIVED`, `PLURAL`, `CONFLICT`, `OBSTRUCTION`. |

### Runtime-boundary family — [`continuum-runtime-boundary-family.graphql`](../../schemas/continuum-runtime-boundary-family.graphql)

| Noun | Meaning |
| --- | --- |
| `IntentEnvelope` | Set-side intent carrier; not a mutation definition and not an admission result. |
| `TickResult` | Immediate admission-result family; not the later reading. |
| `ObserverPlan` | The observer plan family; not the observer instance. |
| `ObservationRequest` | A request for one observer-relative reading. |
| `ReadingEnvelope` | An observer-relative reading carrying payload identity plus evidence status. |
| `ContinuumEvidenceStatus` | Union separating `ContinuumNativeEvidence` from `TranslatedSubstrateEvidence`. |
| `WitnessedSuffixShell` | Compact source-suffix evidence; not a patch list. |
| `CausalSuffixBundle` | The transport/import question; not a materialized state snapshot. |
| `ImportOutcome` | A distributed suffix-admission result wrapping novelty posture. |

## Banned collapses

If a new noun cannot survive these distinctions, it is probably sludge:

- mutation operation ≠ compiled intent envelope
- intent envelope ≠ admission result
- admission result ≠ later observer reading
- observer spec ≠ observer instance
- checkpoint marker ≠ every substrate replay checkpoint
- neighborhood publication ≠ full braid witness
- settlement result ≠ full reintegration detail
- translated substrate evidence ≠ native Continuum witness

## Stable wire names that are not ontology

Already-public names; keep them stable where they exist, but read them correctly
and do not build new doctrine on them.

| Wire noun | Read it as |
| --- | --- |
| `state_root` | materialization root hash |
| `snapshot` / `WarpSnapshot` | full replacement / materialized frontier snapshot |
| `worldlineId` | canonical-lane identifier in surfaces that only publish the canonical case |

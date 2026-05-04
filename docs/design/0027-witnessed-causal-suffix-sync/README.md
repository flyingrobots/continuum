---
title: Witnessed Causal Suffix Sync
status: proposed
---

# Witnessed Causal Suffix Sync

**Cycle:** 0027-witnessed-causal-suffix-sync
**Legend:** SOURCE
**Type:** coordination cycle

Depends on:

- [0017 — Settlement publication and shared reintegration contract](../0017-settlement-publication-and-shared-reintegration/README.md)
- [0018 — One graph, two temperatures, and runtime handoff](../0018-one-graph-two-temperatures-and-runtime-handoff/README.md)
  Historical title; corrected there as one witnessed causal history with
  multiple sibling runtimes.

## Hill

Freeze the next interoperability law after `0018`:

- Echo and `git-warp` exchange witnessed causal transitions, not synchronized
  materialized frontier snapshots
- the basic sync unit is a causal suffix bundle rooted at a shared frontier
- import uses the same admission algebra as any other witnessed WARP claim
- runtime posture remains deployment metadata, not causal-history ownership

This packet answers the practical question:

**If Echo and `git-warp` run simultaneously over one shared witnessed causal
history, what exact
thing do they exchange and what law governs import?**

## Why This Exists

`0018` froze the doctrine that Continuum presents:

- one shared witnessed causal history
- multiple sibling runtime implementations
- first-class cross-runtime exchange and admission

That is the correct top-level idea, but it is still too abstract to implement.

Without a concrete sync unit, the stack will drift toward one of two bad
stories:

- state mirroring folklore
- ad hoc host-specific import adapters

Both are wrong.

There is no privileged substrate-owned graph-in-itself "in Echo" or "in
`git-warp`." What is primary is the shared witnessed causal history determined
by:

- admitted history
- boundary transition records
- payload hashes
- lane identities
- frontiers
- checkpoints and wormholes where present

Echo and `git-warp` therefore should not synchronize caches or materialized
views. They should synchronize lawful claims about causal suffixes, then let
lawful optics emit graph-like holographic readings from the resulting history.

## Decision

### 1. The synchronization unit is a witnessed causal suffix

Echo and `git-warp` should exchange a shared bundle category whose meaning is:

- one causal-history identity
- one lane identity
- one source runtime and writer identity
- one base frontier
- one claimed target frontier
- one ordered suffix of witnessed transitions
- any required payload/checkpoint/wormhole references
- one witness proving what is being claimed and why it should be importable

That unit should be called a **causal suffix bundle**.

### 2. Synchronization is not state replication

Continuum rejects the idea that sibling-runtime interoperability means:

- copying the latest materialized reading
- copying the latest checkpoint blob
- replaying a rendered observer view back into history

Shared cache contents are optional.
Shared causal history is mandatory.

Cache equivalence is not history equivalence.
Materialization equivalence is not history equivalence.

### 3. Import is another witnessed admission problem

Importing a suffix bundle is not a separate synchronization folklore path.

It is the same class of problem as any other witnessed WARP admission:

1. normalize the claim to a known frontier
2. verify history, lane, payload, and witness identity
3. evaluate overlap and dependency geometry
4. admit, stage, braid, conflict, or obstruct
5. emit a receipt or witness for the local decision

### 4. No last-write-wins

If Echo and `git-warp` produce distinct successors from the same frontier,
that is not resolved by wall-clock arrival or timestamp recency.

It is:

- a fork
- a strand
- a braid
- a conflict
- or an obstruction

depending on causal overlap and policy.

Host time explains when a claim arrived.
History time explains what happened.

### 5. Runtime posture stays engine-local

Runtime posture terms may describe:

- low-latency
- durable
- archival
- browser-hosted
- decentralized
- offline-first
- observer-hosting
- checkpoint-heavy
- slice-oriented

Those differences are runtime freedom and deployment metadata. They are not
permission to publish different causal-history semantics, and they do not make
Echo subordinate to `git-warp` or `git-warp` the durable half of Echo.

## Shared Bundle Family

The first concrete shared sync object should look roughly like this:

```text
CausalSuffixBundle {
    history_id:        HistoryId,
    source_runtime_id: RuntimeId,
    source_writer_id:  WriterId,
    lane_id:           LaneId,
    base_frontier:     Frontier,
    target_frontier:   Frontier,
    transitions:       Vec<BoundaryTransitionRecord>,
    payload_refs:      Vec<PayloadRef>,
    checkpoints:       Option<Vec<CheckpointRef>>,
    wormholes:         Option<Vec<WormholeRecord>>,
    signatures:        Option<Vec<SignatureEnvelope>>,
    export_witness:    ExportWitness,
}
```

The exact field names may vary by family cut, but the shared meaning must not.

### Required meaning

- `history_id`
  - shared witnessed causal-history identity
- `source_runtime_id`
  - which runtime exported the suffix
- `source_writer_id`
  - which writer produced the transitions
- `lane_id`
  - which lane/worldline the suffix belongs to
- `base_frontier`
  - the frontier the source claims this suffix extends
- `target_frontier`
  - the frontier after applying the suffix
- `transitions`
  - the ordered witnessed causal records being claimed
- `payload_refs`
  - stable references to any required content-addressed payload material
- `checkpoints`
  - optional imported checkpoint aids; not causal truth on their own
- `wormholes`
  - optional folded-history material where reopening or verification is needed
- `signatures`
  - optional signed envelopes over the claim
- `export_witness`
  - the witness explaining what the exporting runtime believes it is handing
    off

## Shared Import Result Algebra

The import result should be a first-class shared outcome family, not an engine
private boolean.

```text
ImportAdmissionResult =
    Admitted {
        frontier: Frontier,
        receipt: Receipt,
    }
  | Staged {
        lane_id: LaneId,
        reason: StageReason,
        receipt: Receipt,
    }
  | Braided {
        braid_id: BraidId,
        cells: Vec<BraidCell>,
        receipt: Receipt,
    }
  | Conflict {
        artifact: ConflictArtifact,
        receipt: Receipt,
    }
  | Obstructed {
        witness: ObstructionWitness,
        receipt: Receipt,
    }
```

The exact internal mechanics may vary, but the exported meaning should remain
shared.

## Basic Operations

The two shared operations should be:

```text
exportSuffix(from_frontier, to_frontier?) -> CausalSuffixBundle
importSuffix(bundle) -> ImportAdmissionResult
```

### `exportSuffix`

Meaning:

- export one claimed suffix from a known base frontier
- optionally narrow by target frontier or policy-supported scope
- include all transition and payload references needed for lawful import

### `importSuffix`

Meaning:

- verify the bundle against local history identity and known frontier geometry
- normalize the claim to local runtime truth
- apply normal admission policy
- return a published import outcome plus local receipt

## Loop Prevention And Honest Provenance

The import/export law must prevent fake novelty and echo loops.

Therefore imported transitions must retain durable provenance such as:

- source runtime identity
- source writer identity
- original transition identity
- import receipt lineage
- imported frontier lineage

One runtime must never treat its own previously imported suffix as fresh local
novelty just because it arrived through the peer later.

## First Implementation Slice

The first real proving path should be intentionally narrow:

1. One sibling runtime exports one lawful suffix bundle from a known lane
   frontier.
2. Another sibling runtime imports that bundle without mutating canonical
   history by folklore.
3. The importing runtime returns one honest import outcome and receipt.
4. Duplicate import is recognized as already-known rather than new history.
5. The reverse direction must use the same family and admission algebra rather
   than a separate role-specific path.

The first slice should prove:

- no state synchronization
- no last-write-wins
- no silent branch mutation
- no looped re-import

## Repo Cuts Triggered By This Packet

### Continuum

- author the shared causal suffix bundle family
- author the import outcome family if the existing receipt/settlement families
  are not already sufficient

### Wesley

- compile the shared family into Rust/TypeScript codecs and manifests
- publish transport-safe bundle codecs without re-owning engine semantics

### Echo

- export lawful suffix bundles from witnessed runtime truth
- import peer suffix bundles through normal witnessed admission

### `git-warp`

- export lawful suffix bundles from witnessed runtime truth
- import peer suffix bundles through normal witnessed admission

## Done Looks Like

- a debugger or tool can ask both Echo and `git-warp` for the same suffix
  bundle category
- a bundle exported by one runtime can be imported by the other through the
  same admission algebra
- the stack never needs to answer "where does the graph really live?" because
  no privileged graph-in-itself owns truth
- cross-runtime exchange is inspectable as witnessed admission rather than
  silent synchronization folklore

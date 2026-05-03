---
title: Echo Against Continuum Invariants
status: proposed
---

# Echo Against Continuum Invariants

**Cycle:** 0019-echo-against-continuum-invariants  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Apply the newly frozen Continuum invariants to Echo alone and answer one
practical question:

**Where is Echo already aligned, where is it only partially aligned, and what
still has to change before Echo can truthfully stand in for one side of the
shared Continuum runtime story?**

`git-warp` is intentionally out of scope for this packet while it is under
active surgery.

## Why This Exists

Continuum now has a canonical invariant surface in
[docs/invariants/CONTINUUM.md](../../invariants/CONTINUUM.md).

That document is only useful if it can be applied against real repo truth.

Echo is the right first target because:

- it already has active alignment work in `0006`, `0007`, and `0008`
- it now publishes real neighborhood and settlement surfaces
- it still carries known deferred cutovers around Wesley generation and shared
  runtime publication

This packet is the first bounded audit pass.

## Verdict Summary

### Green

- **3. Engine-Local Freedom Invariant**

### Yellow

- **1. One Graph Invariant**
- **2. Published-Noun Parity Invariant**
- **5. No Shadow Normalization Invariant**
- **6. Witness Ladder Integrity Invariant**
- **7. Settlement Before Handoff Invariant**
- **9. Shared Carrier Invariant**
- **10. One Observer Story Invariant**

### Red

- **4. Shared Contract Authority Invariant**
- **8. Temperature Handoff Invariant**

## Invariant Audit

### 1. One Graph Invariant — Yellow

**Claim:** a Continuum client should observe one shared causal history with
compatible readings, not one separate graph-shaped reality per engine.

**Echo truth today:**

- Echo is internally coherent around one shared causal-history model with
  graph-shaped publication surfaces.
- `NeighborhoodSite` gives Echo a first-class local site publication surface
  instead of requiring adapter reconstruction:
  - `echo/crates/warp-core/src/neighborhood.rs`
  - `echo/docs/design/0007-braid-geometry-and-neighborhood-publication/design.md`
- Settlement is now first-class instead of folklore:
  - `echo/crates/warp-core/src/settlement.rs`
  - `echo/docs/design/0008-strand-settlement/design.md`

**Why only yellow:**

- Echo still does not publish the full cross-runtime suffix exchange/import
  family now required for sibling runtime interoperability.
- That means Echo can support one coherent local causal-history/reading model,
  but it does not yet provide the peer exchange boundary that Continuum now
  requires for the full sibling-runtime story.

### 2. Published-Noun Parity Invariant — Yellow

**Claim:** shared Continuum-facing nouns should be published as the same
categories across engines.

**Echo truth today:**

- Echo now has native publication for:
  - `NeighborhoodSite`
  - `SettlementDelta`
  - `SettlementPlan`
  - `SettlementResult`
  - `ImportCandidate`
  - `ConflictArtifactDraft`
- Those appear in both kernel/runtime code and ABI DTOs:
  - `echo/crates/warp-core/src/neighborhood.rs`
  - `echo/crates/warp-core/src/settlement.rs`
  - `echo/crates/echo-wasm-abi/src/kernel_port.rs`

**Why only yellow:**

- Echo still lacks a first-class native reintegration detail boundary.
  The main repo-truth statement remains the one from `0006`:
  reintegration truth is still scattered across receipts, provenance, and
  finalization artifacts.
  - `echo/docs/design/0006-echo-continuum-alignment/design.md`
- Receipt shell layering is still more explicit in design doctrine than in
  native runtime publication.
- Effect-emission, delivery-observation, and observer-trace publication are not
  yet part of the same crisp published family stack in Echo.

### 3. Engine-Local Freedom Invariant — Green

**Claim:** Echo may remain Echo-shaped internally as long as it preserves the
shared published contract.

**Echo truth today:**

- Echo explicitly keeps runtime-specific truths local:
  scheduler state, ingress/admission policy, head/writer semantics, and
  engine-local finalization/control-plane detail.
  - `echo/docs/design/0006-echo-continuum-alignment/design.md`
- The current neighborhood and settlement work did not flatten Echo into
  Continuum terms internally; it added publication boundaries instead.

**Why green:**

- This invariant is about what Echo is allowed to remain.
- Echo is currently compatible with that law.

### 4. Shared Contract Authority Invariant — Red

**Claim:** truly shared families should be authored in Continuum and compiled by
Wesley, not hand-authored independently in Echo.

**Echo truth today:**

- Echo's runtime schema fragments are still locally authored and explicitly say
  generation is deferred.
  - `echo/schemas/runtime/README.md`
- Echo's proof-family runtime cutover is still backlog, not landed:
  - `echo/docs/method/backlog/up-next/PLATFORM_continuum-proof-family-runtime-cutover.md`
- The published neighborhood and settlement ABI surfaces are still handwritten
  Echo-side DTOs:
  - `echo/crates/echo-wasm-abi/src/kernel_port.rs`

**Why red:**

- Echo is still a local author of surfaces that the assignment explicitly says
  should be authored in Continuum and compiled through Wesley.
- This is the clearest current misalignment.

### 5. No Shadow Normalization Invariant — Yellow

**Claim:** adapters and tools should not be the primary place shared meaning is
 reconstructed by hand.

**Echo truth today:**

- Echo improved materially here by adding native kernel-backed publication for
  neighborhood and settlement.
- `0005` remains honest that the older TTD path derived reintegration and shell
  summaries in the host/debugger layer:
  - `echo/docs/design/0005-echo-ttd-witness-surface/design.md`

**Why only yellow:**

- The worst adapter folklore has been reduced, but not eliminated.
- Reintegration detail still lacks one native runtime-backed object.
- The browser/WASM bridge still exposes handwritten compatibility DTOs rather
  than a Wesley-generated shared family.

### 6. Witness Ladder Integrity Invariant — Yellow

**Claim:** reintegration-bearing core, witness core, and receipt shell must not
collapse back into one blob.

**Echo truth today:**

- Echo has started separating layers:
  - `NeighborhoodSite` for local site truth
  - settlement family for import/conflict runway
  - rich shell/provenance artifacts remain present
- The design docs understand the distinction:
  - `echo/docs/design/0005-echo-ttd-witness-surface/design.md`
  - `echo/docs/design/0006-echo-continuum-alignment/design.md`

**Why only yellow:**

- Echo still does not publish a first-class reintegration detail object.
- Receipt shell remains rich and real, but the native runtime line between
  reintegration core and shell is not yet fully hardened in the public
  contract.

### 7. Settlement Before Handoff Invariant — Yellow

**Claim:** if runtime transition changes canonical visibility or durable status,
the transition must be explainable through published settlement/reintegration
categories.

**Echo truth today:**

- Settlement is now explicit and runtime-backed:
  compare -> plan -> import -> conflict artifact.
- Accepted imports and conflicts are recorded as first-class provenance events:
  - `MergeImport`
  - `ConflictArtifact`
  - `echo/crates/warp-core/src/settlement.rs`

**Why only yellow:**

- Echo now has the settlement half of this invariant.
- It does **not** yet have the cross-runtime exchange half.
- So the stack can explain import/conflict truth, but it cannot yet explain a
  peer-runtime suffix exchange as one published admission event.

### 8. Cross-Runtime Exchange Invariant — Red

**Claim:** cross-runtime interoperability must be represented as witnessed
suffix exchange and admission between sibling runtimes.

**Echo truth today:**

- No full suffix exchange/import publication surface is present in the current
  design or kernel/ABI files.
- A targeted search across Echo design docs and the relevant runtime crates
  found no cross-runtime exchange boundary object:
  - `rg -n "source runtime|target runtime|cross-runtime|suffix|import|export" ...`

**Why red:**

- This invariant is simply not implemented or even named in Echo yet.

### 9. Shared Carrier Invariant — Yellow

**Claim:** if a shared binary carrier exists, both engines must agree on the
same authored family, manifests, bytes, and interpretation.

**Echo truth today:**

- Echo has strong deterministic binary discipline already:
  - canonical CBOR wire rules
  - deterministic ABI boundaries
  - explicit binary-compatibility doctrine
  - `echo/README.md`
  - `echo/docs/continuum-foundations.md`
  - `echo/docs/THEORY.md`
- Echo also has a real higher-layer carrier/packaging story around BTRs and
  wormhole carriers in theory, even if not all of it is fully landed runtime
  substrate yet.

**Why only yellow:**

- The shared carrier is not yet anchored to Wesley-generated authored families.
- Cross-engine proof is not in place.
- Echo still publishes handwritten DTOs where the assignment calls for
  generated shared family artifacts.

### 10. One Observer Story Invariant — Yellow

**Claim:** Continuum-facing tools should not require a different conceptual
language for Echo than for other engines.

**Echo truth today:**

- Echo is much closer than it was before:
  it now publishes neighborhood and settlement as first-class observer-facing
  categories instead of hiding them in local folklore.
- The browser host bridge has already been narrowed to a host-bridge role in
  doctrine.

**Why only yellow:**

- The shared observer story is still not cut over to Wesley-generated shared
  families.
- Reintegration detail and receipt-layer publication are still not fully
  normalized natively.
- Echo can tell a much better story now, but not yet the final shared story.

## What Echo Needs Next

The next required moves, in order, are:

1. **Land the proof-family cutover**
   - Replace handwritten proof-slice DTOs with Wesley-generated Rust artifacts
     or provably temporary isomorphic shims.

2. **Publish a first-class reintegration detail boundary**
   - Stop making consumers reconstruct seam truth from scattered receipt,
     provenance, and finalization state.

3. **Define and publish a suffix exchange/import family**
   - Make peer-runtime exchange explicit in witnessed causal history.
   - This is the biggest missing Continuum invariant leg in Echo now.

4. **Only after that, extend broader shared observer families**
   - effect emission
   - delivery observation
   - observer trace

## Bottom Line

Echo is no longer missing the entire Continuum shape.

It now has:

- first-class local-site publication
- first-class settlement publication
- explicit parity-oriented design doctrine

But it still does **not** satisfy the whole Continuum invariant surface.

The current hard blockers are:

- shared-contract authority is still local/handwritten in the proof slice
- cross-runtime suffix exchange/import is not yet a published causal category

So the honest summary is:

**Echo is now structurally on the runway, but it is not yet the finished
Continuum engine leg.**

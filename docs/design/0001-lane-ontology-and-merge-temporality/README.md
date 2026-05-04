---
title: Lane Ontology And Merge Temporality
status: proposed
---

# Lane Ontology And Merge Temporality

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Clarify the shared math around `Worldline`, `Strand`, `Braid`, and `merge`
without reviving a fake third-system ontology.

The immediate goal is to answer:

- are `Worldline` and `Strand` actually the same kind of thing?
- is `Braid` another lane, or a different kind of object?
- does `merge` happen in time, outside time, or across both?
- what makes something in this stack inherently temporal rather than spatial?

## Why This Matters

The active stack already leans on these nouns:

- `git-warp` uses `Worldline`, `Strand`, `Braid`, `Observer`, `Receipt`, and
  `Witness`
- `warp-ttd` wants one honest debugger grammar across sibling runtimes
- merge and collapse work already assume richer causal geometry than ordinary
  text/source control

If the ontology is blurry here, everything above it gets blurrier:

- strand collapse
- merge semantics
- replay and debugger mode
- observer traces
- shared contract families

## Working Claim

The strongest current claim is:

1. `Worldline` and `Strand` are the same geometric species.
2. Their difference is modal and governance-relative, not geometric.
3. `Braid` is not merely another lane. It is a compositional object over lanes.
4. `Merge` is not a primitive tick-local temporal rewrite on one lane. It is a
   higher-order search/composition problem over multiple temporal branches.
5. A successful merge may produce a new temporal lane segment. A failed merge
   may instead produce an enriched composite with explicit obstruction witness.

## Proposed Base Ontology

### 1. Lane

A `Lane` is the primitive temporal object.

It carries:

- a linear or linearisable causal order of ticks
- a replayable prefix relation
- a lawful notion of predecessor and successor
- enough provenance to identify how later states arise from earlier ones

In shorthand:

`Lane = temporal causal chain with replay coordinates`

This is the deeper type that both `Worldline` and `Strand` instantiate.

### 2. Worldline

A `Worldline` is a `Lane` with canonical admission status.

It is the lane whose steps are currently admitted as shared or canonical truth
under the relevant policy.

So:

`Worldline = Lane + canonical admission`

### 3. Strand

A `Strand` is a `Lane` with speculative admission status.

It is still replayable. It is still causal. It is still a line.

What differs from a canonical worldline is:

- authority and governance
- admission status
- fork provenance
- collapse/transfer requirements

So:

`Strand = Lane + speculative admission + fork origin`

This means a strand is not "less temporal" than a worldline. It is a
worldline-shaped object with different truth status.

### 4. Braid

A `Braid` is a composition over lanes.

It is not just one more lane by default. It is a structured object consisting
of:

- multiple lanes
- alignment data
- overlap/interference structure
- observer-relative read/comparison potential
- optionally, witness for lawful composition or lawful failure

So:

`Braid = structured composition of lanes`

This is why a braid feels close to a worldline or strand, but not identical.
It is built out of temporal objects without itself being reducible to one line
for free.

## Chronos And Kairos

This gives a cleaner use of the older temporal vocabulary.

### Chronos

`Chronos` is linear time along one lane.

If you are asking:

- what happened before what?
- what is the next tick?
- what is the prefix up to tick `T`?

then you are working in Chronos.

Worldlines and strands are both Chronos-bearing objects.

### Kairos

`Kairos` is the branching space of possible or concurrent causal development.

If you are asking:

- what branches coexist?
- what alternative futures are available?
- where do branches diverge or rejoin?
- what common future could preserve both branches?

then you are working in Kairos.

A braid is best understood as a local structured object inside Kairos.

## Temporal Versus Spatial / Compositional Structure

The right split is not literally "time versus space" in a physics sense. The
useful split is:

- temporal structure
- compositional or observer-relative structure

### Something Is Inherently Temporal When

An object is inherently temporal when its identity depends on an intrinsic
before/after or prefix/future relation.

Examples:

- lane tick order
- prefix forks
- replay coordinates
- common futures
- predecessor/successor relations

Without those relations, the object is no longer the same kind of thing.

### Something Is Inherently Spatial / Compositional When

An object is spatial/compositional when its identity depends on coexistence,
alignment, overlap, boundary, or projection rather than one privileged serial
order.

Examples:

- footprint overlap
- observer aperture
- adjacency in a materialized state
- coexistence of multiple branches in a braid
- a shared visible slice across lanes

This is why a footprint or an aperture is not itself temporal, even though it
is used on temporal objects.

## What Merge Is

The current best answer is:

> Merge is a search for a lawful common future of concurrent branches relative
> to a shared precursor.

That means merge is not just:

- a text splice
- a temporal tick on one lane
- a purely non-temporal set operation

It is a higher-order operation over temporal objects.

## Does Merge Happen In Kairos?

Yes, in the strongest sense available today:

- the *problem* of merge lives in Kairos, because it concerns multiple branches
  and their possible common futures
- the *result* of a successful canonical merge may re-enter Chronos as a new
  lane segment
- the *result* of an unsuccessful canonical merge may remain a braid or other
  enriched composite with obstruction witness

So the clean statement is:

`Merge is Kairotic in domain and Chronotic in successful result.`

That is a much better sentence than either:

- "merge is just temporal"
- "merge is outside time"

It uses temporal structure essentially, but it is not confined to one linear
timeline.

## Merge, Braid, And Derived Lanes

This gives a good way to relate merge back to braid:

1. Start with two or more lanes sharing a precursor.
2. Treat their coexistence and alignment as a braid-like object.
3. Search for a lawful common future.
4. If found, derive a new lane segment or admitted lane continuation.
5. If not found, preserve the braid plus an obstruction witness instead of
   pretending it already is one line.

So a braid may induce a synthetic or derived worldline, but only under:

- a composition law
- an observer/policy frame
- and, where necessary, witness

That last clause matters. The system should not silently collapse plurality
into unity.

## Consequences For The Active Stack

### For `git-warp`

- it likely wants `Lane` as a deeper theoretical noun even if the public API
  keeps `Worldline` and `Strand`
- `Braid` should stay plural/objective instead of being taught as "just another
  lane"
- merge and collapse work should keep producing witness-bearing enriched
  objects when canonical rejoining fails

### For `warp-ttd`

- the debugger should probably think in terms of `Lane` as the generic base
  kind
- `Worldline` and `Strand` become modal refinements
- `Braid` becomes the right home for comparison, obstruction, and merge-inspect
  surfaces

### For Continuum

- the shared noun ownership map should likely include `Lane` as a coordination
  noun even if some repos do not publish it yet
- the glossary should prevent quiet smearing of lane-versus-braid semantics

## Open Theorem Questions

These are the questions worth carrying forward into later math cycles.

1. What is the minimal structure required for a braid to induce a derived lane?
2. Is canonical merge best modeled as a join, a pushout, a least common future,
   or different things in different subcategories?
3. What is the minimal witness needed when a braid can be lawfully lowered to a
   single line?
4. What obstruction object is most honest when no such lowering exists?
5. Which observer-relative constructions preserve temporal truth, and which only
   preserve compositional/spatial truth?

## Non-Goals

- This note does not rename the public APIs.
- This note does not prove a full category-theoretic treatment.
- This note does not claim every braid can or should become a single line.
- This note does not claim merge is "timeless"; it claims merge is a
  higher-order operation over temporal branches.

## Playback Questions

1. Does this note cleanly separate the base lane kind from the modal distinction
   between canonical and speculative truth?
2. Does the Kairos/Chronos split make merge easier to reason about rather than
   more mystical?
3. Does the note preserve the right to keep plurality explicit instead of
   flattening every braid into a fake worldline?

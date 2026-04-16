---
title: Settlement Publication and Shared Reintegration Contract
status: proposed
---

# Settlement Publication and Shared Reintegration Contract

**Cycle:** 0017-settlement-publication-and-shared-reintegration  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze the next interoperability law after `0016`:

- settlement is a shared observer/debugger contract family
- it is not merely local engine folklore
- it is not identical to merge, neighborhood, or receipt shell

This packet answers the practical question:

**Now that Echo has a real settlement runway, which settlement nouns should
Continuum tools be able to ask from both Echo and `git-warp`?**

## Why This Exists

`0016` froze the engine-local vs shared observer contract split.

Since then, Echo landed its first real settlement runway:

- compare strand suffix against base
- produce a deterministic plan
- append accepted `MergeImport`
- append unresolved `ConflictArtifact`

That changes the stack materially.

Settlement can no longer remain an unnamed lower-level detail. If Continuum
tools must work against both Echo and `git-warp`, then the settlement/reintegration
surface needs a shared contract law just like lane identity, neighborhood core,
and reintegration detail.

## Decision

Settlement should be treated as a **shared engine-published observer family**
that sits between:

- neighborhood core
- reintegration detail
- receipt shell

It is not the same as any of them.

The clean split is:

- **Neighborhood core**
  - what local site / participating lanes are in play
- **Settlement family**
  - what part of one source lane can lawfully become target history
- **Reintegration detail**
  - what seam obligations, compatibility evidence, and local verdicts explain
    that settlement outcome
- **Receipt shell**
  - host-specific explanatory shell, provenance shell, scheduler shell,
    transfer-plan shell

Settlement therefore becomes one first-class shared category, not just a
detail hidden inside shell.

## Law

### 1. Settlement is a shared category, not an Echo-specific novelty

If Echo and `git-warp` are both first-class Continuum engines, then both must
eventually publish the same top-level settlement category even if the engines
compute it differently.

The tool should not have to learn:

- Echo says "settlement"
- `git-warp` says "transfer plan"
- adapters normalize both by hand

Instead:

- the shared contract owns the common category
- host-local language may remain in shell and docs

### 2. Settlement is not merge in general

Settlement is narrower than universal merge.

Current truthful shape:

- source lane suffix
- target lane coordinate
- deterministic import law
- explicit unresolved residue

This is already enough to be a shared contract family. We do **not** need a
fully general "merge every braid into one line" law before we publish it.

### 3. Settlement is not the same as reintegration detail

The separation from the Continuum math still stands:

- settlement says **which source history can lawfully cross**
- reintegration detail says **what seam obligations and evidence explain that**

One is about the transfer / import runway.
The other is about seam truth and verdict structure.

They are adjacent, but not identical.

### 4. Receipt shell must not redefine settlement truth

Engine-local explanation is allowed:

- Echo finalization detail
- Echo scheduler shell
- `git-warp` Git audit shell
- richer host-side transfer-plan annotations

But shell cannot become the only place settlement truth exists. Otherwise the
shared contract collapses back into adapter folklore.

## Minimum Shared Settlement Families

These are the first settlement nouns both engines should converge on.

### A. Settlement request family

Minimum shared meaning:

- source lane or strand identity
- target lane identity when not implied
- optional scope/coordinate narrowing if the engine supports it

For the current Echo shape, "settle this strand against its base" is already a
valid narrow request form.

### B. Settlement delta family

Minimum shared meaning:

- source settlement window
- source refs / source suffix being evaluated
- base or target anchor coordinate

This is the compare surface. It identifies what the planner is actually looking
at.

### C. Settlement plan family

Minimum shared meaning:

- source/target identities
- deterministic ordered decision set

This is the inspectable plan surface.

### D. Settlement decision family

Minimum shared meaning:

- accepted import candidate
- unresolved conflict artifact draft

A host may elaborate these further, but those two categories are the stable
core.

### E. Import candidate family

Minimum shared meaning:

- source provenance coordinate
- stable imported op or action identity
- optional source head / writer attribution

### F. Conflict artifact family

Minimum shared meaning:

- source provenance coordinate
- stable artifact identity
- explicit conflict reason family

Current narrow reason set is already acceptable:

- `BaseDivergence`
- `UnsupportedImport`
- `ChannelPolicyConflict`
- `QuantumMismatch`

Not every host must produce every reason now, but the category should be
shared.

### G. Settlement result family

Minimum shared meaning:

- the plan that was executed
- recorded accepted imports
- recorded unresolved artifacts

This is the mutation-side publication surface.

## Relation To Existing Continuum Families

### Neighborhood core

Neighborhood tells the tool:

- which lanes are locally in play
- whether the site is singleton or plural

Settlement tells the tool:

- which source history can become target history

### Reintegration detail

Reintegration detail tells the tool:

- seam anchors
- obligations
- evidence
- outcome

Settlement is the transfer runway that produces or is explained by that seam
truth.

### Receipt shell

Receipt shell remains:

- explanatory
- host-specific
- optional drill-down

It can refine settlement, but not replace it.

## Repo Consequences

### Continuum

Continuum should now treat settlement as one of the shared observer/debugger
families, not a local extension point.

Current authored family home:

- [schemas/continuum-settlement-family.graphql](../../../schemas/continuum-settlement-family.graphql)

### Echo

Echo should publish:

- settlement delta
- settlement plan
- settlement result

through its host boundary, not just as kernel-internal types.

### `git-warp`

`git-warp` should align compare / transfer-plan / import residue publication to
the same top-level settlement families instead of relying on host-local naming
alone.

### Wesley

Wesley should compile and witness the shared family cut for:

- settlement request
- settlement delta
- settlement plan
- settlement decision
- import candidate
- conflict artifact
- settlement result

### `warp-ttd`

`warp-ttd` should consume settlement as a first-class shared surface:

- inspect compare windows
- inspect deterministic plans
- inspect imports vs unresolved residue

without reverse-engineering that from raw provenance events.

## Done Looks Like

- Echo and `git-warp` keep engine-local settlement mechanics
- Continuum tools can ask the same settlement questions of both
- `warp-ttd` consumes explicit settlement nouns rather than mining them from shell
- Wesley has a clear future family boundary for settlement publication

That is the next honest interoperability step after `0016`.

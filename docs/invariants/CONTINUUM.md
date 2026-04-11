# Continuum Invariants

This document freezes the current cross-repo invariants for the Continuum
stack.

These invariants describe **shared coordination truth**, not local runtime
behavior already owned by Echo, `git-warp`, `warp-ttd`, or Wesley.

If a statement only concerns one engine's private implementation strategy, it
does not belong here.

## Scope

Continuum-level invariants constrain:

- the shared meaning of published nouns
- who owns authored shared contract families
- how engines may differ without breaking interoperability
- what must be true for a host-neutral client or debugger surface to remain
  honest

They do **not** require:

- identical engine internals
- one universal runtime
- one universal storage substrate

## Invariants

### 1. One Graph Invariant

A Continuum client observes **one logical graph**.

Echo and `git-warp` are not allowed to become separate user-visible universes
with different meanings for identity, receipt, settlement, or lane truth.

### 2. Published-Noun Parity Invariant

If a noun is shared at the Continuum boundary, Echo and `git-warp` must publish
the **same category** for it.

Examples include:

- lane/worldline/strand identity
- neighborhood core
- reintegration detail
- settlement
- receipt core and receipt shell boundary
- effect and delivery publication families

Host-specific elaboration is allowed below that boundary.
The top-level contract category must remain shared.

### 3. Engine-Local Freedom Invariant

Echo and `git-warp` may differ internally in:

- storage model
- scheduling
- merge/import machinery
- provenance representation

Those differences are acceptable as long as the shared published contract is
preserved.

### 4. Shared Contract Authority Invariant

When a contract family is truly shared across engines or tools:

- Continuum owns the authored semantic family
- Wesley owns compilation, manifests, codecs, and witness lanes
- engines and tools consume the generated artifacts

Shared meaning must not be re-authored independently in Echo, `git-warp`, or
`warp-ttd`.

### 5. No Shadow Normalization Invariant

Adapters, debuggers, and clients may present or transport shared truth.
They must not be the primary place where incompatible host stories are
reconciled by hand.

`warp-ttd` is not allowed to become the permanent normalization swamp.

### 6. Witness Ladder Integrity Invariant

Cross-repo publication must preserve the distinction between:

- reintegration-bearing core
- witness core
- receipt shell

These layers may be related.
They may not collapse back into one undifferentiated blob.

### 7. Settlement Before Handoff Invariant

Whenever a runtime transition changes canonical visibility, durable status, or
imported history, that transition must be explainable through published
settlement and reintegration categories.

Shell metadata alone is not enough.

### 8. Temperature Handoff Invariant

Crossing between hot and cold runtimes must be represented as a **first-class
causal event**.

There is no honest silent handoff between execution temperatures.

At minimum, the handoff must be able to name:

- source runtime kind
- target runtime kind
- source coordinate or head
- target coordinate or head
- boundary digest or equivalent shared identity
- settlement/import outcome
- unresolved residue when present

### 9. Shared Carrier Invariant

If a shared binary carrier or transport envelope exists, both engines must
agree on:

- the same authored contract family
- the same manifest and ids
- the same bytes
- the same interpretation of those bytes

Binary compatibility means more than "both parsers accept it."

### 10. One Observer Story Invariant

Continuum-facing tools should not require the operator to switch conceptual
languages when moving between Echo and `git-warp`.

Host-specific shell detail is allowed.
The top-level observer story must remain shared.

## Short Form

If you need the whole doctrine compressed:

- one logical graph
- same published nouns
- different engine internals allowed
- Continuum authors shared semantics
- Wesley compiles and witnesses them
- no silent normalization
- no silent temperature handoff
- same contracts, same bytes, same interpretation

## Source Packets

These invariants are distilled primarily from:

- [0014-shared-noun-ownership-map](../design/0014-shared-noun-ownership-map/README.md)
- [0016-engine-local-vs-shared-observer-contract](../design/0016-engine-local-vs-shared-observer-contract/README.md)
- [0017-settlement-publication-and-shared-reintegration](../design/0017-settlement-publication-and-shared-reintegration/README.md)
- [0018-one-graph-two-temperatures-and-runtime-handoff](../design/0018-one-graph-two-temperatures-and-runtime-handoff/README.md)

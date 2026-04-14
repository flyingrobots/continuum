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

### 11. Observation / Fork Separation Invariant

Observation, replay, and inspection do not by themselves create new causal
truth.

If a Continuum tool asks to continue from an earlier coordinate or explore a
counterfactual, that act must be represented as an explicit fork or strand
rooted at an exact basis.

Debugger-created counterfactual lanes should default to scratch or
author-only retention tiers rather than crossing silently into shared admitted
history.

If such a lane is retained, the published history must be able to name at
least:

- creator principal
- tool or session origin
- fork basis
- retention posture
- revelation posture

Only explicit promotion may move such work into shared admitted history.

### 12. Shared Admission Outcome Invariant

When Echo, `git-warp`, or a later Continuum engine publishes an admission
result whose meaning must interoperate, it must preserve the lawful outcome
family:

- `Derived`
- `Plural`
- `Conflict`
- `Obstruction`

`Plural` may not be silently scalarised into an apparent winner, nor collapsed
into an unstructured list with no basis or participant meaning.

### 13. Observer Collapse / Canonical Collapse Invariant

Observer-side filtering, summarisation, or narrowed projection may aid human
understanding, but it must not be presented as canonical admission unless the
underlying engine actually admitted that collapse and can name the
corresponding witness and shell.

Continuum tools may choose a reading.
They may not silently claim that the reading is the runtime's admitted truth.

### 14. Policy Identity Publication Invariant

When policy changes the published causal meaning of an admission result, policy
identity must be explicit.

At the shared Continuum boundary, policy remains:

- engine-defined
- deterministic
- host-selectable or host-configurable by reference

It must not become host-authored execution code masquerading as shared causal
law.

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
- observation is revelation only; debugger-created counterfactuals are explicit
  tiered forks
- lawful admission outcomes stay explicit
- observer collapse is not canonical collapse
- shared policy meaning requires explicit policy identity

## Source Packets

These invariants are distilled primarily from:

- [0014-shared-noun-ownership-map](../design/0014-shared-noun-ownership-map/README.md)
- [0016-engine-local-vs-shared-observer-contract](../design/0016-engine-local-vs-shared-observer-contract/README.md)
- [0017-settlement-publication-and-shared-reintegration](../design/0017-settlement-publication-and-shared-reintegration/README.md)
- [0018-one-graph-two-temperatures-and-runtime-handoff](../design/0018-one-graph-two-temperatures-and-runtime-handoff/README.md)
- [0020-shared-admission-and-policy-publication](../design/0020-shared-admission-and-policy-publication/README.md)
- [0021-family-versions-vs-repo-versions](../design/0021-family-versions-vs-repo-versions/README.md)

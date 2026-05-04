---
title: One Graph, Two Temperatures, and Runtime Handoff
status: proposed
---

# One Graph, Two Temperatures, and Runtime Handoff

**Cycle:** 0018-one-graph-two-temperatures-and-runtime-handoff  
**Legend:** SOURCE  
**Type:** coordination cycle

## Correction Note

This packet keeps its historical title so older links remain stable.

The corrected doctrine is:

- "one graph" means one shared witnessed causal history with compatible
  observer-relative readings, not a privileged materialized graph-in-itself
- "two temperatures" is historical shorthand for runtime posture differences,
  not protocol ontology
- Echo and `git-warp` are sibling Continuum runtime implementations
- cross-runtime interoperability is witnessed suffix exchange and admission
  between peers, not hot/cold handoff between two halves of one machine

## Hill

Freeze the next Continuum doctrine before app-runtime work drifts into adapter
folklore:

- a Continuum client participates in **one shared witnessed causal history**
- lawful observers can emit **compatible graph-like or state-like readings**
  from that history
- Echo and `git-warp` are sibling runtime implementations over that history
- runtime posture describes deployment characteristics, not protocol roles
- cross-runtime exchange must be explicit witnessed admission
- a shared carrier is useful only if both runtimes also agree on the same
  published nouns and interpretation

This packet answers the practical question:

**If multiple sibling Continuum runtimes can publish and consume one witnessed
causal history, what must be true so that interop is honest instead of adapter
folklore?**

## Why This Exists

The stack is converging toward:

- Echo as one Continuum runtime implementation
- `git-warp` as one Continuum runtime implementation
- `warp-ttd` as the shared observer/debugger surface
- Wesley as compiler/witness machinery
- Continuum as semantic, protocol, contract, admissibility, and witness
  authority

That is already useful.

But the app-facing vision is stronger than "a family of repos that can work
together." The emerging claim is:

**a client should be able to participate in one shared causal history while
lawful observers emit readings over work published by different sibling
runtimes.**

That claim is attractive and dangerous.

It is attractive because many real systems need different runtime postures:

- low-latency interaction
- durable audit and settlement
- local branching
- long-horizon reproducible history
- browser-hosted or offline-first operation

It is dangerous because the abstraction collapses if:

- the sibling runtimes publish different top-level nouns
- one runtime is treated as subordinate to the other
- a materialized graph, snapshot, cache, or retained reading is mistaken for
  boundary truth
- binary compatibility means only "both parse bytes" instead of "both tell the
  same story"

This packet freezes the law that keeps the idea honest.

## Decision

### 1. Continuum promises witnessed causal history

From the client or debugger perspective there is one shared witnessed causal
history.

Echo and `git-warp` are not allowed to become separate user-visible universes
with independent meanings for identity, receipt, settlement, lane truth,
admission, or observation.

They may be different runtime implementations.
They may use different storage, indexing, checkpoint, cache, observer, and
materialization strategies.
They are not different causal universes at the published Continuum boundary.

The phrase "one graph" is only acceptable as historical shorthand for:

- one shared causal history
- plus compatible observer-relative readings over that history

It must not be read as:

- one privileged materialized graph-in-itself
- one substrate-owned state object
- one cache that every runtime must mirror
- one runtime acting as the durable half of another

### 2. Echo and `git-warp` are sibling runtimes

Echo is not subordinate to `git-warp`.
`git-warp` is not the durable half of Echo.

Both runtimes may store:

- causal history
- indexes
- caches
- retained readings
- checkpoints
- implementation-local materializations
- transport or replay aids

Those stores are runtime freedom. At the Continuum boundary, the shared truth
is witnessed causal history plus the contract families and admission laws that
make it interoperable.

A Continuum runtime is any implementation that can publish, admit, observe,
export, and import witnessed causal history according to Continuum contract
families and admission laws.

### 3. Runtime posture is metadata, not ontology

Terms such as:

- hot
- cold
- durable
- archival
- low-latency
- browser-hosted
- offline-first
- checkpoint-heavy
- observer-hosting

describe runtime or deployment posture.

They do not assign protocol roles.
They do not decide which runtime owns truth.
They do not permit published nouns to diverge.

### 4. Cross-runtime exchange is witnessed admission

When one sibling runtime exports work to another, the exchange must be a
witnessed causal-history claim admitted by the receiving runtime.

The stack must not hide interop behind silent adapter translation or
state-snapshot synchronization.

The exchange should be inspectable as a boundary object with at least:

- source runtime identity
- target runtime identity
- source coordinate or frontier
- target coordinate or frontier
- boundary digest or shared causal-history identity
- settlement or import outcome
- witness or receipt reference
- unresolved conflict or residue when present

This makes interop part of causal history truth instead of an undocumented
transport trick.

One useful older formulation remains valid: a runtime may be live in host time
while admitted history time is replayed, inspected, forked, or imported.
That distinction matters. Host-time arrival does not itself admit history.

### 5. Shared carrier is necessary but not sufficient

If multiple runtimes can read and write the same carrier, that is useful.

But "same bytes" only helps if it also means:

- same nouns
- same contracts
- same interpretation
- same admission and witness meaning

Otherwise the system only proves parser compatibility, not Continuum
interoperability.

The stronger requirement is same nouns, same contracts, same bytes, and same
causal interpretation.

### 6. Debugger-created counterfactuals are explicit tiered forks

Observation alone does not create new causal truth.

If a debugger or agent asks to continue from an earlier coordinate or explore
an explicit counterfactual, Continuum should represent that as a first-class
fork rooted at an exact basis.

Such work should default to scratch or author-only retained lanes rather than
crossing silently into shared admitted history. Shared admitted history
requires an explicit later promotion.

Buffered host-time facts are not automatically admitted history.
Catch-up, merge, import, or resync must remain explicit.

### 7. Continuum must not become a runtime facade

Continuum should not become a third independent engine.

A client or bootstrap layer may route work or load generated contracts, but it
must not own:

- a shadow engine ontology
- silent semantic translation
- private settlement logic that the sibling runtimes themselves do not publish
- privileged graph truth

Continuum owns the shared protocol, contract, admissibility, and witness
language. Runtime implementations own their local execution and storage
machinery.

## Continuum Invariants

### 1. Shared Causal History Invariant

A Continuum client participates in one shared witnessed causal history.

Sibling runtimes are implementations over that history, not separate
substrate-owned graph objects that happen to share a debugger.

### 2. Published-Noun Parity Invariant

Echo and `git-warp` must publish the same Continuum-facing nouns for shared
concepts.

Internal runtime elaborations may differ.
Published contract categories may not.

### 3. Engine-Local Freedom Invariant

The runtimes are free to differ internally so long as they preserve the shared
published contract.

Continuum does not require identical storage models, schedulers, indexes,
caches, checkpoints, materializations, or merge machinery.

### 4. Cross-Runtime Exchange Invariant

Cross-runtime interop must be recorded as witnessed suffix exchange and
admission.

There is no honest silent synchronization path.

### 5. Shared Carrier Invariant

If a shared carrier is used, all sibling runtimes must agree on:

- bytes
- schema/contract family
- envelope ids and manifests
- causal interpretation of the carrier contents

### 6. No Silent Translation Invariant

Adapters and tools may transport, present, or filter.
They may not secretly redefine the meaning of import, settlement, receipt, or
lane identity.

### 7. Settlement Before Cross-Runtime Admission Invariant

Whenever cross-runtime exchange changes canonical visibility or retained
status, the admission must be explainable through published settlement and
reintegration families, not only through shell metadata.

### 8. One Observer Story Invariant

`warp-ttd` and future Continuum-facing tools must be able to inspect sibling
runtimes without switching conceptual languages.

Host-specific depth is allowed in shell or drill-down.
The top-level story must remain shared.

### 9. Observer-Relative Reading Invariant

Continuum does not promise one privileged materialized graph-in-itself.

It promises one shared causal history from which lawful observers or optics may
emit compatible readings.

Different observers may lawfully emit different graph-like structure without
contradicting the shared causal substrate.

### 10. Observation / Fork Separation Invariant

Observation, replay, and inspection are revelation acts only.

Debugger-created counterfactuals must appear as explicit forked lanes rooted
at exact bases, with scratch or author-only retention by default and shared
publication only by later promotion.

## Consequences For The Stack

### Echo

Echo must publish and consume shared Continuum families without becoming a
client of `git-warp` for protocol truth.

Useful publication families include:

- neighborhood core
- reintegration detail
- settlement outputs
- suffix export/import shells
- observer reading envelopes

### `git-warp`

`git-warp` must publish and consume the same Continuum families without
becoming the durable half of Echo.

Its Git-native storage and archival strengths are runtime posture and
implementation freedom, not privileged graph ownership.

### `warp-ttd`

`warp-ttd` must not become the permanent normalization swamp.

Its job is to consume the shared published nouns, not rescue incompatible host
stories by hand forever.

### Wesley

Wesley should compile and witness the shared families that make this possible:

- lane identity
- neighborhood core
- reintegration detail
- settlement
- suffix exchange/import families
- observer plan and reading families
- folded-history and replay-continuity families once those are promoted

## Interesting Use Cases

The sibling-runtime story is only worth keeping if it solves real problems.

It does when a system needs multiple runtime postures over one causal-history
language:

- collaborative editors with live interaction and durable shared history
- agent systems with scratch execution and auditable outcomes
- simulation or game tooling with live local stepping and reproducible replay
- workflow/orchestration systems with quick local progress and durable
  settlement records
- offline-first applications with local progress and later convergence
- catch-up and seek through folded history without pretending the interior
  vanished

The pitch is not "look, two engines."

The pitch is:

**the stack can support different runtime postures without forcing the client
to learn two different causal universes or to pretend one materialized graph
object owns truth.**

## Proof Obligations

This packet does not claim the whole stack already satisfies these invariants.

The immediate proof obligations are:

1. Echo and `git-warp` publish the same top-level observer/settlement nouns.
2. Wesley compiles the same authored families into both runtime legs.
3. Both runtimes round-trip the same carrier bytes for at least one shared
   proof family.
4. Cross-runtime suffix exchange is published and inspectable instead of being
   hidden inside adapter code.
5. Observer-facing tooling can describe emitted graph-like structure as
   readings over shared causal history rather than as a privileged
   graph-in-itself.

Until those are true, "one graph, two temperatures" remains only historical
shorthand for a corrected target: one witnessed causal history, multiple
sibling runtimes, one shared admissibility and witness language.

---
title: One Graph, Two Temperatures, and Runtime Handoff
status: proposed
---

# One Graph, Two Temperatures, and Runtime Handoff

**Cycle:** 0018-one-graph-two-temperatures-and-runtime-handoff  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze the next Continuum doctrine before app-runtime work drifts into
adapter folklore:

- a Continuum client participates in **one shared witnessed causal history**
- lawful optics can emit **compatible holographic graph-like readings** from
  that history
- Echo and `git-warp` are two **execution temperatures** over that history
- crossing between those temperatures is a **first-class causal event**
- a shared binary carrier is useful only if both engines also agree on the
  same published nouns and interpretation

This packet answers the practical question:

**If Continuum eventually exposes a host-neutral app/runtime facade, what must
be true so that hot/cold routing is honest instead of magical?**

## Why This Exists

The stack is converging toward:

- Echo as the hot engine
- `git-warp` as the cold engine
- `warp-ttd` as the shared observer/debugger
- Wesley as compiler/witness machinery
- Continuum as semantic and contract authority

That is already useful.

But the app-facing vision is stronger than "a family of repos that can work
together." The emerging claim is:

**a client should be able to participate in one shared causal history while
lawful optics emit graph-like readings over work that may execute or settle
through different runtime temperatures.**

That claim is attractive and dangerous.

It is attractive because many real systems need both:

- hot speculative interaction
- durable audit and settlement
- low-latency local branching
- long-horizon reproducible history

It is dangerous because the abstraction collapses if:

- the two engines publish different top-level nouns
- the handoff between them is hidden
- binary compatibility means only "both parse bytes" instead of "both tell the
  same story"

This packet freezes the law that keeps the idea honest.

## Decision

### 1. Continuum promises one shared causal history, not one substrate-owned graph per engine

From the client or debugger perspective there is one shared witnessed causal
history.

Echo and `git-warp` are not allowed to become separate user-visible universes
with independent meanings for identity, receipt, settlement, or lane truth.

They may be different substrates.
They may be different execution regimes.
They are not different causal universes at the published Continuum boundary.

The phrase "one graph" is only acceptable as shorthand for:

- one shared causal history
- plus compatible observer-relative holographic readings over that history

It must not be read as:

- one privileged materialized graph-in-itself
- one substrate-owned state object
- one cache that every runtime must mirror

### 2. Hot and cold are execution/publication temperatures, not separate ontologies

The useful distinction is:

- **hot**
  - immediacy
  - low-latency interaction
  - speculative or provisional progress
- **cold**
  - durable history
  - settlement and archival truth
  - transport and audit

This is a policy/runtime distinction.
It is not permission for the published nouns to diverge.

### 3. Runtime transition must be a first-class causal event

If work crosses from hot to cold, or cold to hot, that crossing must itself be
represented in causal history.

The stack must not hide the transition behind silent adapter translation.

The handoff event should be inspectable as a real boundary object with at
least:

- source runtime kind
- target runtime kind
- source coordinate or head
- target coordinate or head
- boundary digest or shared causal-history identity
- settlement or import outcome
- any unresolved conflict or residue

This makes the handoff part of causal history truth instead of an undocumented
transport trick.

One useful older formulation is that the handoff boundary mediates between:

- `HostTime`
  - wall-clock, scheduler jitter, arrival timing, tool heartbeat
- admitted history time
  - replayable causal order inside the worldline or transported suffix

That distinction matters because a runtime may remain live in host time while a
debugger or forked lane rewinds admitted history. The handoff event therefore
needs to say not only what crossed, but also which causal order was actually
admitted.

### 4. Shared binary carrier is necessary but not sufficient

If both engines can read and write the same binary WARP carrier, that is a
major win.

But "same bytes" only helps if it also means:

- same nouns
- same contracts
- same interpretation

Otherwise the system only proves parser compatibility, not Continuum
interoperability.

The stronger requirement is:

**same nouns, same contracts, same bytes, same causal interpretation**

### Debugger-created counterfactuals are explicit tiered forks

Observation alone does not create new causal truth.

If a debugger or agent asks to continue from an earlier coordinate or explore
an explicit counterfactual, Continuum should represent that as a first-class
fork rooted at an exact basis.

Such work should default to hot scratch or author-only retained lanes rather
than crossing silently into cold shared history. Shared admitted history
requires an explicit later promotion.

The older time-travel notes sharpen the runtime consequence:

- future arrivals may continue to exist in host-time buffers
- rewound history does not automatically admit those arrivals
- catch-up, merge, or resync must remain explicit

This is the runtime-temperature version of the same law: buffered facts are not
yet admitted history.

### 5. A host-neutral Continuum runtime facade is allowed, but it must stay thin

Continuum should not become a third independent engine.

A thin client/runtime facade may still exist if it only owns:

- generated contract loading
- host adapters
- host-selection policy
- normalization to already-shared published nouns

It must not own:

- a shadow engine ontology
- silent semantic translation
- private settlement logic that the engines themselves do not publish

## Continuum Invariants

### 1. Shared Causal History Invariant

A Continuum client participates in one shared witnessed causal history.

Hot and cold runtimes are two execution regimes over that history, not two
separate substrate-owned graph objects that happen to share a debugger.

### 2. Published-Noun Parity Invariant

Echo and `git-warp` must publish the same Continuum-facing nouns for shared
concepts.

Internal engine elaborations may differ.
Published contract categories may not.

### 3. Engine-Local Freedom Invariant

The engines are free to differ internally so long as they preserve the shared
published contract.

Continuum does not require identical storage models, schedulers, or merge
machinery.

### 4. Temperature Handoff Invariant

Crossing between hot and cold runtimes must be recorded as a first-class
causal event.

There is no honest silent handoff.

### 5. Shared Carrier Invariant

If a shared binary carrier is used, both engines must agree on:

- bytes
- schema/contract family
- envelope ids and manifests
- causal interpretation of the carrier contents

### 6. No Silent Translation Invariant

Adapters and tools may transport, present, or filter.
They may not secretly redefine the meaning of handoff, settlement, receipt, or
lane identity.

### 7. Settlement Before Handoff Invariant

Whenever a runtime handoff changes canonical visibility or durable status, the
handoff must be explainable through published settlement and reintegration
families, not only through shell metadata.

### 8. One Observer Story Invariant

`warp-ttd` and future Continuum-facing tools must be able to inspect either
engine without switching conceptual languages.

Host-specific depth is allowed in shell or drill-down.
The top-level story must remain shared.

### 9. Observer-Relative Reading Invariant

Continuum does not promise one privileged materialized graph-in-itself.

It promises one shared causal history from which lawful observers or optics may
emit compatible holographic readings.

Different observers may lawfully emit different graph-like structure without
contradicting the shared causal substrate.

### 10. Observation / Fork Separation Invariant

Observation, replay, and inspection are revelation acts only.

Debugger-created counterfactuals must appear as explicit forked lanes rooted
at exact bases, with scratch or author-only retention by default and shared
publication only by later promotion.

## Consequences For The Stack

### Echo

Echo must continue moving toward native publication of:

- neighborhood core
- reintegration detail
- settlement outputs
- runtime handoff boundaries when hot work becomes cold-visible

### `git-warp`

`git-warp` must converge on the same published categories even if its internal
representation remains Git-native and colder in temperament.

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
- handoff/event carrier families once they exist
- folded-history and replay-continuity families once those are promoted

## Interesting Use Cases

The two-temperature story is only worth keeping if it solves real problems.

It does when a system needs both immediacy and durable truth:

- collaborative editors with live local interaction and durable shared history
- agent systems with hot scratch execution and cold auditable outcomes
- simulation or game tooling with live local stepping and reproducible replay
- workflow/orchestration systems with quick local progress and durable
  settlement records
- offline-first applications with local hot progress and later cold
  convergence
- catch-up and seek through folded history without pretending the interior
  vanished

The pitch is not "look, two engines."

The pitch is:

**the stack can support becoming fast and being true without forcing the client
 to learn two different causal universes or to pretend one materialized graph
 object owns truth.**

## Proof Obligations

This packet does not claim the whole stack already satisfies these invariants.

The immediate proof obligations are:

1. Echo and `git-warp` publish the same top-level observer/settlement nouns.
2. Wesley compiles the same authored families into both legs.
3. Both engines round-trip the same carrier bytes for at least one shared proof
   family.
4. A runtime handoff event is published and inspectable instead of being hidden
   inside adapter code.
5. Observer-facing tooling can describe emitted graph-like structure as
   holographic readings over shared causal history rather than as a privileged
   graph-in-itself.

Until those are true, "one graph, two temperatures" remains a historical
shorthand for a target, not a
completed fact.

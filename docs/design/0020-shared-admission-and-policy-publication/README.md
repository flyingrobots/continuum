---
title: Shared Admission and Policy Publication
status: proposed
---

# Shared Admission and Policy Publication

**Cycle:** 0020-shared-admission-and-policy-publication  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze the next shared Continuum law before Echo and `git-warp` drift into
engine-specific admission folklore:

- the shared boundary publishes admission, not merely state application
- lawful outcomes remain explicit as `Derived`, `Plural`, `Conflict`, or
  `Obstruction`
- observer-side collapse is not canonical collapse
- shells remain distinct from witness cores
- policy remains engine-defined, deterministic, and host-selectable by
  reference rather than host-authored execution code

This packet answers one practical question:

**What must Echo and `git-warp` publish so that admission means the same thing
on both sides of the Continuum boundary?**

## Why This Exists

Paper VII now names the architectural centre clearly:

- WARP is a recursive, witnessed admission architecture
- commitment, folding, and revelation must remain distinct
- lawful plurality is a first-class result
- debugger observation must not be confused with authorship or promotion

The repos are converging on that story, but they still risk drifting apart in
two predictable ways:

- one engine may publish admission as if it were merely a reducer result
- a host surface may be allowed to smuggle in bespoke policy or canonicalise an
  observer-side collapse

That would destroy interoperability while preserving superficial byte-level
compatibility.

Continuum therefore needs one explicit doctrine packet for admission semantics
and policy publication.

## Decision

### 1. The shared boundary publishes admission, not mere application

At the Continuum boundary, an engine is not publishing only:

- input state
- local operations
- output state

It is publishing that a family of claims was judged against a bounded site
under explicit law and yielded a lawful result with witness-bearing support.

An implementation may still compute that result through reducers, schedulers,
or graph rewrites. The shared publication story is still admission.

### 2. The lawful outcome family is shared

When an engine publishes an admission result whose meaning must interoperate, it
must preserve the following outcome family:

- `Derived`
- `Plural`
- `Conflict`
- `Obstruction`

`Plural` is especially important. It may not be silently collapsed into a
single winner, nor scalarised into an unstructured list with no basis or
participant identity.

Each engine remains free to use richer internal structures, but the shared
boundary must preserve at least:

- the admitted outcome kind
- the relevant basis or comparison frame
- enough participant or claim identity to explain plurality, conflict, or
  obstruction honestly

### 3. Observer collapse is not canonical collapse

Continuum tools may:

- filter
- summarise
- choose one reading among several
- present a narrowed observer-relative projection

None of those acts counts as canonical collapse unless the underlying engine has
actually admitted such a collapse and can name the corresponding witness and
shell.

This preserves the difference between:

- a debugger choosing a convenient projection
- the runtime admitting a lawful result into shared causal truth

### 4. Shells and witness cores remain separate

The shared boundary must preserve the distinction between:

- the lawful result
- the witness of why that result was lawful
- the shell or hologram used to carry, replay, transport, or reveal that result

Different admission domains may legitimately emit different shell families.
A local tick receipt, a settlement publication, and a transport shell do not
need to collapse into one universal receipt noun.

Continuum therefore freezes the layering, not one concrete shell class.

### 5. Policy is engine-defined law, selected by hosts by reference

Hosts must not be allowed to inject bespoke execution code and then claim that
the result is a shared Continuum admission outcome.

The allowed model is:

- the engine defines deterministic policy families
- hosts select, parameterise, or reference those policies
- policy identity is explicit when it changes published causal meaning

This keeps admission lawful and inspectable while still allowing deployment
configuration and product-level choice.

### 6. Bounded sites are shared semantically, not structurally

Both engines must be able to tell the same high-level story about the site over
which claims were judged.

Continuum freezes the semantic requirement:

- admission happens over a bounded site or focal closure

Continuum does not freeze the internal implementation shape of that site:

- Echo may derive it through footprint, affected region, and reintegration
  structure
- `git-warp` may derive it through footprint, focus-boundary, or related read
  geometry

The engines must agree on what the site means, not on one internal struct
layout.

## What This Freezes

- admission as a published causal judgement
- the lawful outcome family
- observer-collapse versus canonical-collapse separation
- shell versus witness layering
- deterministic engine-owned policy identity at the shared boundary

## What This Leaves Local

- reducer or scheduler implementation details
- exact bounded-site structs
- cache/materialisation strategies
- engine-local enum/class shapes
- adapter ergonomics that do not alter published causal meaning

## Playback Questions

### Human

- [ ] If a client reads an admission result from Echo or `git-warp`, can they
      tell whether it is `Derived`, `Plural`, `Conflict`, or `Obstruction`
      without adapter folklore?
- [ ] Can they distinguish a debugger-side projection from a canonical admitted
      collapse?

### Agent

- [ ] Can I identify the policy that governed a published outcome when policy
      changes causal meaning?
- [ ] Can I explain the difference between witness and shell without naming one
      engine-specific receipt type as universal?

## Non-goals

- defining one universal receipt implementation
- freezing one engine-wide bounded-site struct
- specifying hot-engine reducer mechanics
- specifying cold-engine storage mechanics


# Good Ideas From Old Continuum

This repo should not survive as a third active runtime. The good parts are the
coordination ideas, the contract discipline, and a few deterministic
implementation lessons. Everything else can live in git history.

This document is the salvage list.

## Keep The Coordination Layer, Not The Third System

The strongest surviving idea is that Continuum should be a coordination spine,
not another substrate. That means:

- shared doctrine across Echo, `git-warp`, `warp-ttd`, and Wesley
- shared contract families and publication boundaries
- cross-repo invariants
- witness and conformance suites
- integration scenarios and compatibility truth

What should not come back:

- a separate "JITOS" runtime competing with Echo
- a separate cold storage substrate competing with `git-warp`
- duplicate ontology or parallel branding that teaches a second universe

## Best Documents To Mine

### `docs/DOCS-GOVERNANCE.md`

Keep the source-of-truth hierarchy idea almost verbatim.

What is worth preserving:

- different document streams need explicit precedence
- theory and explicit invariants outrank specs
- specs outrank milestone gates
- milestone gates outrank directional overviews
- forward-looking design claims need a promotion path:
  directional overview -> ADR -> SPEC -> milestone gate
- docs should declare status explicitly:
  `Draft`, `Proposed`, `Approval-Ready`, `Accepted`, `Deprecated`

How to adapt it:

- replace old repo names with the active stack
- center the hierarchy on METHOD, invariants, authored contract families, and
  witness/conformance truth

### `docs/ARCH/ARCH-0002-architectural-invariants.md`

This is the strongest constitutional document in the old repo.

Ideas worth preserving:

- history-first truth
- state is a view
- no silent mutation
- replay equality is a feature requirement
- no ambient nondeterminism
- policy is explicit
- risky work happens in overlays/speculative lanes
- collapse is explicit and transactional
- abort is still information
- intent, plan, and execution are separate
- capabilities are explicit
- "viewer isn't a toy" / explainability is mandatory
- stable contracts at boundaries
- "no generic set field API"
- "no job queue as fake causality"

How to adapt it:

- translate `SWS` language into `worldline`, `strand`, `braid`, `observer`,
  `receipt`, and `witness`
- split invariant sets across active repos where ownership is clear
- keep one Continuum-level invariant index that links out to repo-local law

### `docs/SPECS/SPEC-NET-0001-graphql-sdl-v0.md`

This is an early, slightly blunt version of a real idea:

- GraphQL as read model and command surface
- WARP rewrites/events as write truth
- domain mutations only; no generic setter sludge
- subscriptions as live tooling/viewer feed
- deterministic encodings, IDs, errors, and payload surfaces are normative

The good part is not the exact SDL. The good part is the publication stance:

- typed surface for apps and tools
- write truth stays causal
- contracts should be specific enough to generate code and failing tests

How to adapt it:

- Wesley owns authored contract families
- generated TS/Rust surfaces fall out of the authored family
- `warp-ttd` protocol is one family, not the universal god-schema
- keep read/control contracts separate from substrate rewrite truth

### `docs/ROADMAP/M7-Typed-Domain-API-v1/README.md`

This is proto-Wesley.

Ideas worth preserving:

- stop hiding behind JSON escape hatches
- freeze kind registries and version them
- generated validators should be reference behavior
- schema-driven generation prevents drift between contracts and runtime
- migration paths should be explicit, not folklore

How to adapt it:

- keep "Wesley mode" as a contract-compiler idea, not as old JITOS roadmap
- prefer authored contract families + realizations + witness squares

### `docs/ARCH/ARCH-0000-INTEGRATED-SPEC.md`

Most of the runtime-branding narrative should stay in history, but a few
directional statements survive:

- history is the system
- state is a policy-relative view
- speculation is the default working mode
- workers propose; kernel/runtime validates and records
- GraphQL or equivalent authored contracts can serve as a universal control
  plane if they do not become a second source of truth
- schema-first generation is the right anti-drift move

What to discard from this file:

- old "causal OS" framing as active product truth
- the exact RMG/JITOS runtime hierarchy
- anything that fights the current Echo + `git-warp` + `warp-ttd` + Wesley split

## Best Code Ideas To Mine

### `crates/jitos-core/src/canonical.rs`

Strongest idea:

- canonical encoding should optimize for structural determinism, not compactness

Carry forward:

- one logical value -> one byte sequence
- canonical hash helpers should be the only lawful hashing path
- reject non-canonical forms at the boundary
- cross-language determinism is a first-class requirement, not an afterthought

### `crates/jitos-core/src/events.rs`

Strongest ideas:

- policy belongs in structure, not metadata
- content-addressed events should validate invariants on deserialize
- canonical payload wrapper types are better than trusting raw bytes

Carry forward:

- validate invariants when constructing and when deserializing
- make IDs boring and content-addressed
- prefer explicit event classes over loose blobs

### `crates/jitos-core/src/delta.rs`

Strongest idea:

- counterfactuals should be explicit, hashed, and inspectable

Carry forward:

- a counterfactual/delta spec is a first-class runtime object
- it should be content-addressed
- it should validate itself on deserialize

This maps cleanly to current work on strands, causal slicing, and witnessed
merge/obstruction handling.

### `crates/jitos-graph/src/ids.rs`

Strongest idea:

- deterministic ID allocation should be order-independent for independent ops

Carry forward:

- antichain swaps should not change identity
- IDs should come from normalized operation content, not accidental insertion
  order
- replay should reproduce identity exactly

### `crates/jitos-views/src/clock.rs`

Strongest idea:

- time is a materialized view over observations, not a syscall

Carry forward:

- wall clock does not belong in substrate truth
- time beliefs should carry provenance
- policy chooses how observations become "now"

## Ideas To Explicitly Leave Behind

These may be useful as history, but they should not be revived as current repo
truth:

- the old JITOS naming and product framing
- a third substrate/runtime separate from Echo and `git-warp`
- giant integrated architecture docs pretending to be contracts
- roadmap language that re-centers old kernel/process/OS metaphors over the
  current worldline/strand/observer stack

## What A Fresh Continuum Repo Should Probably Own

If this repo is reborn, it should own coordination truth such as:

- a concise `README.md` saying Continuum is the shared coordination membrane
- `METHOD.md` and METHOD-shaped backlog/design/retro structure
- a small `docs/BEARING.md` that states the current hill
- a small `docs/VISION.md` that explains the relationship between Echo,
  `git-warp`, `warp-ttd`, and Wesley
- a glossary of shared nouns and ownership
- a compatibility matrix
- integration scenarios / golden traces
- cross-repo invariants and witness plans

## First Integration Targets

These are the ideas most worth integrating into active repos after the reset:

1. A Continuum-level docs governance / truth hierarchy note.
2. A Continuum-level invariant index pointing at repo-local law.
3. A compatibility and publication-boundary map for shared contract families.
4. Cross-repo witness scenarios that exercise Echo, `git-warp`, `warp-ttd`, and
   Wesley together.
5. A small glossary that freezes shared nouns and bans shadow synonyms.

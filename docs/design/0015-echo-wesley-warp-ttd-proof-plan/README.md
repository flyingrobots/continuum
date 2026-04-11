---
title: Echo / Wesley / warp-ttd Proof Plan
status: proposed
---

# Echo / Wesley / warp-ttd Proof Plan

**Cycle:** 0015-echo-wesley-warp-ttd-proof-plan  
**Legend:** EVIDENCE  
**Type:** coordination cycle  
**Sponsor human:** James  
**Sponsor agent:** Codex

## Hill

Prove one narrow end-to-end Continuum slice where:

1. one GraphQL family is authored once and compiled by Wesley
2. Echo uses the generated Rust side of that family to define real graph/runtime
   truth for the slice
3. invalid rewrite code that exceeds the declared footprint fails at compile
   time
4. `warp-ttd` connects to Echo and inspects the same slice through the
   generated TypeScript side of the family
5. the wire path uses Wesley-owned codecs so TypeScript and Rust are speaking
   one authored contract instead of mirrored folklore

The intended lane is:

1. declare the shared GraphQL family in Continuum
2. compile that family with Wesley into Rust, TypeScript, and codec artifacts
3. run Echo against the generated Rust side
4. have `warp-ttd` talk to Echo through the generated TypeScript side of the
   same family

This cycle does **not** claim the stack already does this. It defines the
smallest honest proof plan that would make the claim true.

## Playback Questions

1. What is actually true today in Wesley, Echo, and `warp-ttd`?
2. What is the smallest end-to-end slice that proves the contract path instead
   of hand-waving it?
3. What repo cuts are required for compile-time footprint enforcement rather
   than runtime-only checking?
4. What concrete witness would count as "Echo and `warp-ttd` speak to each
   other through Wesley-compiled contracts"?

## Impacted Repos

- Continuum
- Wesley
- Echo
- `warp-ttd`

## Current Truth

### Wesley

Wesley already owns:

- authored GraphQL directive vocabulary including `@wes_footprint`,
  `@wes_codec`, and `@wes_op`
- `compile-ttd` for generated TypeScript and Rust consumer artifacts
- `bundle-echo` for Echo-oriented artifact generation
- schema hashing and witness lanes

But Wesley does **not** yet prove the specific claim we want here:

- it validates footprint declarations structurally
- it does **not** yet prove that Echo rewrite implementations violating those
  declarations fail at compile time
- `bundle-echo` still carries mocked inspect-surface language rather than a
  fully landed Echo runtime integration path

### Echo

Echo already owns:

- real runtime footprint enforcement
- guarded reads and validated writes
- poisoning of invalid deltas
- local runtime schema fragments and runtime-schema primitives

But Echo does **not** yet run off a Wesley-owned generated graph/runtime family
for this path:

- runtime schema fragments in `schemas/runtime/` explicitly say generation is
  deferred
- `echo-runtime-schema` is the current Echo-local owner for runtime primitives
- the current safety proof is runtime, not compile-time

### `warp-ttd`

`warp-ttd` already owns:

- the authored debugger/session protocol surface
- the `TtdHostAdapter` host boundary
- generated contract consumption via Wesley `compile-ttd`

But the Echo connection is still planned work:

- the Echo host adapter remains a backlog slice
- Browser TTD is now correctly owned by `warp-ttd`, but the real adapter path
  into Echo is not landed

## Decision

Do **not** try to migrate all of Echo into Wesley ownership at once.

Instead, prove one **minimum graph/runtime contract slice** end-to-end. That
slice must be just large enough to exercise:

- at least one node type
- at least one edge type
- at least one rewrite operation
- at least one declared footprint
- at least one codec-backed payload crossing TypeScript to Rust
- at least one inspection path from Echo into `warp-ttd`
- at least one negative compile-fail proof for footprint violation

For this proof slice:

- the canonical authored contract home should be Continuum
- Wesley should compile that authored family into concrete artifacts
- Echo should consume generated Rust-facing artifacts for the slice
- `warp-ttd` should consume generated TypeScript-facing artifacts for the same
  slice
- Continuum should own the witness criteria and proof narrative

## Smallest Honest Artifact

One narrow "Echo proof slice" family, authored in Wesley, with:

- one node kind
- one edge kind
- one rewrite op with explicit footprint
- one codec-backed intent or operator payload
- one valid Echo implementation
- one invalid Echo implementation that fails to compile
- one `warp-ttd` inspection path over the resulting runtime state

The exact domain nouns can stay narrow and boring. The important thing is that
the slice exercises graph shape, rewrite behavior, footprint law, codec law,
and debugger visibility.

## Proof Plan

### Phase 0: Freeze the proof slice

Choose one tiny runtime family that is sufficient to demonstrate:

- graph nodes
- graph edges
- graph rewrite operators
- footprint declaration
- codec-backed transport
- debugger inspection

The first slice should be judged on proof value, not product ambition. It does
not need to represent the whole Echo runtime.

### Phase 1: Continuum authors the family and Wesley compiles it

Author a new Continuum-owned shared family for the proof slice containing:

- node and edge surface types
- operator input/output types
- rewrite operation declarations
- explicit `@wes_footprint` declarations
- codec declarations needed for TypeScript-to-Rust transport

Required outputs:

- generated TypeScript consumer artifacts
- generated Rust consumer artifacts
- schema hash / manifest / codec metadata

This phase is not done if `bundle-echo` only emits inspect-flavored summaries.
The proof requires a real Rust-facing artifact boundary that Echo can compile
against.

### Phase 2: Echo defines the slice from generated Rust artifacts

Echo integrates the generated Rust side of the proof family into a narrow
runtime path:

- node and edge identity/types for the slice come from generated or
  Wesley-owned artifacts
- the rewrite operator implementation is expressed against the generated slice
- Echo runtime guards remain on as the second line of safety

Important boundary:

- this phase does **not** require migrating all existing runtime fragments out
  of Echo
- it only requires one proof slice to stop being Echo-local folklore

### Phase 3: Compile-time footprint proof

This is the critical gap.

Runtime enforcement alone is not enough for the hill. To make the compile-time
claim honest, Wesley must generate a footprint-shaped capability surface for
Echo rewrite implementations.

The likely shape is:

- generated operator traits, contexts, or capability wrappers that expose only
  the declared read/write/create/delete surface
- compile-fail fixtures showing that undeclared graph access or mutation cannot
  type-check

The negative proof should be explicit:

- one invalid rewrite touches a node/edge outside its declared footprint
- compilation fails before execution

Runtime guards still stay in Echo. They become defense in depth, not the only
truth boundary.

### Phase 4: Codec and transport proof

Use Wesley-defined codecs to prove the TypeScript-to-Rust transport path for
the slice:

- generated TypeScript code serializes an operator payload or intent payload
- Echo decodes the same bytes into the generated or Wesley-owned Rust type
- a roundtrip witness proves stable decode/encode semantics under one schema
  hash

For the first proof, prefer the browser/WASM bridge path because that is the
same path needed for future Browser TTD:

- TypeScript side in `warp-ttd`
- Echo browser host bridge / WASM ABI on the Rust side

Native-only shortcuts may be useful later, but they should not replace the
proof of the cross-language codec lane.

### Phase 5: `warp-ttd` connects to Echo through the same family

Implement a narrow Echo host adapter path where `warp-ttd`:

- detects an Echo host
- connects through the Echo browser host bridge or equivalent narrow adapter
- reads the proof slice using the generated TypeScript side of the same family
- inspects the resulting graph/runtime state and receipts without ad hoc shape
  trust

The first output can be CLI `--json` rather than TUI/browser polish. Agent and
CLI truth count before UI polish.

### Phase 6: Witness and demo

The proof is done when one scripted scenario demonstrates all of these at once:

1. one GraphQL family is authored once in Continuum
2. Wesley emits Rust and TypeScript artifacts plus one schema hash from that
   Continuum-authored family
3. Echo compiles a valid rewrite against the generated footprint-shaped API
4. Echo rejects an invalid rewrite at compile time via a compile-fail fixture
5. TypeScript encodes a payload with Wesley-generated codecs and Echo decodes
   it into Rust
6. Echo executes the valid slice and records runtime truth
7. `warp-ttd` connects to Echo and inspects that truth using the generated
   TypeScript cousin types from the same authored family

If one of those steps still relies on hand-maintained mirrors, the proof is not
done.

## Repo Cuts Triggered By This Plan

### Continuum

- own the proof criteria and demo witness
- pair this plan with the future compatibility matrix entry for the proof slice

### Wesley

- author the proof-slice family
- emit real Rust-facing Echo artifacts, not just inspect summaries
- generate footprint-shaped capability surfaces for Echo rewrite code
- add compile-fail negative tests for footprint violations
- publish schema hash and codec metadata for the slice

### Echo

- pick one narrow runtime slice and wire it to Wesley-generated Rust artifacts
- implement the proof rewrite against the generated capability surface
- keep runtime footprint guards active as the second-line enforcement path
- expose the slice through the browser host bridge needed by `warp-ttd`

### `warp-ttd`

- consume the generated TypeScript side of the proof family
- implement the narrow Echo host adapter over the browser host bridge
- inspect the proof slice via CLI/session surfaces before worrying about UI
  polish

## Non-Goals

- migrating all of Echo runtime schema ownership into Wesley in one shot
- replacing every Echo-local runtime type immediately
- proving static safety for every rewrite in Echo at once
- finishing Browser TTD UI polish
- solving the same proof for `git-warp` in the first slice

## Open Questions

### 1. Wesley command surface

Should this land as a more honest `bundle-echo` path, or does Wesley need a
new command/artifact boundary for Echo runtime families?

### 2. Capability API shape

What is the most practical compile-time enforcement surface for Echo?

Likely options:

- generated traits with restricted context methods
- generated capability-token wrappers
- generated operator scaffolds plus compile-fail fixtures

The proof does not require choosing the most beautiful answer. It requires one
answer that is real and testable.

### 3. Proof transport path

Should the first adapter proof be:

- browser/WASM first
- or a temporary native harness plus later browser follow-through

The browser/WASM path is more aligned with the product direction. The native
path may be simpler. If a native shortcut is used, it should not replace the
cross-language codec proof.

## Done Looks Like

- Continuum can point to one real witness instead of a cross-repo promise
- Wesley owns one compiled family that genuinely travels into Echo and
  `warp-ttd`
- Echo uses generated Rust artifacts for the proof slice rather than
  maintaining a parallel mirror
- invalid rewrite code fails at compile time for the proof slice
- `warp-ttd` inspects Echo through the same authored family, using the
  generated TypeScript side

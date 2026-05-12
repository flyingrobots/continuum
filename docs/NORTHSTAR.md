# NORTHSTAR

Recorded: 2026-05-12

## Decision

Think should move toward Echo as its first active runtime path, with Continuum
as the shared causal-history boundary.

This does not mean that Echo becomes Think, that Continuum owns Think's schema,
or that `git-warp` is discarded. It means the next executable proof should stop
fighting the current `git-warp`-backed Think substrate and instead prove Think
as an application contract family over Echo.

The shortest form is:

```text
Think owns the memory product.
Echo owns the deterministic runtime path.
Continuum owns the shared causal boundary.
Wesley owns generated helpers, codecs, registries, and witness lanes.
git-warp remains a sibling runtime, not the first hot-path dependency.
```

## Why

Think has been absorbing too much substrate pain:

- large local mind repositories
- `git-warp` checkpoint and schema repair work
- capture latency pressure
- multi-mind behavior built around repo selection instead of first-class
  causal identity
- hidden coupling between product semantics and a particular runtime storage
  implementation

Continuum already defines the stricter model:

- there is one witnessed causal history with compatible readings
- Echo and `git-warp` are sibling Continuum runtime implementations
- shared runtime nouns belong in Continuum-authored contract families
- application nouns belong in application-authored contract families
- cross-runtime exchange is witnessed suffix admission, not silent state sync

That makes the clean move:

```text
do not repair Think by making git-warp the only substrate forever
do not repair Think by pushing Think nouns into Echo
do not repair Think by inventing another schema authority in Continuum

prove Think as an Echo-hosted Continuum application
```

## Ownership Split

### Think Owns

Think owns product and domain semantics:

- raw capture
- thought identity
- entries
- minds
- sessions
- remember
- browse
- inspect
- attribution
- human and agent workflows
- CLI, MCP, macOS, and future UI surfaces

Think should author its app-local GraphQL family in the Think repo. Names such
as `CaptureThought`, `InspectThought`, `ThoughtEntry`, `Mind`, `Remember`, and
`BrowseWindow` are Think nouns.

They do not belong in Echo core or in Continuum shared schemas.

### Echo Owns

Echo owns the deterministic runtime substrate:

- canonical intent dispatch
- deterministic admission and scheduling
- receipts and tick results
- frontiers and coordinates
- observer-relative readings
- retained artifacts
- generic runtime entrypoints such as `dispatch_intent(...)` and `observe(...)`

Echo should not learn what a thought, mind, or remember result means. It should
receive canonical intent bytes and produce witnessed runtime evidence and
reading artifacts.

### Continuum Owns

Continuum owns shared coordination truth:

- shared runtime boundary families
- compatibility vocabulary
- admission and witness language
- cross-repo noun ownership
- WARPspace and stack coordination
- invariants that keep Echo and `git-warp` interoperable

For this direction, the key Continuum family is the runtime boundary family:

- `IntentEnvelope`
- `TickResult`
- `ObserverPlan`
- `ObservationRequest`
- `ReadingEnvelope`
- `WitnessedSuffixShell`
- `CausalSuffixBundle`
- `ImportOutcome`

Continuum should not author a `ThinkThought` or `ThinkMind` schema. Think is an
app. App-local semantics stay with the app.

### Wesley Owns

Wesley owns the generated surface:

- operation ids
- canonical codecs
- generated Rust and TypeScript helpers
- registries
- manifests
- conformance and drift witnesses

Think should not hand-roll runtime bytes for the proof. The proof should go
through Wesley-generated helpers wherever the current toolchain permits it.

### git-warp Owns

`git-warp` remains a sibling runtime implementation.

It is not the durable half of Echo, and Echo is not subordinate to it. Its
future role in this path is cross-runtime exchange through Continuum families:

- export witnessed suffixes
- import causal suffix bundles
- publish import outcomes
- preserve receipt, settlement, and reading posture

The first Think-on-Echo proof does not need to solve `git-warp` migration.
Migration becomes a later witnessed exchange problem, not an implicit storage
swap.

## Target Shape

The desired application path is:

```text
Think CLI / MCP / macOS / future UI
  -> Think-authored GraphQL contract family
  -> Wesley-generated Think helpers
  -> canonical operation variables
  -> EINT / IntentEnvelope-shaped runtime carrier
  -> Echo dispatch_intent(...)
  -> Echo admission, scheduling, receipts, TickResult evidence
  -> Echo observe(...)
  -> ObservationArtifact / ReadingEnvelope + payload bytes
  -> generated Think decoding
  -> Think presentation
```

The user should experience this as Think becoming faster, clearer, and less
fragile. They should not have to think about Echo, Continuum, Wesley, or
`git-warp` during capture.

## First Executable Proof

The first proof slice is deliberately small.

### Claim

Think can persist one raw capture through Echo and read it back exactly through
a generated observation path.

### Operations

The first app-local Think family should be no larger than:

```text
mutation CaptureThought(input: CaptureThoughtInput): CaptureThoughtResult
query InspectThought(entryId: ID!): ThoughtEntry
```

Equivalent names are fine. The important part is that the first slice proves
one write and one exact read.

### Witness

The smallest useful witness is a test or example that:

1. Builds a `CaptureThought` intent using generated helpers.
2. Dispatches the canonical intent through Echo.
3. Receives ingress evidence and a runtime admission result.
4. Observes the captured entry by exact id or coordinate.
5. Verifies the `ReadingEnvelope` posture is complete.
6. Decodes the payload into a Think-owned `ThoughtEntry`.
7. Asserts the raw text and capture metadata survived the round trip.

### Out Of Scope For Slice One

Do not include these in the first proof:

- relevance search
- `remember`
- browse TUI
- multi-mind UX
- migration of existing `~/.think/*` repositories
- `git-warp` import/export
- cross-runtime conflict handling
- full receipt ladder
- production security or BLADE certification
- remote sync

Those are real, but they would blur the proof.

## WARPspace Direction

The coordination artifact should be a Think/Echo WARPspace constellation, not a
new substrate project.

The shape should mirror the existing `jedit-echo-dev` constellation:

```text
docs/warpspaces/think-echo-dev.toml
  pins Continuum
  pins Wesley
  pins Echo
  pins Think
  optionally pins warp-ttd
  only pins git-warp when the proof actually exercises sibling exchange
```

The app repo should check in:

- `contracts/think/...`
- generated outputs that are intended to be repo-visible
- `warpspace.toml` / `warpspace.lock.json` when the bootstrap path is ready

The app repo should not grow a private copy of Continuum runtime-boundary
semantics.

## Migration Posture

Existing Think minds are durable user data. They must not be abandoned.

But migration is not the first proof.

The correct migration story is:

1. Prove new Think captures can run through Echo.
2. Prove exact readback through Echo observations.
3. Define a Think export/import or replay path for old minds.
4. When `git-warp` participates, exchange causal suffixes through Continuum
   runtime-boundary families.
5. Preserve provenance and reading posture instead of pretending a materialized
   graph snapshot is the source of truth.

Existing `git-warp` repair work may still be needed as data rescue. It should
not be allowed to define the north star architecture.

## Non-Goals

This north star explicitly rejects:

- making Continuum a runtime
- making Continuum the owner of Think domain nouns
- making Echo an application framework
- making Echo expose Think-specific APIs
- hand-normalizing incompatible host stories in adapters
- treating materialized graph state as canonical substrate truth
- treating `git-warp` as Echo's mandatory durable half
- starting with a migration project before the new write/read proof exists

## Success Conditions

This direction is real when the stack can show inspectable evidence that:

- a Think-authored contract compiles through Wesley
- a Think capture dispatches through Echo without hand-rolled intent bytes
- Echo emits admission evidence for that capture
- a Think inspect observation returns a `ReadingEnvelope`
- the reading payload decodes into a Think-owned result type
- the first proof does not depend on `git-warp` in the hot capture path
- Continuum registry and WARPspace artifacts name what was proved and what
  remains open

The proof should make one sentence true:

```text
Think can capture and inspect a thought as a Continuum application on Echo.
```

After that, the next hills are obvious:

- recent chronology
- remember observers
- browse observers
- first-class mind identity
- migration from old Think minds
- witnessed sibling exchange with `git-warp`

## Rule To Remember

Think is not switching from one graph database to another.

Think is moving from product semantics entangled with one runtime substrate to
product semantics expressed as an application contract over witnessed causal
history.

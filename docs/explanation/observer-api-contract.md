---
title: Observer API contract (proposed)
status: proposed
---

# Observer API contract (proposed)

> **Status: proposed - design target, not an implemented contract.** This page
> describes the intended application-facing observer API that Continuum runtimes
> should converge on. It is not present in `schemas/`, Echo, `git-warp`, Edict,
> or Wesley today. Treat it as a target contract for runtime and compiler
> planning, not as current capability evidence.

This page explains the API boundary that should let applications define their
own domain readings and intents while runtimes keep their substrate mechanics
private.

The intended readers are:

- sibling runtime maintainers implementing Echo, `git-warp`, SQL/KV, or another
  Continuum target;
- app authors defining domain-specific optics and intents;
- compiler maintainers preparing the eventual Edict/Wesley path;
- review agents checking whether a runtime leaks substrate nouns into
  application code.

## The contract in one sentence

An application observes from a causal position. It does not query a database.

The contract shape is:

```text
Observer + Coordinate + Reading -> ObservationOutcome
Observer + Coordinate + Intent  -> AdmissionOutcome
```

The public API should read:

```ts
runtime.observer(observer).at(coordinate).read(reading);
runtime.observer(observer).at(coordinate).observe(reading);
runtime.observer(observer).at(coordinate).write(occurredOrAuthoredIntent);
```

`read` is the convenience path. `observe` is the honest path. `write` admits an
authored occurrence, not a raw mutation.

## What this page does not do

This page does not make XYPH concepts native to Continuum. XYPH is used only as
a concrete application example.

This page also does not specify `git-warp` internals, Echo storage, Edict Core
IR, or Wesley code generation. Continuum owns the shared boundary. Runtime
targets own their local implementations.

Application code should not depend on:

- graph traversal;
- Git object layout;
- CAS materialization;
- commit walks;
- branch or worldline handles;
- retained transactional storage;
- patch replay details;
- generated compiler internals.

Those are target responsibilities.

## Application-defined optic families

Applications define optic families. Runtimes evaluate applied declarations.

For XYPH, the public app vocabulary might be:

```ts
QuestReading.detail({ questId });
QuestReading.timeline({ questId });
QuestReading.comments({ questId }).page({ limit: 20 });

QuestIntent.recordComment({ questId, body }).occur(clientActId);
```

Those names are XYPH vocabulary, not Continuum vocabulary and not `git-warp`
vocabulary.

The generic flow is:

```text
OpticFamily
  -> ReadingDefinition
  -> AppliedReading

IntentFamily
  -> IntentDefinition
  -> AppliedIntent
  -> OccurredIntent
  -> AuthoredIntent
```

`QuestReading.detail` is a reading definition.

`QuestReading.detail({ questId })` is an applied reading.

`QuestIntent.recordComment({ questId, body })` is an applied intent.

`QuestIntent.recordComment({ questId, body }).occur(clientActId)` is an
occurred intent.

The session authors that occurrence before admission, or the app authors it
explicitly when signatures and authority need to be controlled.

## Runtime surface

The target-neutral runtime surface should be:

```ts
interface ContinuumRuntime {
  observer(observer: ObserverInput): ObserverHandle;

  canLower?(
    declaration: AppliedReading<unknown> | AppliedIntent<unknown>,
  ): Promise<StaticCapabilityOutcome>;
}

interface ObserverHandle {
  at(coordinate: CoordinateInput): ObserverSession;
}

interface ObserverSession {
  pin(): Promise<PinnedObserverSession>;

  author<Result>(
    intent: AppliedIntent<Result>,
    options: AuthorIntentOptions,
  ): Promise<AuthoredIntent<Result>>;

  read<Value>(reading: AppliedReading<Value>): Promise<Value>;

  observe<Value>(
    reading: AppliedReading<Value>,
  ): Promise<ObservationOutcome<Value>>;

  observeMany(
    readings: readonly AppliedReading<unknown>[],
  ): Promise<ObservationOutcome<unknown>[]>;

  canObserve?<Value>(
    reading: AppliedReading<Value>,
  ): Promise<CapabilityOutcome>;

  canAdmit?<Result>(
    intent: OccurredIntent<Result> | AuthoredIntent<Result>,
  ): Promise<CapabilityOutcome>;

  write<Result>(
    intent: OccurredIntent<Result> | AuthoredIntent<Result>,
  ): Promise<AdmissionOutcome<Result>>;
}

interface PinnedObserverSession extends ObserverSession {
  readonly coordinate: CoordinateReceipt;
}
```

`canLower` is static target capability. It means the target has a lowering path
for the declaration shape. It does not imply observer authorization, budget
sufficiency, support availability, or future admission success.

`canObserve` and `canAdmit` are session-aware advisory checks. They may consider
observer identity, coordinate, authority, budget, posture, and target state.
They are still not guarantees unless the same coordinate receipt and target
state are preserved.

## Coordinates and pinning

Coordinate input and coordinate receipt are different.

```ts
type CoordinateInput =
  | CoordinateAlias
  | BasisRef
  | CoordinateReceipt;

type CoordinateAlias =
  | {
      basis: "latest-visible";
      posture?: RevelationPosture;
      accumulation?: AccumulationPolicy;
    }
  | {
      basis: "latest-admitted";
      posture?: RevelationPosture;
      accumulation?: AccumulationPolicy;
    };

type CoordinateReceipt = {
  basis: BasisRef;
  coordinatePosture: RevelationPosture;
  accumulation: AccumulationPolicy;
  target: TargetReceipt;
  coordinateDigest: string;
  resolution: RuntimeReceipt;
};
```

`latest-visible` is a request. It is not a deterministic coordinate.

Determinism laws apply to `CoordinateReceipt`.

An `ObserverSession` created from a coordinate alias may resolve per operation.
Use `pin()` when multiple reads must belong to the same causal coordinate:

```ts
const pinned = await runtime
  .observer(observer)
  .at({
    basis: "latest-visible",
    posture: {
      value: "clear",
      proof: "receipt",
      transport: "local",
    },
  })
  .pin();

const detail = await pinned.read(QuestReading.detail({ questId }));
const comments = await pinned.read(
  QuestReading.comments({ questId }).page({ limit: 20 }),
);
```

A write from a pinned session does not advance that pinned session. Accepted
write outcomes return an admission coordinate. Applications must explicitly
create or pin a new session to read from that coordinate.

```ts
const pinned = await session.pin();
const outcome = await pinned.write(intent);

const oldView = await pinned.read(QuestReading.detail({ questId }));

const newView = await runtime
  .observer(observer)
  .at(outcome.coordinate)
  .read(QuestReading.detail({ questId }));
```

## Readings and observation outcomes

An applied reading is a canonical declaration of what should be observed.

```ts
type AppliedReading<Value> = {
  kind: "reading";
  optic: OpticRef;
  args: CanonicalJsonObject;
  selection?: SelectionSpec;
  page?: PageSpec;
  aperture: ApertureSpec;
  basisPolicy: BasisPolicy;
  requestedPosture: RevelationPosture;
  support: SupportObligationSpec;
  projection: ProjectionSpec<Value>;
  appliedDigest: AppliedDigest;
  optimizationDigest?: AppliedDigest;
};
```

The reading does not perform observation. The runtime target evaluates it from
an observer session.

`observe` returns an outcome:

```ts
type ObservationOutcome<Value> =
  | Observed<Value>
  | PluralObservation<Value>
  | ConflictObservation
  | ObstructedObservation;

type Observed<Value> = {
  kind: "observed";
  observation: ObservationEnvelope<Value>;
};

type PluralObservation<Value> = {
  kind: "plural";
  observations: ObservationEnvelope<Value>[];
  plurality: PluralityReport;
  coordinate?: CoordinateReceipt;
  evaluation?: EvaluationReceipt;
};

type ConflictObservation = {
  kind: "conflict";
  conflict: ConflictArtifact;
  coordinate?: CoordinateReceipt;
  evaluation?: EvaluationReceipt;
};

type ObstructedObservation = {
  kind: "obstruction";
  obstruction: ObstructionArtifact;
  coordinate?: CoordinateReceipt;
  evaluation?: EvaluationReceipt;
};
```

The envelope exists only when an observation exists:

```ts
type ObservationEnvelope<Value> = {
  value: Value;
  observer: ObserverRef;
  coordinate: CoordinateReceipt;
  reading: AppliedReadingReceipt<Value>;
  aperture: ApertureReceipt;
  revelation: RevelationReceipt;
  support: SupportLedger;
  evaluation: EvaluationReceipt;
  proof?: ProofEnvelope;
  transport?: TransportReceipt;
  degeneracy?: DegeneracyReport;
  witnessDebt?: WitnessDebt[];
};

type AppliedReadingReceipt<Value> = {
  ref: AppliedReadingRef;
  declaration?: AppliedReading<Value>;
  appliedDigest: AppliedDigest;
};
```

`read(r)` is equivalent to unwrapping `observe(r)` when the outcome is
`observed`. For plural, conflict, or obstruction, `read` throws a
`ContinuumObservationError` carrying the full outcome.

`observeMany` is the v1 consistency helper. On an alias-backed session, it
resolves the coordinate once for the whole group.

## Intents, occurrences, and admission

An applied intent declares an act shape:

```ts
type AppliedIntent<Result> = {
  kind: "intent";
  optic: OpticRef;
  args: CanonicalJsonObject;
  site: SiteDescriptorSpec;
  footprint: FootprintSpec;
  support: SupportObligationSpec;
  admission: AdmissionPolicySpec<Result>;
  appliedDigest: AppliedDigest;
  optimizationDigest?: AppliedDigest;
};
```

An occurrence records which act instance this is:

```ts
type OccurrenceRef = {
  issuer: ObserverRef | DeviceRef | ClientRef;
  localId: string;
  occurrenceKeyDigest: string;
};

type OccurredIntent<Result> = {
  kind: "occurred-intent";
  intent: AppliedIntent<Result>;
  occurrence: OccurrenceRef;
  occurredDigest: string;
};
```

Digest semantics:

```ts
occurrenceKeyDigest = hash({
  issuer,
  localId,
});

occurredDigest = hash({
  occurrenceKeyDigest,
  appliedDigest,
});
```

Same occurrence key plus same applied digest means retry. Same occurrence key
plus different applied digest means conflict or obstruction. Different
occurrence key plus same applied digest means a separate authored act.

Authorship binds an occurrence to observer authority:

```ts
type AuthoredIntent<Result> = {
  kind: "authored-intent";
  occurred: OccurredIntent<Result>;
  author: ObserverRef;
  authority?: AuthorityReceipt;
  authoredAt?: LogicalTime | WallClockReceipt;
  nonce?: string;
  signature?: SignatureEnvelope;
};
```

If `AuthoredIntent.signature` is present, it must cover the authored intent
digest, including occurrence, applied intent digest, author, authority, and any
`authoredAt` fields included in the signed form.

The public session may accept either occurred or authored intent:

```ts
await session.write(
  QuestIntent.recordComment({ questId, body }).occur(clientActId),
);
```

The target-internal evaluator should accept only `AuthoredIntent`:

```ts
interface IntentEvaluator {
  admit<Result>(
    session: ObserverSessionContext,
    intent: AuthoredIntent<Result>,
  ): Promise<AdmissionOutcome<Result>>;
}
```

The public facade normalizes before crossing the authority boundary.

Admission returns a coproduct:

```ts
type AdmissionOutcome<Result> =
  | Accepted<Result>
  | Plural<Result>
  | Conflict
  | Obstruction;

type Accepted<Result> = {
  kind: "accepted";
  result: Result;
  support: SupportLedger;
  receipt: AdmissionReceipt;
  coordinate: CoordinateReceipt;
};

type AdmissionReceipt = {
  authored: AuthoredIntentRef;
  sourceCoordinate: CoordinateReceipt;
  admissionCoordinate: CoordinateReceipt;
  evaluation: EvaluationReceipt;
  support: SupportLedger;
  admittedAt?: RuntimeReceipt;
};
```

`Accepted.coordinate` is the app-facing alias for
`Accepted.receipt.admissionCoordinate`.

Plural, conflict, and obstruction outcomes should carry the strongest
coordinate, target, and evaluation receipts available without pretending a stage
occurred when it did not.

## Revelation posture

Revelation posture is dimensional:

```ts
type RevelationPosture = {
  value: "opaque" | "redacted" | "clear";
  proof: "none" | "receipt" | "public-proof" | "witness";
  transport: "none" | "local" | "shareable";
};
```

Dimension order:

```text
value:
  opaque <= redacted <= clear

proof:
  none <= receipt <= public-proof <= witness

transport:
  none <= local <= shareable
```

`meet(a, b)` is dimension-wise minimum.

Cross-dimension constraints still matter:

- `proof: "witness"` may require `value != "opaque"` unless the witness is
  independently redacted;
- `transport: "shareable"` may be disallowed for witness material unless policy
  explicitly allows it;
- a target may always lower effective posture to satisfy authority, budget,
  privacy, or proof-revelation policy.

`CoordinateReceipt.coordinatePosture` is the resolved session-level posture.
`ObservationEnvelope.revelation.effective` is the final per-reading posture
after observer rights, coordinate posture, reading request, target policy,
selection, aperture, and support constraints compose.

## Digests and canonical declarations

Applied declarations must be canonical values.

They must not contain functions, class instances, process-local handles, Date
objects, BigInts, `undefined`, or key-order-sensitive objects.

Canonical object keys must be sorted by the chosen canonical encoder.

Canonical numbers must be finite JSON numbers within the range allowed by the
schema. `NaN`, `Infinity`, `-Infinity`, `-0`, unsafe integers, and
platform-specific float encodings are not valid canonical values.

Large integers, decimals, timestamps, byte counts, and content lengths should be
encoded as strings with schema-level numeric meaning.

The digest roles are distinct:

```text
lawpack.semanticDigest     meaning of the app/domain law
lawpack.schemaDigest       declared argument/result schemas
appliedDigest              canonical applied reading or intent declaration
optimizationDigest         optional performance hint identity
lowering.loweringDigest    target evaluator/lowering identity
runtime receipt            target runtime implementation identity
```

Changing an optimization hint must not change meaning. Changing the semantic
law must change the semantic digest.

## Support and proof

Support is compositional:

```ts
Support.for(QuestReading.detail({ questId }).select(["status"]));
```

`Support.for(reading)` should itself produce an `AppliedReading<SupportView>`:

```ts
type SupportView = {
  subject: AppliedReadingRef;
  ledger: SupportLedger;
};
```

Proof state is not boolean:

```ts
type ProofEnvelope = {
  kind:
    | "none"
    | "replay"
    | "signature"
    | "merkle"
    | "verkle"
    | "ipa"
    | "zk";
  status:
    | "not-provided"
    | "not-checked"
    | "verified"
    | "failed"
    | "not-revealed";
  publicInputs?: CanonicalJsonObject;
  proofRef?: string;
};
```

No proof, unchecked proof, failed proof, and unrevealed proof are different
states and must remain distinguishable.

## Cursors and pagination

Pagination is part of the applied reading declaration:

```ts
type PageSpec = {
  limit?: number;
  cursor?: CursorRef;
};

type CursorRef = {
  kind: "cursor";
  target: TargetRef;
  coordinate: CoordinateReceiptRef;
  reading: AppliedReadingRef;
  aperture: ApertureReceiptRef;
  token: string;
};
```

Cursor tokens are opaque and target-bound. They must not reveal storage layout.

Failure behavior should be typed:

```text
malformed cursor -> construction or validation error
wrong target -> obstruction: cursor-target-mismatch
wrong observer/authority -> obstruction: cursor-not-authorized
wrong reading/aperture/coordinate -> obstruction: cursor-context-mismatch
expired cursor -> obstruction: cursor-expired
cursor from another runtime -> obstruction unless transported by a membrane
```

The `.page(...)` helper should transform the output type:

```ts
QuestReading.comments({ questId }).page({ limit: 50 });
// AppliedReading<Page<Comment>>
```

Pages remain pinned to the coordinate receipt unless the reading explicitly
declares live or drifting behavior.

## Runtime membranes

Transporting a source observation is not the same as asking the target to
observe for itself:

```ts
await membrane.transportObservation(sourceEnvelope, target);

const reading =
  sourceEnvelope.reading.declaration
  ?? await registry.resolveReading(sourceEnvelope.reading.ref);

await targetSession.observe(reading);
```

If `AppliedReadingReceipt` only carries a reference, the target must resolve the
declaration before re-observing.

The membrane law stays:

```text
source honesty does not force destination admission
```

## Failure taxonomy

Do not launder runtime faults into domain outcomes.

Construction errors happen before evaluation:

- invalid arguments;
- invalid schema;
- malformed applied optic;
- non-canonical JSON;
- missing occurrence identity for writes.

Domain outcomes are meaningful results of evaluating a valid declaration:

- unsupported lawpack;
- observer not authorized;
- budget exhausted;
- conflict;
- obstruction;
- plurality.

Runtime faults are implementation or infrastructure failures:

- IO failure;
- storage corruption;
- unavailable CAS;
- evaluator panic;
- process crash;
- out of memory;
- implementation bug.

Runtime faults should surface as runtime faults, not as Continuum obstructions.

## Minimum laws

The proposed contract requires at least these laws:

- **Coordinate resolution:** determinism applies to resolved coordinate receipts,
  not aliases such as `latest-visible`.
- **Pinned session:** pinned reads remain pinned after writes until explicitly
  repinned.
- **Read unwrap:** `read(r)` unwraps `observe(r)` only when the outcome is
  `observed`; otherwise it throws an error carrying the full outcome.
- **Observation exhaustiveness:** serious code handles observed, plural,
  conflict, and obstruction.
- **Admission exhaustiveness:** serious code handles accepted, plural, conflict,
  and obstruction.
- **Occurrence binding:** within the same occurrence issuer namespace, the same
  occurrence key must bind to the same applied intent digest.
- **Admission idempotence:** the same occurrence must not be admitted twice into
  the same target coordinate lineage.
- **Aperture non-revelation:** selection must not reveal value, support, proof,
  witness, or transport material outside the effective aperture.
- **Posture monotonicity:** a more restrictive posture must not reveal more than
  a less restrictive posture under the same observer, coordinate, reading,
  target state, semantic lawpack, and lowering.
- **Lowering receipt:** observation and admission receipts identify the semantic
  lawpack and applicable target lowering.
- **Runtime fault separation:** domain obstruction must not conceal malformed
  declarations, storage corruption, unavailable infrastructure, or bugs.
- **Cursor binding:** cursor use must match target, coordinate, reading,
  aperture, and authority.

## What targets owe

`git-warp` should implement this contract as an observer-facing facade over its
Git-native causal storage and CAS behavior. It should not make app code speak in
graph, worldline, materialization, or commit-walk nouns.

Echo should implement the same contract using its retained state, strands,
admission logs, proof envelopes, and local execution engine.

Edict should eventually become the semantic authoring path for optic families,
intents, lawpacks, and target lowerings. Until then, TypeScript builders should
behave like generated artifacts: canonical, serializable, digest-addressed, and
hostile to closure-based semantics.

Wesley should transport authored structure into generated artifacts without
owning target semantics.

## Practical migration shape

Phase 1:

```text
Hand-authored TypeScript optic and intent declarations.
Canonical applied declarations.
No substrate handles in app code.
```

Phase 2:

```text
Wesley validates and generates wrappers from schemas or Edict-compatible IR.
Runtime targets register explicit lowerings.
```

Phase 3:

```text
Edict owns optics, intents, lawpacks, support obligations, and target lowerings.
Generated TypeScript/Rust APIs preserve the same call shape.
```

The public promise is stable across phases:

```ts
await session.read(QuestReading.detail({ questId }));
await session.observe(QuestReading.timeline({ questId }));
await session.write(
  QuestIntent.recordComment({ questId, body }).occur(clientActId),
);
```

Friendly call site, ruthless receipt trail.

---
title: Continuum Spine Protocol Report
status: proposed
---

# Continuum Spine Protocol Report

**Cycle:** 0030-continuum-spine-protocol-report
**Legend:** SOURCE
**Type:** coordination report
**Sponsor human:** James
**Sponsor agent:** Codex

## Hill

Define Continuum as the spine protocol for generic causal computing:

- enough shared vocabulary for Echo, `git-warp`, WARP TTD, WARP DRIVE,
  Wesley, Graft, apps, and third-party runtimes to interoperate;
- enough protocol shape for causal-history exchange, debugging, observation,
  lawful optic use, counterfactual work, and app complementarity;
- enough conformance posture that a runtime can join without adopting another
  runtime's database, scheduler, or internal materialization model.

The key claim is:

**Continuum is not a runtime, database, debugger, compiler, or app framework.
Continuum is the witnessed causal boundary that lets those things cooperate.**

## Executive Summary

Continuum should be a protocol suite, not a central service API.

It should define:

- shared contract families and vocabulary;
- common message envelopes;
- capability and discovery profiles;
- evidence and witness posture;
- suffix import/export and settlement;
- observer, optic, and reading contracts;
- optional debugger, counterfactual, law-publication, and app-composition
  profiles;
- conformance tests and machine-readable witnesses.

It should not define:

- one storage format;
- one database;
- one graph materialization;
- one scheduler;
- one debugger UI;
- one authorization provider;
- one app ontology.

This is the strongest path to the stated product goal: Echo and `git-warp`
interoperate without sharing internals, future third-party runtimes can join
without becoming clones, WARP TTD can attach to any compatible target, and
Continuum apps can complement each other through shared causal history, laws,
optics, observers, readings, witnesses, lanes, coordinates, and
counterfactuals.

## Visionary Statement

Continuum should make causal computing feel like the web did for documents:
any participant can publish, observe, link, import, verify, and extend a shared
medium without asking one implementation to own the medium.

The web did not require every browser, server, and authoring tool to share one
database. Git did not require every working copy to share a process. Debugger
Adapter Protocol did not require every IDE to embed every debugger. Trace
Context did not require every service to share one tracing backend. Continuum
should apply the same lesson to causal computation: define the boundary facts,
messages, and evidence that cross implementations, then let implementations
remain free inside their own kernels.

The technical bet is that the shared unit is not "state." The shared unit is
**witnessed causal history plus lawful readings over it**.

## Research Anchors

Continuum has no exact precedent. The useful precedents point to protocol
shape, not domain equivalence:

- [Lamport clocks](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)
  show why distributed systems need explicit ordering relations rather than
  ambient wall-clock truth. Continuum needs coordinates, frontiers, lanes, and
  witnessed suffixes for the same reason.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/) standardizes
  trace identity propagation across distributed services. Continuum needs a
  stronger causal coordinate and witness carrier, but the same cross-vendor
  propagation lesson applies.
- [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
  separate traces, metrics, logs, and baggage from any one backend. Continuum
  should similarly separate causal evidence from any one runtime or debugger.
- [CloudEvents](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)
  defines a common event envelope for event-driven interop. Continuum needs a
  common causal envelope for intents, ticks, observations, suffix bundles,
  imports, and debug events.
- [W3C PROV-DM](https://www.w3.org/TR/prov-dm/) gives a provenance vocabulary
  for entities, activities, agents, and derivations. Continuum needs a
  stricter runtime-grade witness and admission vocabulary, but PROV is a useful
  warning against burying provenance in prose.
- [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
  and [DID Core](https://www.w3.org/TR/did-core/) separate claims,
  presentations, issuers, holders, verifiers, and decentralized identifiers.
  Continuum should use the same style of separable identity and presentation
  posture for authority and witness claims.
- [UCAN](https://ucan.xyz/) is a useful capability-token precedent for
  delegated authority. Continuum should be capability-shaped, especially for
  agents, debug access, suffix export, and law/optic admission.
- [GraphQL](https://spec.graphql.org/October2021/) is a stable schema and type
  system precedent. Continuum already uses GraphQL SDL as the authored root for
  shared contract families.
- [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/)
  separates editor/debugger UX from debugger implementations. Continuum should
  make WARP TTD compatibility a capability profile, not an app-specific
  integration.
- [ActivityPub](https://www.w3.org/TR/activitypub/) is a useful federation
  precedent: actors can communicate across servers. Continuum should do this
  for causal histories and readings, not social activities.
- [Git](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
  proves the product value of portable history and local autonomy. Continuum
  should preserve those traits while adding runtime admission, evidence, and
  observer contracts.
- [IPLD](https://ipld.io/docs/) is a content-addressed data precedent.
  Continuum suffix bundles, witnesses, generated artifacts, and retained
  readings should be digest-addressable.
- [WebAssembly Component Model](https://component-model.bytecodealliance.org/)
  and WIT show how language-neutral component boundaries can work. Continuum
  can eventually offer component bindings without making them the protocol
  itself.
- [Model Context Protocol tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
  are a useful agent-interface precedent. Continuum agent surfaces should be
  structured tools, resources, and JSON/JSONL outputs, not screen-scraped UI.
- [CRDT literature](https://crdt.tech/papers.html) is an important contrast.
  CRDTs converge replicated state under specific algebraic constraints.
  Continuum should be broader: it exchanges witnessed causal suffixes and
  admits, stages, pluralizes, conflicts, or obstructs them under explicit law.

## Local Evidence

This report inspected the following local candidates in `~/git`:

- `~/git/continuum` at
  `01e0735b3887c06e94f11023df8c12143f30d0bb`.
  `README.md` says Continuum owns shared vocabulary, contract families,
  admissibility language, witness/receipt boundaries, compatibility evidence,
  invariants, and sibling-runtime coordination. It also says a Continuum
  runtime can publish, admit, observe, export, and import witnessed causal
  history according to Continuum families and laws.
- `~/git/echo` at
  `33052efab7c98bbca2b7afc4dd910edb11bf96b0`.
  `README.md` positions Echo as a deterministic runtime over witnessed causal
  history with runtime-owned admission, scheduling, ticks, receipts, readings,
  and witnessed suffix transport.
- `~/git/warp-ttd` at
  `4da1cb622603c94f36737d7eb78fc74c592f67f6`.
  `README.md` positions WARP TTD as a host-neutral time-travel debugger and
  wide-aperture observer over causal truth, with CLI JSON entry points and a
  GraphQL protocol schema.
- `~/git/warp-drive` at
  `a57b82992d14267fc1b954230f7f2c24764bffe5`.
  `README.md` positions WARP DRIVE as a POSIX-shaped membrane over witnessed
  causal history where reads are observations and writes are intents; it is
  explicitly substrate-agnostic and intended to work with any Continuum runtime.
- `~/git/wesley` at
  `6e23653faa822a6f1e0d81987a1dcd24c51fce43`.
  `README.md` positions Wesley as a domain-empty semantic contract compiler
  that compiles GraphQL SDL into generated artifacts, runtime manifests,
  codecs, validators, observer plans, and transport bindings.
- `~/git/graft` at
  `a26a1c167f57976e9b0e19596b60f446cdcea5f8`.
  `README.md` positions Graft as a context governor for agents, with CLI, MCP,
  daemon, and library surfaces plus machine-readable receipts and structural
  history.
- `~/git/jedit` at
  `173f4797ace6f903456f2f98952acb0fcbcf550f`.
  `README.md` positions jedit as an Echo-shaped product-pressure app whose
  edits submit contract intents and whose witnesses prove contract metadata,
  reading identity, retained evidence, and replay posture.
- `~/git/continuum-wizard-demo` at
  `ee39f9a717e3385c5d3b440210498bccbc9ccf8d`.
  `README.md` proves a WARPspace bootstrap can read a Continuum stack manifest,
  materialize a shared family, write config/lock files, and run generator
  outputs for Continuum, WARP TTD, and Echo.
- `~/git/aion` locally positions Continuum as the protocol medium that emerges
  when every participant speaks witnessed admission, with Echo and `git-warp`
  as runtimes, Wesley as compiler, and WARP TTD as debugger.

No `~/git/git-warp` checkout was present in this workspace during this report.
`git-warp` is therefore cited through local Continuum and AION docs as an
expected sibling runtime, not through direct local source inspection.

## Product Definition

Continuum is for products that need to agree about what happened, what can be
seen, what can be replayed, what can be imported, what remains plural, and what
authority permitted a transition.

A "Continuum app" is an app that speaks at least one Continuum protocol profile.
It may be:

- a native runtime app backed by Echo;
- a Git-backed app backed by `git-warp`;
- a filesystem membrane such as WARP DRIVE;
- a debugger such as WARP TTD;
- a structural observer such as Graft;
- an editor such as jedit;
- a third-party runtime that speaks the boundary messages and produces
  conformance witnesses.

The product promise is:

> If a runtime or app exposes the required Continuum profiles, another
> Continuum-capable tool can discover it, understand its capabilities, request
> lawful observations, exchange witnessed causal history when authorized,
> debug it when debug profiles are available, and report exactly what was
> native, translated, missing, denied, obstructed, or still plural.

## What Continuum Gives You

### 1. Exchange Witnessed Causal History

Continuum defines how a participant exports and imports witnessed causal
suffixes:

- source runtime identity;
- source lane and coordinate;
- source frontier;
- suffix payload references;
- witness references;
- contract-family versions;
- admission basis;
- settlement posture;
- import result.

This is not state synchronization. It is history exchange with explicit
admission into the receiving runtime.

### 2. Runtime Discovery

Continuum should define `continuum.runtime.hello.v1`.

The hello profile answers:

- what runtime is this?
- which Continuum versions does it speak?
- which contract families does it publish or consume?
- which capability profiles are available?
- what is native, translated, fixture-only, or unsupported?
- how does a caller connect?
- what credentials are required for each profile?
- what information is redacted until authorization?

This is what lets WARP TTD boot without knowing whether it is attaching to
jedit, Echo, `git-warp`, WARP DRIVE, or a third-party runtime.

### 3. Debugging Through WARP TTD

Debugging should be available only when a target advertises a debugger profile.

Minimum debug profile:

- discovery and target descriptor;
- read-only causal history inspection;
- observation requests;
- reading envelopes;
- evidence posture;
- replay coordinate navigation.

Extended debug profile:

- causal breakpoints;
- effect and receipt breakpoints;
- admission breakpoints;
- counterfactual branch creation;
- branch comparison;
- evidence ledger export;
- report export.

Credentials depend on the target posture:

- public demo runtimes may allow anonymous read-only inspection;
- local same-user runtimes may allow local process credentials;
- private runtimes require a capability presentation;
- sensitive lanes may require explicit consent grants;
- mutation, import, law admission, or branch promotion always requires
  admitted authority.

WARP TTD should never infer privileged state by scraping pixels or app-specific
UI. It should use the Continuum discovery, observation, replay, and debug
families.

### 4. Compatibility With WARP DRIVE

WARP DRIVE is a strong Continuum app candidate because its whole product shape
is "files are readings, writes are intents."

Continuum gives WARP DRIVE:

- runtime discovery;
- contract-family dependency declaration;
- observation requests for file-like materializations;
- intent envelopes for writes;
- suffix export/import for lane sharing;
- debugger attachment through WARP TTD;
- evidence envelopes that tell an editor, agent, or build tool which file bytes
  are readings and which causal coordinate they came from.

WARP DRIVE should not become part of Continuum core. It should be a profile and
application family layered on the shared runtime boundary.

### 5. Wesley Optic Compatibility

Continuum should not mean "any Wesley optic may run anywhere."

The right rule is:

1. Wesley compiles an optic, law, or runtime requirement into deterministic
   artifacts.
2. Continuum names the artifact family, digest, capability shape, and admission
   outcome vocabulary.
3. A runtime or host authority admits, stages, obstructs, or rejects the optic.
4. The result carries a witness or obstruction reason.

In other words, Continuum can standardize **optic publication and admission
protocol**, but it should not grant ambient authority to arbitrary optics.

### 6. Law Registration

Continuum should eventually define `continuum.law.optic.v1`.

That profile should cover:

- law bundle descriptors;
- compiled requirement digests;
- compatibility claims;
- required capability grants;
- admitted scope;
- obstruction reasons;
- revocation or expiry;
- witness references.

But the runtime or host authority owns the actual decision. Continuum names the
boundary and the proof shape. It does not become a global law registry that
overrides local policy.

### 7. App Complementarity

Continuum apps should be able to add features to each other through profiles:

- jedit edits text through Echo and exposes reading evidence.
- Graft supplies structural readings over saved files or causal snapshots.
- WARP DRIVE presents causal readings as files.
- WARP TTD attaches to any compatible target and debugs history.
- Wesley compiles shared and app-local contract families.
- Echo or `git-warp` runtimes exchange witnessed suffixes.

The shared spine is not a UI plugin system. It is the contract and evidence
medium that makes app cooperation lawful.

## What Continuum Is Not For

Continuum is not for:

- replacing Echo or `git-warp`;
- hiding runtime differences behind fake normalization;
- defining one universal graph database;
- turning every app noun into a shared noun;
- letting tools mutate host state without admission;
- bypassing credentials because a debugger is attached;
- promising replay when the target cannot produce replay evidence;
- making counterfactual branches canonical without explicit promotion;
- converting every stateful problem into a CRDT problem;
- treating generated artifacts as semantic owners.

## Shared Vocabulary

The core vocabulary should be small enough to learn and strict enough to block
shadow contracts.

### Runtime

An implementation that can publish, admit, observe, export, or import witnessed
causal history according to one or more Continuum profiles.

### App

A product surface that submits intents, observes readings, publishes artifacts,
or composes with runtimes through Continuum profiles. An app may be backed by a
runtime, but it is not itself the protocol owner.

### Contract Family

A named semantic family authored as GraphQL SDL and governed by Continuum or an
app/domain owner. Wesley may compile it. Runtimes may emit or consume values
that conform to it.

### Generated Artifact

A compiler output derived from a contract family. Generated artifacts are
important evidence and integration surfaces, but they are not semantic owners.

### Intent

A canonical proposed action from a human, agent, app, adapter, or runtime. An
intent is not admitted work until a runtime admits it under law.

### Intent Envelope

The shared set-side carrier for operation identity, payload identity, target
lane, basis, capability presentation, and witness posture.

### Admission Law

The named rule that determines whether an intent, import, optic, branch, or law
publication can proceed from a basis.

### Admission Outcome

The lawful result of admission. Core outcomes are:

- `Derived`
- `Plural`
- `Conflict`
- `Obstruction`

Additional profile-specific outcomes may refine these without replacing them.

### Tick

A runtime-owned logical commit boundary. Ticks are not wall-clock time.

### Receipt

Machine-checkable evidence for an admitted operation, rejected operation,
delivery observation, import, or other protocol event.

### Witness

Evidence that a claim was made, checked, admitted, observed, retained, denied,
or obstructed at a coordinate under a named profile.

### Lane

A causal track, worldline, branch, strand, or coordinate family where admitted
history accumulates. Profiles should avoid assuming one runtime's internal lane
implementation.

### Coordinate

A runtime-meaningful reference to a point, frontier, or basis in causal history.
Coordinates are portable only through declared profile semantics and witnesses.

### Frontier

The known boundary of a lane or set of lanes at which an operation, observation,
suffix export, or counterfactual branch is based.

### Witnessed Suffix

The export/import unit for a portion of causal history. A witnessed suffix is
not a state snapshot.

### Settlement

The process that decides how incoming causal claims relate to local history:
admitted, braided, staged, plural, conflicting, obstructed, or rejected.

### Observer

A lawful read process with aperture, basis, state, update law, emission law,
budget, rights, and evidence posture.

### Reading

The emitted result of an observer at a basis. A reading may be graph-like,
file-like, UI-like, structural, diagnostic, or domain-specific. It is not the
source of truth.

### Reading Envelope

The evidence wrapper for a reading: basis, observer identity, contract family,
payload identity, rights, budget, redaction, residuals, and witness references.

### Optic

A structured way to observe or propose change through a bounded aperture and
basis. An optic must be compiled, admitted, and witnessed before it can become
trusted runtime interaction.

### Law Bundle

A published artifact describing admission, observation, rewrite, settlement, or
optic behavior. Runtime policy decides whether and where it is admitted.

### Capability

A scoped grant or presentation that permits a caller to use a profile, observe
a lane, export a suffix, import a bundle, run a counterfactual, or request
debug access.

### Evidence Status

The posture of an artifact or result:

- native Continuum evidence;
- translated substrate evidence;
- fixture witness;
- descriptor-only claim;
- unsupported;
- obstructed;
- redacted.

### Counterfactual Branch

A non-canonical lane created to ask "what would have happened if..." from a
basis. Promotion to canonical history is a separate admitted operation.

### Warpspace

A local or shared project constellation manifest that names apps, runtimes,
contract families, generated roots, capability profiles, and compatibility
claims.

### Compatibility Profile

A named conformance tier describing which Continuum messages and behaviors a
participant supports.

## Protocol Shape

Continuum should be defined as contract families plus profile bindings.

The protocol should have four layers:

1. **Semantic layer:** GraphQL-authored contract families and vocabulary.
2. **Message layer:** versioned envelopes and payload families.
3. **Binding layer:** HTTP, stdio, MCP, CLI JSON/JSONL, file bundle, Git remote,
   WASM component, or runtime-local API bindings.
4. **Witness layer:** conformance tests, fixture witnesses, runtime witnesses,
   interop witnesses, and evidence ledgers.

No binding is the protocol. A runtime may expose local stdio and another may
expose HTTP. They are compatible only if they speak the same profile semantics
and produce comparable witnesses.

## Base Envelope

Every Continuum message should carry a common envelope:

```graphql
type ContinuumEnvelope {
  continuumVersion: String!
  profile: String!
  messageType: String!
  messageId: ID!
  source: ParticipantRef!
  target: ParticipantRef
  basis: CausalBasis
  contractFamilies: [ContractFamilyRef!]!
  payloadDigest: DigestRef!
  payloadCodec: CodecRef!
  authPresentation: CapabilityPresentationRef
  redaction: RedactionPosture
  evidence: [EvidenceRef!]!
  createdAt: String!
}
```

The envelope exists so tools can:

- route without understanding app payloads;
- preserve profile and schema version truth;
- verify payload identity;
- distinguish native from translated evidence;
- explain missing authorization;
- avoid scraping prose.

## Required Core Profiles

### `continuum.runtime.hello.v1`

Purpose:

- discover a runtime or app;
- identify supported profiles;
- identify auth posture;
- identify native versus translated evidence posture;
- publish connection hints without leaking secrets.

Availability:

- should be available to unauthenticated local discovery with redaction;
- may require credentials for network endpoints or private metadata;
- must never expose lane contents by default.

Minimum nouns:

- `RuntimeDescriptor`
- `ParticipantRef`
- `ConnectionHint`
- `CapabilityProfile`
- `EvidencePosture`
- `AuthPosture`

### `continuum.contract.index.v1`

Purpose:

- list authored and consumed contract families;
- identify semantic owners;
- identify generated artifact roots;
- identify schema digests and version ranges;
- identify fixture, runtime, and interop evidence.

Availability:

- public for open-source repos and local demos;
- capability-gated for private app families or sensitive generated artifacts.

Minimum nouns:

- `ContractFamilyDescriptor`
- `SchemaDigest`
- `GeneratedArtifactRef`
- `CompatibilityClaim`
- `ConformanceWitnessRef`

### `continuum.observation.v1`

Purpose:

- request lawful readings;
- return evidence-bearing readings;
- preserve redaction, residual, budget, and rights posture;
- give agents and debuggers a stable read model.

Availability:

- requires read capability for the requested lane, aperture, and basis;
- may return obstruction instead of a payload;
- may return translated evidence when the runtime is not Continuum-native.

Minimum nouns:

- `ObserverPlan`
- `ObservationRequest`
- `ReadingEnvelope`
- `ReadingPayloadRef`
- `ObservationObstruction`

### `continuum.history.exchange.v1`

Purpose:

- export witnessed suffixes;
- import suffix bundles;
- run settlement;
- return import outcomes.

Availability:

- export requires source read/export capability;
- import requires target admission capability;
- cross-runtime interop is not proven until a live import/export witness exists.

Minimum nouns:

- `WorldlineDescriptor`
- `CausalCoordinate`
- `Frontier`
- `WitnessedSuffixShell`
- `CausalSuffixBundle`
- `ImportRequest`
- `SettlementPlan`
- `ImportOutcome`

## Optional Profiles

### `continuum.debug.v1`

Purpose:

- let WARP TTD and other debuggers inspect causal history without app-specific
  knowledge.

Capabilities:

- list lanes and available coordinates;
- seek to a coordinate;
- replay forward and backward where evidence permits;
- query receipts, effects, admissions, obstructions, and readings;
- expose debugger facts as structured JSON;
- export evidence ledgers and reports.

Credential rule:

- read-only debug is still authority-bearing and must be capability-gated when
  history is private;
- write, import, law, or branch-promotion operations must use admitted intents,
  not debugger back doors.

### `continuum.breakpoint.v1`

Purpose:

- define causal breakpoints independent of any debugger UI.

Breakpoint classes:

- admission breakpoint;
- receipt breakpoint;
- effect emission breakpoint;
- observer reading breakpoint;
- law obstruction breakpoint;
- capability denial breakpoint;
- frontier crossing breakpoint;
- counterfactual divergence breakpoint.

The result of a breakpoint is not a process pause in the traditional sense.
It is a stopped or selected coordinate in a causal replay or live observation
stream.

### `continuum.counterfactual.v1`

Purpose:

- create scratch branches from an explicit basis;
- run alternative intents or imports;
- compare branch outcomes;
- explain divergence.

Availability:

- requires replayable evidence for the chosen basis;
- requires authority to allocate branch resources;
- promotion from counterfactual to canonical history is a separate admitted
  operation.

Minimum nouns:

- `CounterfactualBranchRequest`
- `CounterfactualIntentSet`
- `ReplayRequest`
- `BranchComparisonRequest`
- `DivergenceReport`
- `PromotionRequest`
- `PromotionOutcome`

### `continuum.law.optic.v1`

Purpose:

- publish compiled law and optic artifacts;
- request runtime admission;
- prove acceptance, rejection, obstruction, revocation, and scope.

Availability:

- publishing an artifact may be public;
- admitting an artifact is runtime/authority-specific;
- running an admitted optic requires the capability named by that admission.

Minimum nouns:

- `LawBundleDescriptor`
- `OpticRequirementRef`
- `LawAdmissionRequest`
- `LawAdmissionOutcome`
- `LawScope`
- `LawRevocation`

### `continuum.warpspace.v1`

Purpose:

- describe local app constellations;
- declare runtime targets;
- declare contract-family dependencies;
- map generated roots;
- make bootstrapped apps inspectable by tools.

Availability:

- local manifests can be read by local tooling;
- private endpoint values and credentials must be stored out of band or redacted.

Minimum nouns:

- `WarpspaceManifest`
- `AppDescriptor`
- `RuntimeTargetRef`
- `ContractDependency`
- `GeneratedRoot`
- `ProfileRequirement`
- `LockfileWitness`

### `continuum.agent.v1`

Purpose:

- give agents a stable way to discover, inspect, propose, rehearse, and act
  without using human UI text as the contract.

Availability:

- should prefer CLI `--json`, JSONL streams, MCP tools, generated TypeScript or
  Rust clients, and deterministic witness files;
- should expose enough schema metadata for an agent to write tests and explain
  outcomes.

Minimum nouns:

- `AgentToolDescriptor`
- `AgentResourceDescriptor`
- `InspectableFact`
- `ActionProposal`
- `RehearsalOutcome`
- `AgentReceipt`

## Conformance Tiers

Continuum should not make every participant support everything. It should make
capability gaps explicit.

### Tier 0: Descriptor Only

The participant can describe itself and say what it does not support.

Required:

- `continuum.runtime.hello.v1`

Useful for:

- discovery;
- obstruction clarity;
- migration planning.

### Tier 1: Contract-Shaped

The participant publishes or consumes contract families and schema digests.

Required:

- Tier 0;
- `continuum.contract.index.v1`.

Useful for:

- generated clients;
- conformance planning;
- avoiding shadow schemas.

### Tier 2: Observable

The participant can answer lawful observation requests with reading envelopes.

Required:

- Tier 1;
- `continuum.observation.v1`.

Useful for:

- WARP TTD read-only attach;
- agents;
- dashboards;
- structural observers.

### Tier 3: History-Exchange Capable

The participant can export or import witnessed suffixes.

Required:

- Tier 2;
- `continuum.history.exchange.v1`.

Useful for:

- Echo and `git-warp` interop;
- WARP DRIVE lane sharing;
- third-party runtime migration.

### Tier 4: Debuggable

The participant supports causal debugging semantics.

Required:

- Tier 2;
- `continuum.debug.v1`;
- enough replay evidence for the advertised debug operations.

Useful for:

- WARP TTD generic attach;
- issue reports with reproducible witness ledgers;
- agent investigation.

### Tier 5: Counterfactual

The participant can create scratch branches, run alternate histories, and
compare outcomes.

Required:

- Tier 4;
- `continuum.counterfactual.v1`.

Useful for:

- "what if this intent had been admitted?";
- branch comparison;
- design-space exploration;
- causal root-cause analysis.

### Tier 6: Law/Optic Participant

The participant can admit, obstruct, revoke, and witness law or optic artifacts.

Required:

- Tier 1;
- `continuum.law.optic.v1`;
- runtime policy and authority integration.

Useful for:

- bounded autonomous agents;
- third-party app extension;
- lawful app composition.

## API Or Messages?

Continuum should be neither "just documentation" nor "one API server."

The right shape is:

- **normative contract families** for shared semantics;
- **normative message envelopes** for cross-participant exchange;
- **normative profiles** for capability discovery and conformance;
- **optional bindings** for concrete transports;
- **witness suites** that prove claims.

There should be a small logical Runtime Port API that every binding maps onto:

```text
hello() -> RuntimeDescriptor
listContractFamilies() -> ContractFamilyDescriptor[]
observe(request) -> ReadingEnvelope | ObservationObstruction
exportSuffix(request) -> CausalSuffixBundle | ExportObstruction
importSuffix(bundle, request) -> ImportOutcome
openDebugSession(request) -> DebugSessionDescriptor | DebugObstruction
runCounterfactual(request) -> CounterfactualOutcome | CounterfactualObstruction
publishLawBundle(request) -> LawPublicationOutcome
admitLawBundle(request) -> LawAdmissionOutcome
```

But that port is not one wire protocol. The same logical operations can be
available through:

- CLI JSON;
- MCP tools;
- local stdio;
- HTTP;
- a Git-carried bundle;
- file manifests;
- WASM component bindings;
- in-process libraries.

## Product Design Angle

Continuum's product value is "things just work together because their causal
contracts are inspectable."

For humans, this means:

- WARP TTD shows available Continuum targets without app-specific setup;
- a target explains why debugging is available, partial, denied, or impossible;
- WARP DRIVE can mount a lane without caring whether Echo or another runtime is
  behind it;
- jedit can expose its editing history to debugging, structural reads, and
  filesystem membranes without bespoke adapters for every tool;
- runtime interop is a visible conformance ladder, not folklore.

For maintainers, this means:

- new shared nouns go through Continuum;
- runtime-local internals stay local;
- generated artifacts trace back to authored families;
- open compatibility cuts remain visible until witnessed.

## Operating System Design Angle

Continuum should feel like an operating-system ABI for causal computing:

- a **process** is a participant or runtime;
- a **file descriptor** is a scoped capability handle;
- a **syscall** is a profile operation;
- a **filesystem mount** is a Warpspace or WARP DRIVE projection;
- a **scheduler** is runtime-owned, not app-owned;
- a **trace** is witnessed causal history;
- a **debugger attach** is a capability-gated observation profile;
- a **driver** is a binding or adapter;
- a **kernel boundary** is admission law.

The OS analogy is useful because it keeps authority honest. An app can request
work. It cannot directly tick the runtime, rewrite canonical history, or read
secret lanes simply because it has a UI.

## Networked Causality Design Angle

Continuum is a network protocol for partial orders, not just events.

Its network facts are:

- lanes and coordinates instead of one global clock;
- frontiers instead of "latest state";
- suffixes instead of snapshots;
- admission and settlement instead of blind merge;
- witnesses instead of logs as prose;
- native and translated evidence status instead of fake equivalence;
- plural outcomes instead of forced collapse.

This is why Lamport-style ordering, trace propagation, CloudEvents-style
envelopes, provenance models, and content addressing are useful precedents but
not sufficient alone.

## User Experience Design Angle

A human should experience Continuum through clear capability posture:

1. The tool discovers targets.
2. The user sees which targets are debuggable, observable, exchange-capable, or
   descriptor-only.
3. The user attaches to a target.
4. The tool shows coordinates, lanes, receipts, effects, readings, and
   obstructions.
5. The user can seek, replay, inspect, fork, compare, export, or request
   promotion when the target supports those operations.
6. Failures explain the exact missing profile, credential, witness, or
   permission.

The UX difference from a normal debugger is that the user is not asking "what
is memory now?" The user is asking:

- what was admitted?
- from which basis?
- under what law?
- with which witness?
- what was observed?
- what else could have happened?
- why did this branch diverge?
- can this result be replayed elsewhere?

The UX similarity to normal debuggers is intentional:

- attach;
- choose target;
- set breakpoints;
- step;
- inspect;
- evaluate;
- export a report.

Continuum should not make users learn a new interaction grammar where an old
debugger metaphor already works. It should make the old metaphor causal,
evidence-bearing, and cross-runtime.

## Agent Experience Design Angle

Agents should treat Continuum as a structured interface, not a UI.

Agent requirements:

- discover targets through `hello`;
- inspect contract families and profile support;
- ask for readings with explicit basis and aperture;
- receive machine-readable obstruction reasons;
- propose intents rather than mutate host state;
- rehearse counterfactuals before requesting admission;
- compare branches through structured divergence reports;
- export evidence ledgers;
- cite witnesses in issue reports, PR comments, and design docs.

Agent DX should include:

- stable command ids;
- generated TypeScript/Rust clients;
- MCP tool descriptors;
- JSON Schema or GraphQL introspection for payloads;
- examples that are executable in CI;
- deterministic fixture runtimes;
- conformance harnesses for third-party runtime authors.

If an agent must scrape terminal pixels or parse human prose to know what a
runtime supports, the Continuum surface is incomplete.

## Agent Autonomy Under Lawful Bounded Optics

Continuum should let agents become more autonomous without becoming ambiently
powerful.

The autonomy chain is:

1. Agent discovers a runtime and profile set.
2. Agent selects or requests an optic.
3. Wesley compiles or identifies the optic artifact.
4. Runtime authority admits, scopes, or obstructs the optic.
5. Agent receives a capability-bound handle.
6. Agent uses the handle to observe, rehearse, or propose work.
7. Runtime admits actual mutations separately.
8. Every step emits receipts or obstructions.

This creates useful autonomy:

- the agent can investigate without waiting for bespoke UI support;
- the agent can propose exact causal actions;
- the agent can rehearse safely;
- the agent can explain what evidence supports its conclusion.

It avoids unsafe autonomy:

- no ambient read of hidden lanes;
- no direct scheduler control;
- no mutation through debug APIs;
- no implicit promotion of counterfactual branches;
- no law registration without authority.

## Debugger Semantics

Debugging in Continuum means inspecting and steering causal history through
evidence-bearing surfaces.

### Breakpoints

Causal breakpoints should be predicates over protocol facts:

- stop when an intent targets a family;
- stop when admission returns `Conflict` or `Obstruction`;
- stop when a receipt digest matches a predicate;
- stop when an observer emits a reading with a residual;
- stop when a capability denial occurs;
- stop when an import settlement produces plurality;
- stop when a counterfactual branch diverges from canonical history;
- stop when a law bundle is admitted or revoked.

Traditional breakpoints bind to code locations. Continuum breakpoints bind to
causal facts.

### Stepping

Stepping should support:

- next admitted transition;
- previous admitted transition;
- next effect;
- next observation;
- next settlement decision;
- next divergence;
- next actor/principal event;
- next lane frontier crossing.

### Inspection

Inspection should expose:

- basis;
- lane;
- coordinate;
- intent envelope;
- admission law;
- receipt;
- witness;
- reading envelope;
- payload digest;
- redaction;
- residuals;
- capability posture.

### Counterfactual Debugging

Counterfactual debugging is the major product leap.

Normal debuggers answer:

- what is true at this point?
- what line runs next?
- what value does this variable have?

Time-travel debuggers add:

- what was true before?
- can I replay the execution?

Continuum debugging should add:

- what facts made this transition admissible?
- what would have happened if this intent had been rejected?
- what would have happened if this other suffix arrived first?
- which observations remain invariant across branches?
- which branch first diverged?
- which law or capability boundary explains the divergence?
- can I export a replayable witness for this claim?

This is what "debugging via WARP TTD" should mean: a generic causal debugger
can investigate real, replayable, witnessed histories and counterfactual
branches without knowing the app's private runtime internals.

## Use Cases

### Generic Debugger Attach

A third-party runtime implements Tier 2 and Tier 4. WARP TTD discovers it,
shows its advertised debug profile, asks for observation and replay access, and
debugs it without app-specific code.

### Echo And `git-warp` Suffix Exchange

Echo exports a witnessed suffix. `git-warp` imports it through settlement.
The import outcome records what was admitted, staged, plural, conflicting, or
obstructed. Neither runtime adopts the other's storage format.

### WARP DRIVE Mount Over Any Runtime

WARP DRIVE asks for file-like readings through a declared app profile. Saves
become intents. The same user workflow can target Echo today and another
Continuum runtime later.

### jedit Plus Graft Plus WARP TTD

jedit edits through Echo. Graft contributes structural readings. WARP TTD
debugs edit history and branch divergence. The integration happens through
readings, witnesses, and contract families rather than bespoke side channels.

### Third-Party Runtime Certification

A vendor ships a runtime that passes Tier 0 through Tier 3 conformance. It can
exchange history and be observed, but it does not claim counterfactual or law
admission support until it has witnesses.

### Lawful Agent Investigation

An agent attaches through MCP, receives target descriptors, requests readings,
sets causal breakpoints, runs a counterfactual branch, compares outcomes, and
posts an evidence ledger to a GitHub issue.

### Reproducible Incident Report

An operator exports a Continuum evidence ledger containing coordinates,
suffixes, readings, witnesses, and debug notes. A reviewer imports the report
into a fixture runtime or WARP TTD playback mode and reproduces the causal path.

## Recommendations

### 1. Name Continuum A Protocol Suite

Use "protocol suite" explicitly. It prevents the false choice between "just
docs" and "one API server."

### 2. Freeze `runtime.hello` First

Discovery is the gate for everything else. A debugger cannot be generic until
it can ask a target what it is, what it supports, and what it refuses.

### 3. Keep Debugging Optional But Precise

Make WARP TTD compatibility a profile. Do not imply every Continuum app is
debuggable. Say exactly which profile tier enables which debugger behavior.

### 4. Make Evidence Status Mandatory

Every profile should report whether evidence is native, translated, fixture,
descriptor-only, obstructed, unsupported, or redacted.

### 5. Treat `git-warp` As A Sibling Runtime, Not An Adapter Forever

Until native evidence exists, call it translated or open. The desired future is
sibling-runtime interop, not permanent hand-normalization.

### 6. Make WARP DRIVE A Continuum App Profile

Do not pull POSIX semantics into core Continuum. Define a WARP DRIVE profile
that composes with observation and intent profiles.

### 7. Define Law/Optic Admission As Protocol, Not Authority

Continuum names the messages and evidence. Runtime and host authority make the
decision.

### 8. Build An Agent-First Conformance Harness

Every profile should have:

- a JSON fixture;
- a CLI or MCP witness;
- expected obstruction examples;
- a generated client example;
- a report format agents can cite.

### 9. Add Profile Rows To The Contract Family Registry

The existing registry should grow from family rows to family-plus-profile rows:

- authored;
- profiled;
- fixture-witnessed;
- runtime-witnessed;
- interop-witnessed.

### 10. Keep App Domain Nouns Out Of Core

Continuum core should own `IntentEnvelope`, `ReadingEnvelope`, suffix, witness,
observer, capability, and law/optic posture. App nouns remain app-local until
multiple projects need shared semantics.

### 11. Make Redaction A First-Class Fact

Private history cannot be solved by pretending all observers see everything.
Redaction posture belongs in envelopes and readings.

### 12. Use Content Addressing For Bundles

Suffixes, witnesses, generated artifacts, law bundles, and retained readings
should be digest-addressed so exchange and replay can be verified.

### 13. Make Counterfactuals Scratch By Default

Counterfactual branch results should not become canonical unless a separate
promotion operation is admitted.

### 14. Define Human And Agent Surfaces Together

Every profile should answer both:

- how does a human tool expose this?
- how does an agent inspect this without pixels?

### 15. Publish A Third-Party Runtime Author Guide

The guide should say:

- implement Tier 0 first;
- add contract index;
- add observation;
- add suffix export/import;
- add debug;
- add counterfactuals and law/optic only when runtime evidence is real.

## Proposed Next Cuts

### Cut 1: Runtime Hello Contract Family

Add `continuum-runtime-hello-family.graphql` or extend the runtime-boundary
family with discovery nouns.

Proof:

- Wesley profile fixture;
- descriptor-only runtime fixture;
- WARP TTD target discovery consumer fixture.

### Cut 2: Capability And Evidence Posture Vocabulary

Add a shared vocabulary for native, translated, fixture, descriptor-only,
unsupported, obstructed, redacted, and credential-required states.

Proof:

- schema fixture;
- docs registry row;
- generated artifact witness.

### Cut 3: Observation Profile Conformance Fixture

Prove one `ObservationRequest` to `ReadingEnvelope` path in fixtures.

Proof:

- fixture runtime;
- WARP TTD read-only attach fixture;
- Graft-style structural observer example.

### Cut 4: Suffix Exchange Witness Plan

Define the exact witness required for Echo and `git-warp` interop.

Proof:

- export bundle fixture;
- import outcome fixture;
- settlement obstruction fixture.

### Cut 5: Law/Optic Admission Design Packet

Design the profile but do not implement it until runtime authority boundaries
are ready.

Proof:

- Wesley compiled requirement digest fixture;
- runtime obstruction fixture;
- authority handoff explanation.

### Cut 6: Third-Party Runtime Conformance Guide

Write the public guide for vendors.

Proof:

- one descriptor-only sample runtime;
- one observable fixture runtime;
- one documented "not debuggable yet" obstruction.

## Open Questions

- Should `runtime.hello` live as a new family or inside the existing
  `runtime-boundary-family`?
- Should Continuum standardize one local discovery registry file, or should
  WARPspace be the registry?
- Which identity system should be the first supported capability presentation:
  local same-user handles, DID-style IDs, UCAN-like tokens, or all of them as
  bindings?
- Should counterfactual branch bundles use the same suffix shell as canonical
  history with a branch posture flag, or a separate family?
- What is the minimum debug profile WARP TTD needs for v0.1.0?
- What evidence is enough to call `git-warp` native rather than translated?
- Which profile should own streaming: debug, observation, or a transport
  binding?

## Risks

### Over-Specification

If Continuum defines too much before runtime pressure proves it, it becomes a
paper architecture.

Mitigation:

- define profiles incrementally;
- require fixture and runtime witnesses;
- keep optional profiles optional.

### Under-Specification

If Continuum only says "exchange causal history" without message and evidence
shape, every repo will invent a local version.

Mitigation:

- freeze the base envelope and hello profile first;
- update the contract family registry as each profile lands.

### Shadow Authority

If Continuum appears to grant law, optic, debug, or mutation authority, it will
violate host policy and runtime ownership.

Mitigation:

- Continuum names messages and outcomes;
- runtimes and host authorities admit;
- capabilities are mandatory for sensitive profiles.

### Fake Interop

If translated adapters are labeled native, WARP TTD and agents will over-trust
evidence.

Mitigation:

- evidence status is mandatory;
- interop claims require live suffix exchange/import witnesses.

### App Ontology Creep

If every app wants its nouns in Continuum core, the protocol stops being a
spine.

Mitigation:

- app-local families remain app-local;
- promotion requires multi-project need and a design packet.

## Decision

Continuum should officially define itself as:

> A protocol suite for lawful causal interoperability over witnessed causal
> history.

The protocol should begin with:

1. `continuum.runtime.hello.v1`
2. `continuum.contract.index.v1`
3. `continuum.observation.v1`
4. `continuum.history.exchange.v1`

Then add optional profiles:

1. `continuum.debug.v1`
2. `continuum.breakpoint.v1`
3. `continuum.counterfactual.v1`
4. `continuum.law.optic.v1`
5. `continuum.warpspace.v1`
6. `continuum.agent.v1`

The first implementation goal should be a runtime hello family with descriptor,
capability, auth, and evidence posture. It is the narrowest cut that makes the
generic WARP TTD and third-party runtime story real.

## Playback Questions

### Human

- [ ] Can I explain what Continuum gives me without saying it is a runtime?
- [ ] Can I tell when WARP TTD debugging is available?
- [ ] Can I tell whether credentials are required?
- [ ] Can I explain how Echo and `git-warp` can interoperate without sharing a
      database?
- [ ] Can I tell where WARP DRIVE, Wesley, Graft, and jedit fit?

### Agent

- [ ] Can I discover a target without app-specific code?
- [ ] Can I determine which profiles are supported?
- [ ] Can I request readings without scraping UI?
- [ ] Can I distinguish native from translated or descriptor-only evidence?
- [ ] Can I report exact missing profiles, credentials, witnesses, or laws?

## Smallest Honest Artifact

This report is not implementation proof. It is the protocol framing artifact
that should guide the next schema and conformance cuts.

The smallest next proof is:

- a runtime hello contract family;
- one descriptor-only fixture;
- one generated artifact witness;
- one WARP TTD consumer fixture that proves generic target discovery without
  app-specific knowledge.

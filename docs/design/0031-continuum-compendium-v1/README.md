---
title: Continuum Compendium V1
status: proposed
---

# Continuum Compendium V1

**Cycle:** 0031-continuum-compendium-v1
**Legend:** SOURCE
**Type:** protocol doctrine packet
**Sponsored human:** A Continuum maintainer or runtime/tool author wants a
durable protocol doctrine so they can decide which profiles, envelopes, and
evidence surfaces to implement without making Continuum a runtime or app
ontology.
**Sponsored agent:** An implementation or review agent needs inspectable
participant roles, conformance tiers, and proof surfaces so it can generate
schemas, fixtures, tests, and issues without scraping prose or UI behavior.

Refines:

- [0030 - Continuum Spine Protocol Report](../0030-continuum-spine-protocol-report/README.md)

## Hill

Publish one normalized protocol compendium that defines Continuum as the shared
spine for lawful causal interoperability:

- participant discovery instead of runtime-only discovery;
- profile support separated from contract-family shape;
- message, causal, audit, and evidence envelope components;
- multidimensional evidence posture;
- WARP TTD compatibility as an explicit profile/tier;
- WARP DRIVE as a profile/app over readings and intents;
- law/optic admission as protocol shape, not ambient authority;
- counterfactual branches as scratch history until admitted promotion;
- `warp doctor` and conformance fixtures as first-class proof surfaces.

## Decision Summary

Continuum is a protocol suite for lawful causal interoperability over witnessed
causal history. It is not a runtime, database, compiler, debugger, filesystem,
service registry, app framework, or universal graph.

The shared unit is not state. The shared unit is witnessed causal history plus
lawful readings over it.

The first durable implementation target should be
`continuum.participant.hello.v1`, not `continuum.runtime.hello.v1`. WARP TTD,
WARP DRIVE, Graft, Wesley, jedit, agents, fixtures, and adapters should be able
to speak Continuum without pretending to be runtimes.

Continuum does not make systems agree by sharing a database. It makes systems
agree by publishing what they claim, where they claim it, from which basis,
under which law, with which witness, under which evidence posture, and with
which residuals preserved. Everything else is implementation.

## One-Page Doctrine

1. Continuum is a protocol suite, not a central service API.
2. The shared unit is witnessed causal history plus lawful readings over it.
3. Host-time arrival is not admitted history.
4. Admission is a runtime-owned act judged against a bounded basis under
   explicit law.
5. Observation reveals; it does not author.
6. Counterfactual branches are scratch lanes until explicitly promoted through
   admitted operation.
7. Evidence posture is mandatory and multidimensional.
8. Runtimes may differ internally.
9. Shared nouns require shared ownership.
10. Tools must not reconcile incompatible host stories by hand and then call the
    result native Continuum truth.

In compact form:

```text
History is the territory.
The graph is a coordinate chart.
State is a policy-relative materialized view.
Files are readings.
Writes are intents.
Admission is witnessed.
```

## Core Identity

### What Continuum Is

Continuum is the protocol, contract-family, admissibility, witness, and
compatibility spine for distributed causal computation.

Continuum owns:

- shared causal vocabulary;
- authored shared contract families;
- protocol profiles;
- message envelope shape;
- evidence and witness posture;
- admission and outcome vocabulary;
- suffix exchange semantics;
- observer and reading boundaries;
- capability and redaction posture;
- law/optic publication and admission protocol shape;
- conformance tiers and witness requirements;
- compatibility registry truth and open cuts.

Continuum lets independent participants agree about:

```text
what happened;
where it happened;
from which basis;
under what law;
with which witness;
what can be observed;
what remains plural, conflicted, or obstructed;
what can be replayed;
what can be imported;
what requires authority;
what is native evidence versus translated evidence.
```

### What Continuum Is Not

Continuum is not:

- a runtime;
- a graph database;
- a storage engine;
- a scheduler;
- a debugger UI;
- a filesystem;
- a state-sync protocol;
- a CRDT framework;
- a global law registry;
- a universal app ontology;
- a shadow compiler next to Wesley;
- a cloud service or daemon that must be online;
- a place for tools to fake compatibility.

Continuum does not run app code. Echo, `git-warp`, and later runtimes run and
admit work. Wesley compiles contract families. WARP TTD debugs. WARP DRIVE
mounts readings. Graft observes structure. Apps create product experiences.
Continuum gives them shared causal language and evidence boundaries.

### Participant Definition

A **Continuum participant** is anything that speaks at least one Continuum
profile.

Participant kinds include:

```text
runtime
app
debugger
observer
filesystem membrane
compiler
agent host
warpspace
adapter
fixture runtime
conformance harness
```

A **Continuum runtime** is a participant that owns admission for at least one
causal lane or history domain and can publish runtime-owned outcomes according
to Continuum profiles.

A **full Continuum runtime** can publish, admit, observe, export, and import
witnessed causal history for its advertised profile set.

Participants that only observe, adapt, debug, mount, compile, or test are
Continuum participants, not runtimes.

Discovery should be participant-shaped, not runtime-shaped. WARP TTD, WARP
DRIVE, Graft, Wesley, jedit, fixtures, agents, and adapters should not have to
claim runtime status merely to speak Continuum.

## Product Promise

Continuum's product promise:

> If a participant exposes the required Continuum profiles, another
> Continuum-capable tool can discover it, understand its capabilities, request
> lawful observations, exchange witnessed causal history when authorized, debug
> it when debug profiles are available, and report exactly what was native,
> translated, missing, denied, obstructed, redacted, unsupported, or still
> plural.

This enables:

- Echo and `git-warp` interoperability without a shared database format;
- future third-party runtimes that can join gradually;
- WARP TTD generic attach without bespoke app adapters;
- WARP DRIVE mounts over any compatible runtime;
- jedit, Graft, WARP TTD, WARP DRIVE, agents, and future apps complementing
  each other through shared causal artifacts;
- bounded autonomous agents that operate through declared optics and
  witness-bearing admissions;
- reproducible incident reports containing evidence ledgers instead of
  screenshots and informal reconstruction.

Continuum apps should work together when they share profiles, not because they
share internals.

Continuum follows the best protocol precedent: define the facts that must cross
implementation boundaries, then let implementations remain free inside their
own kernels. The web did this for documents, Git did this for portable history,
Debug Adapter Protocol did this for debugger/tool boundaries, Trace Context did
this for trace propagation, and CloudEvents did this for event envelopes.
Continuum applies the same move to witnessed causal history.

## Research Anchors

Continuum has no exact precedent. These precedents are useful for protocol
discipline, not for direct ontology:

- [Lamport clocks](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)
  show why distributed systems need explicit ordering relations instead of
  ambient wall-clock truth.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/) shows that trace
  identity propagation can be standardized without standardizing every backend.
- [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
  separate portable signal semantics from backend implementation.
- [CloudEvents](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)
  shows the value of a common envelope for event interop.
- [W3C PROV-DM](https://www.w3.org/TR/prov-dm/) makes provenance facts
  explicit instead of burying them in prose.
- [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/),
  [DID Core](https://www.w3.org/TR/did-core/), and
  [UCAN](https://ucan.xyz/) show separable claim, identity, presentation, and
  capability patterns.
- [GraphQL](https://spec.graphql.org/October2021/) is the authored schema root
  used by Continuum contract families.
- [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/)
  separates debug tools from debugger implementations through protocol
  boundaries.
- [ActivityPub](https://www.w3.org/TR/activitypub/) is a federation precedent:
  independently hosted participants share message semantics.
- [Git](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
  proves the product value of portable history and local autonomy.
- [IPLD](https://ipld.io/docs/) is a content-addressing precedent for bundles,
  witnesses, law artifacts, and retained readings.
- [WebAssembly Component Model](https://component-model.bytecodealliance.org/)
  shows how language-neutral component boundaries can exist without becoming
  the whole protocol.
- [Model Context Protocol tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
  show the value of structured, discoverable agent surfaces.
- [CRDT literature](https://crdt.tech/papers.html) is an important contrast:
  CRDTs converge specific replicated data types, while Continuum exchanges
  witnessed causal suffixes and admits, stages, pluralizes, conflicts, or
  obstructs them under explicit law.

## Core Doctrine Expanded

### History Is The Territory

Continuum's deepest claim is that state is not truth. State is a reading.

```text
State is a policy-relative materialized view over witnessed causal history.
The graph is a coordinate chart over witnessed causal history.
Files are observer-relative materializations.
Receipts and witnesses are boundary evidence.
```

The protocol boundary should carry causal claims, not merely values.

### Host Time Is Not Admitted History Time

A message arriving at a process, socket, Git remote, WARP DRIVE mount, HTTP
endpoint, local CLI, or MCP tool is not the same thing as the receiving runtime
admitting that message into causal history.

Continuum distinguishes:

```text
host-time arrival
host-time buffering
inspection
staging
translated compatibility evidence
admission
canonical visibility
retention
promotion
```

Admission requires a runtime-owned outcome at a declared basis or frontier,
under named law or policy, with evidence posture and residuals preserved.

### Admission Against A Bounded Basis

At the Continuum boundary, an admission claim means:

```text
A proposed intent, import, observation, branch, law, optic, or promotion was
judged against a bounded basis under explicit law and produced a witnessed
outcome.
```

Core outcomes:

- `Derived`: a single lawful result was admitted.
- `Plural`: multiple legitimate outcomes remain; plurality must not be silently
  collapsed.
- `Conflict`: admission encountered a conflict with an explicit conflict
  artifact.
- `Obstruction`: admission was refused or blocked with an obstruction witness.

### Observation Is Revelation Only

Observation, replay, and inspection do not create new causal truth. A reading
may be cached, retained, exported, materialized as files, rendered in UI, or fed
to an agent. It remains a reading.

Debugger-created counterfactuals are explicit scratch lanes rooted at exact
bases. Only a separate admitted promotion operation may move a result into
shared admitted history.

### Witness Ladder

Continuum evidence should not collapse into one undifferentiated receipt blob.

The protocol should preserve at least three separable layers:

1. **Reintegration core:** seam and compatibility facts needed to explain how a
   result relates to surrounding causal history.
2. **Witness core:** the minimal proof-bearing claim that admission,
   observation, obstruction, settlement, import, export, or publication occurred
   under a named basis, law, and profile.
3. **Receipt shell:** the transport, debug, or operator envelope that lets tools
   route, inspect, retain, redact, and explain the claim.

These layers may reference each other. They must not collapse into one blob. A
receipt shell is not automatically native witness evidence. A translated
compatibility artifact is not Continuum-native proof.

## Semantic Verbs And Profile Operations

Continuum should define a small set of semantic verbs at the doctrine level and
a separate set of profile operations at the profile level.

### Semantic Verbs

```text
ADMIT       judge and incorporate a causal claim under law
WITNESS     produce evidence for a causal claim
SETTLE      decide how incoming claims relate to local history
OBSERVE     emit a lawful reading from a basis
OBSTRUCT    refuse or block with explicit reason and evidence
REDACT      preserve hidden evidence posture without revealing hidden payloads
REPLAY      traverse retained or reconstructible history
FORK        create a scratch or counterfactual lane from a basis
PROMOTE     request canonical admission of a branch result
REVOKE      withdraw or narrow law, optic, or capability authority
EXPORT      package a witnessed suffix
IMPORT      ask a runtime to admit, stage, conflict, or obstruct a suffix
```

### Profile Operations

```text
hello()
listContractFamilies()
observe(request)
exportSuffix(request)
importSuffix(bundle, request)
openDebugSession(request)
runCounterfactual(request)
publishLawBundle(request)
admitLawBundle(request)
mountReadingProfile(request)
proposeAction(request)
```

The semantic verbs explain meaning. The profile operations expose behavior.

## Shared Vocabulary

The vocabulary should be small enough to learn and strict enough to block
shadow contracts.

### Participant

Anything that speaks at least one Continuum profile.

### Runtime

A participant that owns admission for at least one causal lane or history domain
and can publish runtime-owned outcomes according to Continuum profiles.

A full runtime can publish, admit, observe, export, and import witnessed causal
history for its advertised profile set. A participant that only observes,
adapts, debugs, mounts, compiles, or tests is not a runtime.

### App

A product surface that submits intents, observes readings, publishes artifacts,
or composes with runtimes through Continuum profiles.

### Contract Family

A named semantic family authored as GraphQL SDL and governed by Continuum or an
app/domain owner. Wesley may compile it. Runtimes and tools may emit or consume
conforming values.

### Profile

A behavioral conformance bundle that names required families, messages,
capabilities, obstruction behavior, bindings, and witnesses.

A profile is not a contract family. A profile may use several families. A
family may appear in several profiles.

Example: `continuum.observation.v1` is a profile. It may require
runtime-boundary family nouns such as `ObserverPlan`, `ObservationRequest`, and
`ReadingEnvelope`. The runtime-boundary family is not itself the observation
profile. A runtime may compile the family but still fail the profile if it
cannot preserve rights, residuals, obstruction behavior, and evidence posture.

### Generated Artifact

A compiler output derived from a contract family. Generated artifacts are
evidence and integration surfaces, not semantic owners.

### Intent

A proposed action from a human, agent, app, adapter, or runtime. An intent is
not admitted work until a runtime admits it under law.

### Intent Envelope

The shared set-side carrier for operation identity, payload identity, target
lane, basis, capability posture, and witness posture.

### Admission Law

The named rule or policy that determines whether an intent, import, optic,
branch, law publication, or promotion can proceed from a basis.

### Tick

A runtime-owned logical commit boundary. Ticks are not wall-clock time.

### Lane

A causal track where admitted history accumulates. Profiles should avoid
assuming one runtime's internal lane implementation.

### Worldline

A lane with canonical or admitted status in a given runtime/context.

### Strand

A speculative, fork-relative, or scratch lane with explicit provenance.

### Braid

A plural compositional object over multiple lanes, strands, worldlines, and
their alignments. Braid is useful theory and UX language, but it should not be a
v0.1 implementer requirement unless a profile explicitly names it.

### Coordinate

A runtime-meaningful reference to a point, frontier, basis, or range in causal
history. Coordinates are portable only through declared profile semantics and
witnesses.

### Frontier

The known boundary of a lane or set of lanes at which an operation,
observation, suffix export, import, or branch is based.

### Witnessed Suffix

The export/import unit for a portion of causal history. A witnessed suffix is
not a snapshot.

### Settlement

The process that decides how incoming causal claims relate to local history:
admitted, staged, plural, conflicting, obstructed, rejected, already
adjudicated, self-echo, alternate support path, or another explicit outcome.

### Receipt

Machine-checkable evidence for an admitted operation, rejected operation,
delivery observation, import, export, observation, law event, or other protocol
event.

### Witness

Evidence that a claim was made, checked, admitted, observed, retained, denied,
redacted, revoked, or obstructed at a coordinate under a named profile or law.

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
basis. An optic must be compiled, admitted, scoped, and witnessed before it can
become trusted runtime interaction.

### Law Bundle

A published artifact describing admission, observation, rewrite, settlement, or
optic behavior. Runtime policy decides whether and where it is admitted.

### Capability

A scoped grant or presentation that permits a caller to use a profile, observe
a lane, export a suffix, import a bundle, run a counterfactual, request debug
access, admit a law, or promote a branch.

### Evidence Posture Structure

A structured description of origin, proof strength, access, completeness,
native witnesshood, redaction, obstruction, and credential requirements.

### Counterfactual Branch

A non-canonical lane created to ask "what would have happened if..." from a
basis. Promotion is a separate admitted operation.

### Warpspace

A local or shared project constellation manifest naming apps, runtimes,
contract families, generated roots, capability profiles, stack compatibility
claims, and lockfile witnesses.

### WARP DRIVE Mount

A POSIX-shaped membrane over Continuum readings. Reads are observations. Writes
are intents. Paths are observer-relative coordinates, not causal ontology.

## Protocol Suite Shape

Continuum should be neither "just docs" nor "one API server."

The right shape:

1. **Semantic layer:** GraphQL-authored contract families and vocabulary.
2. **Message layer:** versioned envelopes and payload families.
3. **Profile layer:** behavioral conformance bundles.
4. **Binding layer:** HTTP, stdio, MCP, CLI JSON/JSONL, file bundle, Git remote,
   WASM component, runtime-local API.
5. **Witness layer:** fixture witnesses, runtime witnesses, interop witnesses,
   evidence ledgers, conformance reports.

GraphQL SDL is Continuum's current authoring substrate for shared contract
families. It is not automatically the wire protocol. Bindings may serialize
payloads through JSON, JSONL, CBOR, file bundles, Git-carried bundles, stdio,
HTTP, MCP, WASM components, or in-process calls as long as they preserve the
profile semantics and witnesses.

No binding is the protocol. A runtime may expose local stdio while another
exposes HTTP. They are compatible only if they speak the same profile semantics
and produce comparable witnesses.

## Envelope Design

The protocol should split its envelope model before every message is forced to
carry every possible field.

### Base Message Envelope

```graphql
type ContinuumMessageEnvelope {
  continuumVersion: String!
  profile: String!
  messageType: String!
  messageId: ID!
  source: ParticipantRef!
  target: ParticipantRef
  contractFamilies: [ContractFamilyRef!]!
  payloadDigest: DigestRef
  payloadCodec: CodecRef
}
```

Purpose:

- route without understanding app payloads;
- preserve profile and schema version truth;
- verify payload identity;
- identify participants;
- avoid prose scraping.

### Causal Envelope

```graphql
type ContinuumCausalEnvelope {
  basis: CausalBasis!
  evidence: [EvidenceRef!]!
  capability: CapabilityPresentationRef
  redaction: RedactionPosture
  residual: ResidualPosture
}
```

Purpose:

- attach a basis or frontier;
- carry witness references;
- declare capability posture;
- preserve redaction and residual facts.

Not every message has a causal envelope. `participant.hello` may be
descriptor-only.

### Audit Metadata

```graphql
type ContinuumAuditMetadata {
  claimedCreatedAt: String
  receivedAt: String
  transportBinding: String
  hostClockRef: String
}
```

Wall-clock time is audit metadata, not causal truth.

### Evidence Posture

Evidence posture should be structured, not a single enum.

```graphql
type EvidencePosture {
  origin: EvidenceOrigin!
  proofStrength: EvidenceProofStrength!
  access: EvidenceAccessPosture!
  completeness: EvidenceCompleteness!
  nativeContinuumWitness: Boolean!
  witnessRef: String
  obstructionReason: ObstructionReason
  redaction: RedactionPosture
  credentialRequirement: CredentialRequirement
}

enum EvidenceOrigin {
  CONTINUUM_NATIVE
  TRANSLATED_SUBSTRATE
  FIXTURE
  DESCRIPTOR
  SYNTHETIC
}

enum EvidenceProofStrength {
  WITNESSED
  DIGEST_ONLY
  CLAIMED
  NONE
}

enum EvidenceAccessPosture {
  AVAILABLE
  REDACTED
  CREDENTIAL_REQUIRED
  DENIED
}

enum EvidenceCompleteness {
  COMPLETE
  PARTIAL
  RESIDUAL
  UNSUPPORTED
  OBSTRUCTED
}
```

This permits combinations such as:

```text
translated + redacted
native + partial
fixture + unsupported
descriptor-only + credential-required
```

Continuum should not collapse these into ambiguous status strings.

## Required Core Profiles

### `continuum.participant.hello.v1`

Purpose:

- discover any Continuum participant.

This replaces the narrower `continuum.runtime.hello.v1` framing.
Any prior `runtime.hello` framing is superseded by
`continuum.participant.hello.v1` for normative Continuum discovery.

Answers:

- what participant is this?
- is it a runtime, app, debugger, observer, membrane, compiler, agent host,
  warpspace, adapter, or fixture?
- which Continuum versions does it speak?
- which profiles does it support?
- which contract families does it publish or consume?
- which evidence is native, translated, fixture-only, descriptor-only,
  unsupported, obstructed, redacted, or credential-required?
- how can callers connect?
- what credentials or local authority are required for each profile?
- what is intentionally hidden until authorization?

Minimum nouns:

```text
ParticipantDescriptor
ParticipantRef
ParticipantKind
ConnectionHint
CapabilityProfile
EvidencePosture
AuthPosture
RedactionPosture
ProfileSupport
```

Availability:

- should be available to unauthenticated local discovery with redaction;
- may require credentials for network endpoints or private metadata;
- must never expose lane contents by default.

### `continuum.contract.index.v1`

Purpose:

- list contract families and generated artifacts.

Answers:

- which families are authored?
- which families are consumed or emitted?
- who owns semantic source?
- which schema digests are supported?
- which generated roots exist?
- which fixtures, runtime witnesses, and interop witnesses exist?
- which claims are still open cuts?

Minimum nouns:

```text
ContractFamilyDescriptor
SchemaDigest
GeneratedArtifactRef
CompatibilityClaim
ConformanceWitnessRef
ProfileFamilyRequirement
```

### `continuum.observation.v1`

Purpose:

- request lawful readings and return evidence-bearing readings.

Requires:

- read capability for lane, aperture, and basis;
- declared observer plan or accepted ad hoc observer profile;
- residual, redaction, and budget preservation.

Minimum nouns:

```text
ObserverPlan
ObservationRequest
ReadingEnvelope
ReadingPayloadRef
ObservationObstruction
ResidualPosture
```

### `continuum.history.exchange.v1`

Purpose:

- export/import witnessed suffixes and run settlement.

Requires:

- export authority on source;
- admission/import authority on target;
- live witness before claiming interop.

Minimum nouns:

```text
WorldlineDescriptor
CausalCoordinate
Frontier
WitnessedSuffixShell
CausalSuffixBundle
ImportRequest
SettlementPlan
ImportOutcome
ImportObstruction
```

## Optional Profiles

### `continuum.debug.v1`

Purpose:

- let WARP TTD and other debuggers inspect causal history without app-specific
  knowledge.

Capabilities:

- list lanes and available coordinates;
- seek to coordinate;
- replay forward/backward where evidence permits;
- query receipts, effects, admissions, obstructions, and readings;
- set causal breakpoints;
- expose debugger facts as structured JSON;
- export evidence ledgers and reports.

Credential rule:

```text
Debug access is never authority-free by default.
Read-only debug may be allowed by local demo targets, but private history,
sensitive lanes, payload access, import, mutation, law admission, and promotion
must be capability-gated.
```

### `continuum.counterfactual.v1`

Purpose:

- create scratch branches, run alternate histories, compare outcomes, and
  explain divergence.

Requires:

- replayable evidence for the chosen basis;
- authority to allocate scratch resources;
- explicit promotion for canonical admission.

Minimum nouns:

```text
CounterfactualBranchRequest
CounterfactualIntentSet
ReplayRequest
BranchComparisonRequest
DivergenceReport
PromotionRequest
PromotionOutcome
CounterfactualObstruction
```

### `continuum.law.optic.v1`

Purpose:

- publish compiled law/optic artifacts and request runtime admission.

This profile should be designed in V1 but not rushed into implementation until
runtime authority boundaries are real.

Minimum nouns:

```text
LawBundleDescriptor
OpticRequirementRef
LawAdmissionRequest
LawAdmissionOutcome
LawScope
LawRevocation
LawObstruction
```

Rule:

```text
Continuum names the artifact, digest, capability shape, profile, and outcome
vocabulary. Runtime/host authority admits, stages, obstructs, rejects, scopes,
revokes, or expires it.
```

### `continuum.warpspace.v1`

Purpose:

- describe local app constellations.

Minimum nouns:

```text
WarpspaceManifest
AppDescriptor
RuntimeTargetRef
ContractDependency
GeneratedRoot
ProfileRequirement
LockfileWitness
StackTupleRef
```

### `continuum.agent.v1`

Purpose:

- give agents a stable way to discover, inspect, propose, rehearse, and act
  without scraping human UI.

Minimum nouns:

```text
AgentToolDescriptor
AgentResourceDescriptor
InspectableFact
ActionProposal
RehearsalOutcome
AgentReceipt
AgentObstructionWitness
```

Agent surfaces should prefer:

- CLI `--json`;
- JSONL streams;
- MCP tools/resources;
- generated TypeScript/Rust clients;
- deterministic witness files;
- conformance fixtures;
- machine-readable obstruction reasons.

### `continuum.warp-drive.v1`

Purpose:

- mount Continuum readings through a POSIX-shaped membrane.

Rule:

```text
WARP DRIVE mounts readings, not substrate truth.
```

Mapping:

```text
read file     -> ObservationRequest
file bytes    -> ReadingPayload
write file    -> IntentEnvelope
save result   -> TickResult | Obstruction
path          -> observer-relative coordinate
mount         -> profile descriptor + capability posture
stat metadata -> evidence posture + basis/frontier/digest
```

WARP DRIVE must not pull POSIX semantics into Continuum core. Paths are
convenience projections, not causal ontology.

### Breakpoints

Do not make `continuum.breakpoint.v1` a required early profile. Breakpoints are
debug predicates until proven otherwise.

Breakpoints remain part of `continuum.debug.v1` until at least two independent
debugger/runtime implementations require a standalone breakpoint profile.

Causal breakpoint classes:

- admission breakpoint;
- receipt breakpoint;
- effect emission breakpoint;
- observer reading breakpoint;
- law obstruction breakpoint;
- capability denial breakpoint;
- frontier crossing breakpoint;
- counterfactual divergence breakpoint.

Traditional breakpoints bind to code locations. Continuum breakpoints bind to
causal facts.

## Existing Family Alignment

V1 should refine the existing family spine, not create greenfield parallel
nouns.

| Profile | Likely existing or related families | Notes |
| --- | --- | --- |
| `continuum.participant.hello.v1` | new discovery family or runtime-boundary extension | Must use `ParticipantDescriptor`, not `RuntimeDescriptor` only. |
| `continuum.contract.index.v1` | contract-family registry metadata | Should expose family/profile rows and open cuts. |
| `continuum.observation.v1` | runtime-boundary family | Reuse `ObserverPlan`, `ObservationRequest`, and `ReadingEnvelope`. |
| `continuum.history.exchange.v1` | runtime-boundary, settlement, and receipt families | Reuse `WitnessedSuffixShell`, `CausalSuffixBundle`, and `ImportOutcome`. |
| `continuum.debug.v1` | WARP TTD protocol, observation, receipt, and settlement families | Debug composes profiles; it must not normalize by hand. |
| `continuum.counterfactual.v1` | runtime-boundary, debug, and settlement families | Branch posture needs explicit basis and promotion semantics. |
| `continuum.law.optic.v1` | Wesley directives/artifacts plus new admission profile | Design only until the authority model is real. |
| `continuum.warp-drive.v1` | observation, intent/tick, and evidence posture | POSIX paths are projections. |

## Conformance Tiers

Continuum should not make every participant support everything. Capability gaps
should be explicit.

### Tier 0: Descriptor Only

Required:

- `continuum.participant.hello.v1`

Useful for:

- discovery;
- obstruction clarity;
- migration planning.

### Tier 1: Contract-Shaped

Required:

- Tier 0;
- `continuum.contract.index.v1`.

Useful for:

- generated clients;
- conformance planning;
- avoiding shadow schemas.

### Tier 2: Observable / Inspectable

Required:

- Tier 1;
- `continuum.observation.v1`.

Useful for:

- WARP TTD read-only attach;
- agents;
- dashboards;
- Graft-style structural observers.

### Tier 3: History-Exchange Capable

Required:

- Tier 2;
- `continuum.history.exchange.v1`.

Useful for:

- Echo/`git-warp` interop;
- WARP DRIVE lane sharing;
- third-party runtime migration.

### Tier 4: Debuggable

Required:

- Tier 2;
- `continuum.debug.v1`;
- enough retained or replayable evidence for advertised debug operations.

Useful for:

- WARP TTD generic attach;
- reproducible issue reports;
- agent investigation.

### Tier 5: Counterfactual-Debuggable

Required:

- Tier 4;
- `continuum.counterfactual.v1`.

Useful for:

- "what if this intent had been admitted?";
- branch comparison;
- design-space exploration;
- causal root-cause analysis.

### Tier 6: Law/Optic Participant

Required:

- Tier 1;
- `continuum.law.optic.v1`;
- runtime policy/authority integration.

Useful for:

- bounded autonomous agents;
- third-party app extension;
- lawful app composition.

## WARP TTD Semantics

WARP TTD should be framed as causal admission debugging, not just execution
trace replay.

Normal debugging asks:

```text
what is memory now?
what line runs next?
what variable changed?
```

Traditional time-travel debugging adds:

```text
what was true before?
can I replay the execution trace?
```

WARP TTD should ask:

```text
what was admitted?
from which basis?
under what law?
with which witness?
what was observed?
what remained plural, conflicted, or obstructed?
what would have happened if this intent, import, law, or capability changed?
which branch first diverged?
can I export a replayable evidence ledger for this claim?
```

### Inspectable vs Debuggable vs Counterfactual-Debuggable

- **Inspectable:** supports observation and reading envelopes. No replay
  guarantee.
- **Debuggable:** supports replay, seek, and step semantics over retained or
  reconstructible evidence.
- **Counterfactual-debuggable:** supports scratch branch creation, alternate
  runs, divergence reports, and explicit promotion requests.

### Credentials

WARP TTD is not a privileged bypass.

Debug access requires whatever authority is needed for the target, lane, basis,
payload, observer, replay, branch, or promotion operation.

Local demos may allow anonymous inspection. Private targets are
capability-gated. Payload access may require stronger credentials than
witness/digest access. Mutation, import, law, and promotion must go through
admitted intents, not debugger back doors.

## WARP DRIVE Semantics

WARP DRIVE is a Continuum app/profile, not Continuum core.

It is best understood as:

```text
A POSIX-shaped membrane over Continuum history.
```

Its doctrine:

```text
reads are observations;
writes are intents;
paths are observer-relative coordinates;
file bytes are readings;
saves produce tick results or obstructions;
mount metadata carries evidence posture;
WARP TTD attaches to the underlying target, not to a fake filesystem truth.
```

This lets normal tools operate on files while preserving the deeper truth that
files are materializations, not substrate truth.

## Wesley, Optics, And Law Admission

Continuum should not mean "any Wesley optic may run anywhere."

The safe chain:

1. A contract family or optic is authored.
2. Wesley compiles deterministic artifacts and manifests.
3. Continuum names the artifact family, digest, required capability, law
   identity, profile, and outcome vocabulary.
4. A runtime/host authority admits, scopes, stages, obstructs, rejects, revokes,
   or expires the artifact.
5. The result carries evidence posture.
6. Calls through the admitted artifact produce receipts, readings, tick results,
   or obstructions.

### Affect vs Reintegration Boundary

A useful distinction:

```text
Affect boundary:
  what the computation may read, write, create, delete, observe, or change.

Reintegration boundary:
  what must be true for the result to be admitted back into surrounding causal
  history.
```

Wesley helps compile the affect boundary into generated access surfaces.
Continuum should preserve the reintegration/admission story in protocol
evidence.

## Agent Autonomy Under Lawful Bounded Optics

Continuum should let agents become more autonomous without becoming ambiently
powerful.

Autonomy chain:

1. Agent discovers a participant and profile set.
2. Agent inspects contract families and conformance claims.
3. Agent selects or requests an observer/optic.
4. Wesley compiles or identifies the artifact.
5. Runtime authority admits, scopes, or obstructs the artifact.
6. Agent receives a capability-bound handle.
7. Agent observes, rehearses, proposes, or imports through that handle.
8. Runtime admits actual mutations separately.
9. Every step emits receipts or obstructions.

### Agent Obstruction Witnesses

For agents, obstruction is not just an error string. It is a machine-readable
causal teaching artifact.

An obstruction should identify:

- requested profile;
- basis/frontier;
- missing capability;
- violated footprint;
- denied observer aperture;
- unsupported family/version;
- law or policy identity;
- residual/conflict posture;
- whether rehearsal, narrower observation, or authority request is possible.

This lets agents learn from boundaries instead of repeating invalid requests.

## Product Design Angle

Continuum's product value is that compatible causal contracts are inspectable.

For humans:

- WARP TTD shows available targets without app-specific setup;
- targets explain whether debugging is available, partial, denied, redacted, or
  impossible;
- WARP DRIVE can mount a lane without caring whether Echo, `git-warp`, or a
  third-party runtime is behind it;
- jedit can expose editing history to debugging, structural reads, and
  filesystem membranes;
- Graft can contribute structural readings without becoming a runtime;
- runtime interop is a conformance ladder, not folklore.

For maintainers:

- new shared nouns go through Continuum;
- runtime-local internals stay local;
- generated artifacts trace back to authored families;
- open compatibility cuts remain visible until witnessed.

### Developer Command Surface

```bash
warp init      # bootstrap a WARPspace from a tested stack tuple
warp build     # compile families through Wesley
warp doctor    # check families, profiles, codecs, credentials, evidence
warp observe   # request a reading
warp export    # export a witnessed suffix
warp import    # import a suffix bundle
warp debug     # open WARP TTD against a compatible target
warp mount     # mount a WARP DRIVE profile
warp prove     # run profile conformance/witness checks
```

`warp doctor` should say exactly which profile, family, credential, codec,
witness, or interop cut is missing.

Example output:

```text
$ warp doctor --target echo://local/dev
Target
  participant: echo://local/dev
  kind: runtime
  continuum: 0.1.0
Profiles
  [pass] continuum.participant.hello.v1 descriptor witnessed
  [pass] continuum.contract.index.v1    fixture witnessed
  [pass] continuum.observation.v1       runtime witnessed
  [warn] continuum.history.exchange.v1  export fixture only; no live import
  [fail] continuum.debug.v1             not advertised
  [fail] continuum.counterfactual.v1    not advertised
  [fail] continuum.law.optic.v1         design-only
Evidence
  native witness:      available for observation
  translated evidence: none
  redacted fields:     payload bodies
  credential required: payload.read, suffix.export
Open cuts
  - no live Echo to git-warp import witness
  - no replay evidence for debug profile
```

### Conformance Report Shape

A conformance report should be structured enough for humans, agents, CI, and
review tools to consume without parsing prose.

```json
{
  "participant": "echo://local/dev",
  "kind": "runtime",
  "continuumVersion": "0.1.0",
  "profiles": [
    {
      "profile": "continuum.participant.hello.v1",
      "status": "witnessed",
      "evidence": "descriptor"
    },
    {
      "profile": "continuum.observation.v1",
      "status": "witnessed",
      "evidence": "runtime"
    },
    {
      "profile": "continuum.history.exchange.v1",
      "status": "partial",
      "evidence": "export-fixture",
      "openCuts": ["no-live-import-witness"]
    }
  ],
  "credentialRequirements": ["payload.read", "suffix.export"],
  "redactions": ["payload bodies"],
  "openCuts": [
    "no live Echo to git-warp import witness",
    "no replay evidence for debug profile"
  ]
}
```

## Operating System Design Angle

Continuum should feel like an operating-system ABI for causal computing.

Analogy:

```text
process          -> participant/runtime
file descriptor  -> scoped capability handle
syscall          -> profile operation
filesystem mount -> Warpspace or WARP DRIVE projection
scheduler        -> runtime-owned machinery
trace            -> witnessed causal history
debugger attach  -> capability-gated observation/debug profile
driver           -> binding or adapter
kernel boundary  -> admission law
fork             -> counterfactual branch
commit           -> admitted tick/result
```

The OS analogy keeps authority honest. An app can request work. It cannot
directly tick the runtime, rewrite canonical history, or read secret lanes
simply because it has a UI.

## Networked Causality Design Angle

Continuum is a network protocol for partial orders, not just events.

Network facts:

- lanes/coordinates instead of one global clock;
- frontiers instead of "latest state";
- suffixes instead of snapshots;
- admission/settlement instead of blind merge;
- witnesses instead of logs as prose;
- native/translated evidence distinction instead of fake equivalence;
- plural outcomes instead of forced collapse;
- content addressing for bundles, witnesses, and artifacts;
- capabilities/redaction as first-class facts.

This is why trace propagation, event envelopes, provenance models, content
addressing, and CRDTs are useful precedents but insufficient alone.

## User Experience Design Angle

Users should not have to learn protocol internals to get value.

The UX loop:

1. Tool discovers targets.
2. User sees which targets are observable, debuggable, exchange-capable,
   counterfactual-capable, or descriptor-only.
3. User attaches to a target.
4. Tool shows lanes, coordinates, receipts, effects, readings, obstructions,
   and evidence posture.
5. User can seek, replay, inspect, fork, compare, export, or request promotion
   when supported.
6. Failures explain the exact missing profile, credential, witness, family, or
   permission.

The interface may look like a normal debugger:

```text
attach
choose target
set breakpoint
step
inspect
evaluate
export report
```

The semantics become causal, evidence-bearing, and cross-runtime.

## Agent Experience Design Angle

Agents should treat Continuum as a structured interface, not a UI.

Requirements:

- discover targets through `participant.hello`;
- inspect contract families and profile support;
- request readings with explicit basis/aperture;
- receive machine-readable obstruction reasons;
- propose intents rather than mutate host state;
- rehearse counterfactuals before requesting admission;
- compare branches through divergence reports;
- export evidence ledgers;
- cite witnesses in issues, PRs, design docs, and incident reports.

If an agent must scrape terminal pixels or parse human prose to know what a
runtime supports, the Continuum surface is incomplete.

## Use Cases

### Generic Debugger Attach

A third-party runtime implements Tier 2 and Tier 4. WARP TTD discovers it,
shows the advertised debug profile, requests observation/replay access, and
debugs without app-specific code.

### Echo And `git-warp` Suffix Exchange

Echo exports a witnessed suffix. `git-warp` imports it through settlement. The
import outcome records what was admitted, staged, plural, conflicting,
obstructed, or already adjudicated. Neither runtime adopts the other's storage
format.

### WARP DRIVE Mount Over Any Runtime

WARP DRIVE asks for file-like readings. Saves become intents. The same user
workflow can target Echo, `git-warp`, or a future Continuum runtime.

### jedit Plus Graft Plus WARP TTD

jedit edits through Echo. Graft contributes structural readings. WARP TTD
debugs edit history and branch divergence. Integration happens through
readings, witnesses, and contract families rather than bespoke side channels.

### Third-Party Runtime Certification

A vendor ships a runtime that passes Tier 0 through Tier 3. It can exchange
history and be observed but does not claim debug/counterfactual/law support
until it has witnesses.

### Lawful Agent Investigation

An agent attaches through MCP, receives participant descriptors, requests
readings, sets causal breakpoints, runs a counterfactual branch, compares
outcomes, and posts an evidence ledger to a GitHub issue.

### Reproducible Incident Report

An operator exports a Continuum evidence ledger containing coordinates,
suffixes, readings, witnesses, debug notes, and obstructions. A reviewer imports
the report into a fixture runtime or WARP TTD playback mode and reproduces the
causal path.

### Collaborative Design / Narrative Braid

Multiple authors work on branching narrative strands. Conflicts are not
overwritten; they become plural braids until admitted settlement chooses,
preserves, or obstructs. WARP TTD can inspect how a canonical worldline emerged.

## Repo Roles And Candidate Projects

### Continuum

Semantic owner, protocol suite, contract-family registry, evidence posture,
conformance posture, shared vocabulary, compatibility truth.

Must not become a runtime, database, scheduler, debugger UI, or app framework.

### Wesley

Compiler, manifest, codec, validator, generated artifact, witness tooling,
drift watch, and profile fixture machinery.

Must not become semantic owner for Continuum shared families.

### Echo

Sibling Continuum runtime implementation, likely hot/interactive posture.
Runtime-owned admission, scheduling, ticks, receipts, readings, suffix
transport.

Must not become the only real Continuum runtime.

### `git-warp`

Sibling Continuum runtime implementation with Git-backed deployment posture. It
should consume/export suffix bundles and eventually publish native evidence when
it actually supports Continuum-native witnesshood.

Until then, translated evidence must be labeled translated.

### WARP TTD

Debugger/operator surface over Continuum profiles. It should consume discovery,
observation, debug, counterfactual, receipt, settlement, and evidence profiles.

Must not become the normalization point for incompatible host stories.

### WARP DRIVE

POSIX-shaped membrane over readings/intents. It should be a profile/app, not
Continuum core.

### Graft

Structural observer/review engine. It should consume observer plans, reading
envelopes, and evidence posture, then emit structural readings with honest
source evidence.

Must not launder structural readings into native Continuum witnesshood unless
relaying real native evidence.

### jedit

First serious product-pressure Continuum app. Edits submit intents.
History/debug/structural/file surfaces compose through profiles.

### Think

Agent/session/history app candidate. Think should use observation, agent,
counterfactual, and evidence-ledger profiles for shared behavior. Think domain
nouns remain Think-local unless multiple projects need them.

### Bijou

Rendered UI/TUI candidate. Bijou matters when a Continuum task has rendered or
TUI implications. It should consume reading envelopes and produce intents where
appropriate rather than directly depending on runtime-local state.

### AION

Theory source and conceptual background. Useful for Chronos, Kairos, Aion, and
braid theory. Do not force all theory into the v0.1 protocol surface.

## What To Build First

### Cut 1: `continuum.participant.hello.v1`

Add discovery nouns and fixture.

Proof:

- descriptor-only participant fixture;
- generated artifact witness;
- WARP TTD target discovery consumer fixture;
- one redacted/credential-required example.

### Cut 2: Evidence Posture Vocabulary

Add structured evidence posture.

Proof:

- native fixture;
- translated fixture;
- descriptor-only fixture;
- redacted fixture;
- obstruction fixture.

### Cut 3: Contract Index Profile

Make families/profile support machine-readable.

Proof:

- Continuum family index fixture;
- Wesley generated artifact refs;
- open cut reporting.

### Cut 4: Observation Profile Fixture

Prove one `ObservationRequest -> ReadingEnvelope` path.

Proof:

- fixture runtime;
- WARP TTD read-only attach fixture;
- Graft-style structural observer example.

### Cut 5: Suffix Exchange Witness Plan

Define exact witness required for Echo/`git-warp` interop.

Proof:

- export bundle fixture;
- import outcome fixture;
- settlement obstruction fixture;
- translated-vs-native evidence example.

### Cut 6: WARP DRIVE Profile Packet

Define file-like readings and intents without pulling POSIX into core.

Proof:

- mount descriptor fixture;
- read-as-observation fixture;
- write-as-intent fixture;
- redacted file evidence example.

### Cut 7: Law/Optic Admission Design Packet

Design profile but do not implement full authority model yet.

Proof:

- Wesley compiled requirement digest fixture;
- runtime obstruction fixture;
- admitted-scope example;
- revocation/expiry example.

### Cut 8: Third-Party Runtime Author Guide

Guide:

```text
implement Tier 0 first;
add contract index;
add observation;
add suffix export/import;
add debug only with replay evidence;
add counterfactual/law only with real authority/witness integration.
```

## Stack Manifest And Developer Experience

Continuum should define a tested stack tuple manifest.

Candidate:

```text
continuum-stack-release.json
```

Contains:

```json
{
  "continuum": "0.1.0",
  "profiles": {
    "continuum.participant.hello": "0.1.0",
    "continuum.contract.index": "0.1.0",
    "continuum.observation": "0.1.0"
  },
  "families": {
    "continuum.runtime-boundary": {
      "version": "0.1.0",
      "schemaDigest": "..."
    }
  },
  "tools": {
    "wesley": { "version": "...", "artifactDigest": "..." },
    "echo": { "version": "...", "evidence": "fixture|runtime|interop" },
    "warp-ttd": { "version": "..." },
    "warp-drive": { "version": "..." }
  },
  "conformance": {
    "fixtureWitnesses": [],
    "runtimeWitnesses": [],
    "interopWitnesses": [],
    "openCuts": []
  }
}
```

Principle:

```text
Use exact tested tuples for bootstrap and conformance.
Do not rely on open version ranges for causal protocol compatibility.
```

Semver is useful only after witnesses define what the compatible tuple proves.

## Open Questions For V1.1

- Should local discovery use WARPspace, a `.well-known` file, a local socket,
  or all of them as bindings?
- Which capability presentation should land first: same-user local handles,
  UCAN-like tokens, DID/VC-style presentation, or binding-specific adapters?
- Should counterfactual bundles reuse the canonical suffix shell with branch
  posture, or use a separate family?
- Which profile owns streaming: observation, debug, history exchange, or a
  transport binding?
- What evidence is sufficient to upgrade `git-warp` from translated evidence
  to Continuum-native witnesshood?
- Which existing runtime-boundary nouns should be reused directly in
  `participant.hello`, and which deserve a new family?

## Risks And Mitigations

### Over-Specification

Risk: Continuum becomes a paper architecture before the first profile is useful.

Mitigation:

- define profiles incrementally;
- require fixture, runtime, and interop witnesses;
- keep optional profiles optional;
- ship `participant.hello` first.

### Under-Specification

Risk: every repo invents local meanings for "history," "witness," "reading,"
and "import."

Mitigation:

- freeze the envelope split;
- freeze discovery/evidence posture;
- maintain registry rows and open cuts.

### Shadow Authority

Risk: Continuum appears to grant mutation, debug, law, or optic authority.

Mitigation:

- Continuum names messages and outcomes;
- runtimes and host authorities admit;
- capabilities are mandatory for sensitive profiles.

### Fake Interop

Risk: translated adapters are mislabeled native.

Mitigation:

- evidence posture is mandatory and multidimensional;
- native claims require native witnesses;
- interop claims require live suffix exchange/import witnesses.

### Envelope Overreach

Risk: every message must carry every field, so simple participants fake fields.

Mitigation:

- split message envelope, causal envelope, evidence posture, and audit metadata;
- require only profile-relevant fields.

### App Ontology Creep

Risk: every app wants its nouns in Continuum core.

Mitigation:

- app-local families remain app-local;
- promotion requires multi-project need and design packet.

### Debugger Privilege Creep

Risk: WARP TTD becomes a privileged backdoor.

Mitigation:

- debug access is capability-gated;
- mutation, import, law, and promotion go through admitted intents;
- payload access is separate from witness/digest access.

### Theory Fog

Risk: Chronos, Kairos, Aion, braid, or category-theory language prevents
implementers from seeing the protocol.

Mitigation:

- keep theory in appendices or design packets;
- v0.1 implementer docs use participant, profile, envelope, evidence, observe,
  and import language.

## Decisions For V1

### Decision 1

Continuum officially defines itself as:

```text
A protocol suite for lawful causal interoperability over witnessed causal
history.
```

### Decision 2

Use `continuum.participant.hello.v1`, not `continuum.runtime.hello.v1`, as the
first discovery profile.

Historical `runtime.hello` wording is superseded by
`continuum.participant.hello.v1` for normative Continuum discovery.

### Decision 3

Separate profiles from contract families.

### Decision 4

Split the envelope into message, causal, audit, and evidence posture
components.

### Decision 5

Make evidence posture mandatory and multidimensional.

### Decision 6

Make WARP TTD compatibility a profile/tier, not an automatic property of
Continuum compatibility.

### Decision 7

Frame WARP DRIVE as a POSIX-shaped membrane over readings/intents, not core
Continuum.

### Decision 8

Design law/optic admission, but do not implement ambient law registration
before runtime authority boundaries are real.

### Decision 9

Make counterfactuals scratch by default.

### Decision 10

Make `warp doctor` and conformance fixtures first-class product surfaces.

## Playback Questions

### Human

- [ ] Can I explain Continuum without saying it is a runtime?
- [ ] Can I tell whether a target is inspectable, debuggable,
      counterfactual-capable, or descriptor-only?
- [ ] Can I tell whether credentials are required?
- [ ] Can I explain how Echo and `git-warp` interoperate without sharing a
      database?
- [ ] Can I tell where WARP DRIVE, Wesley, Graft, jedit, and WARP TTD fit?
- [ ] Can I explain why a file is a reading and a write is an intent?

### Agent

- [ ] Can I discover a target without app-specific code?
- [ ] Can I determine supported profiles?
- [ ] Can I request readings without scraping UI?
- [ ] Can I distinguish native from translated, descriptor, and fixture
      evidence?
- [ ] Can I report exact missing profiles, credentials, witnesses, laws, or
      capabilities?
- [ ] Can I use obstruction witnesses to refine proposals?

### Runtime Author

- [ ] Can I implement Tier 0 without building a complete runtime?
- [ ] Can I add observation before history exchange?
- [ ] Can I truthfully say "not debuggable yet"?
- [ ] Can I prove native evidence rather than merely compatible shape?

## Smallest Honest Artifact

The smallest next proof is:

```text
1. continuum.participant.hello.v1 schema/profile.
2. One descriptor-only participant fixture.
3. One generated artifact witness through Wesley.
4. One WARP TTD consumer fixture that proves generic discovery.
5. One redacted/credential-required profile example.
6. One warp doctor output that reports profile/evidence status honestly.
```

No counterfactuals yet. No law registry yet. No identity-system decision yet.
No federation surface yet. The first proof is hello, profile support, evidence
posture, and one tool that can discover a target without bespoke app knowledge.

## Keeper Paragraph

Continuum is a protocol suite for lawful interoperability over witnessed causal
history.

It does not exchange state. It exchanges witnessed causal claims, lawful
readings, suffix bundles, receipts, settlements, obstructions, capabilities,
and counterfactual branches.

State is a policy-relative materialized view. The graph is a coordinate chart.
Files are readings. History is the territory.

A message arriving in host time is not admitted history. Admission is a
runtime-owned act judged against a bounded basis under explicit law, producing
a witnessed outcome: `Derived`, `Plural`, `Conflict`, or `Obstruction`.

Continuum apps compose because they share profiles: discovery, contract index,
observation, history exchange, debug, counterfactual, law/optic admission, WARP
DRIVE, Warpspace, and agent surfaces.

WARP TTD debugs causal admission, not just execution traces. WARP DRIVE mounts
readings, not substrate truth. Wesley compiles laws and optics, but runtimes
admit them. Agents operate through bounded optics and learn from obstruction
witnesses.

Continuum core stays small: vocabulary, envelopes, profiles, evidence posture,
contract-family registry, conformance witnesses, and admission semantics.
Everything else remains runtime-local, app-local, or profile-specific.

## Local Evidence Appendix

This V1 doctrine was shaped by current local project roles. These rows are
coordination evidence, not automatic compatibility claims.

| Project | Current role | Evidence posture |
| --- | --- | --- |
| Continuum | semantic owner and protocol suite | repo-local doctrine, schemas, registry, invariants, and design packets |
| Echo | sibling runtime | repo-local README and runtime doctrine; runtime witnesses still profile-specific |
| `git-warp` | expected sibling runtime | expected/open unless direct checkout and native witnesses are verified |
| Wesley | compiler and generated artifact owner | repo-local README and compiler posture; Continuum shared family semantics remain Continuum-owned |
| WARP TTD | debugger/operator surface | repo-local README and protocol posture; debug compatibility is profile-specific |
| WARP DRIVE | POSIX-shaped membrane over readings/intents | repo-local README; design-stage app/profile posture |
| Graft | structural observer | repo-local README and observer posture; structural readings are not native Continuum witnesses unless relaying native evidence |
| jedit | product-pressure app | repo-local README and Echo-hosted editing posture |
| continuum-wizard-demo | WARPspace bootstrap proof | repo-local generated-family/bootstrap evidence |
| AION | theory background | conceptual source, not implementation evidence |

Each claim should be upgraded from expected or postured to witnessed only when
repo-local evidence, fixture evidence, runtime evidence, or interop evidence
exists.

## References

Local sources:

- [Continuum README](../../../README.md)
- [Continuum contract family registry](../../contract-family-registry.md)
- [Continuum invariants](../../invariants/CONTINUUM.md)
- [0028 - Minimum Runtime Boundary Contract Family](../0028-minimum-runtime-boundary-contract-family/README.md)
- [0029 - Cross-Repo Contract Family Registry](../0029-cross-repo-contract-family-registry/README.md)
- [0030 - Continuum Spine Protocol Report](../0030-continuum-spine-protocol-report/README.md)

External anchors:

- [Lamport, Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
- [CloudEvents specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)
- [W3C PROV-DM](https://www.w3.org/TR/prov-dm/)
- [W3C Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [W3C DID Core](https://www.w3.org/TR/did-core/)
- [UCAN](https://ucan.xyz/)
- [GraphQL October 2021 Specification](https://spec.graphql.org/October2021/)
- [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/)
- [ActivityPub](https://www.w3.org/TR/activitypub/)
- [Git book: About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
- [IPLD documentation](https://ipld.io/docs/)
- [WebAssembly Component Model](https://component-model.bytecodealliance.org/)
- [Model Context Protocol tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [CRDT papers](https://crdt.tech/papers.html)

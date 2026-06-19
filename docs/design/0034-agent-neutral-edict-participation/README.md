---
title: Agent-Neutral Edict Participation
status: proposed
---

# Agent-Neutral Edict Participation

**Cycle:** 0034-agent-neutral-edict-participation
**Legend:** SOURCE
**Type:** design invariant packet
**Sponsored human:** A Continuum maintainer wants agents, apps, and humans to
share one lawful participation model instead of adding privileged agent-only
escape hatches.
**Sponsored agent:** An LLM or automation host needs to know how it can author,
register, and invoke new behavior without becoming a special runtime authority.

## Hill

Make Continuum participant design agent-neutral without making it
identity-blind, evidence-blind, or risk-blind.

Agents should be able to become powerful Continuum participants by authoring
and invoking deterministic artifacts, but they must not gain ambient authority
or hidden mutation paths. The same boundary must restrict humans, apps,
browser clients, CLIs, MCP tools, fixtures, and LLM agent hosts.

The key claim is:

**Every Continuum participant reads and writes through bounded optics,
capabilities, witnessed evidence, and runtime-owned admission. Agents are not a
special case.**

Agent-neutral does not mean equal authority for every caller. It means every
caller is evaluated by the same protocol vocabulary, evidence model,
capability calculus, admission lifecycle, and obstruction semantics.

## Context From The Compendium

The Continuum Compendium V1 already establishes the governing shape:

- a Continuum participant is anything that speaks at least one profile;
- a runtime is only the participant that owns admission for a causal domain;
- host-time arrival is not admitted history;
- observation reveals and does not author causal truth;
- intents from humans, agents, apps, adapters, or runtimes are only proposals
  until a runtime admits them under law;
- an optic is a structured read or change proposal over a bounded aperture and
  basis;
- a law bundle is an artifact that a runtime may admit, scope, stage, reject,
  narrow, defer, revoke, or expire.

This packet sharpens the spicy case: an LLM can write new Edicts, compile
them, register them dynamically with other Continuum participants, and invoke
them. That should be possible, but only by passing through the same deterministic
artifact and admission path as every other participant.

## What Edict Is

Edict is a deterministic optic and law authoring system for proposing lawful
interaction with witnessed causal history.

For a reader with no prior Edict context:

- **Edict source** is authored text for an operation, observer, rewrite,
  admission rule, or optic-shaped interaction.
- **Edict Core** is the normalized deterministic form produced by parsing,
  checking, and compiling that source.
- **Target profile** names the runtime or participant surface the compiled
  artifact intends to operate against.
- **Lawpack** names explicit target laws, capabilities, constraints, verifier
  expectations, and permitted effects.
- **Bundle subject** is the exact digest subject being referenced by
  registration, admission, or invocation.
- **Registration** asks a participant to know about an exact bundle subject.
- **Admission** asks participant policy to permit an exact bundle subject for
  some operation set, scope, bounds, and capability posture.
- **Activation** optionally publishes or mints invocable capability handles.
- **Invocation** asks to use an admitted bundle subject against an explicit
  basis, variables, capabilities, budget, and evidence posture.
- **Runtime obstruction** is reserved for a valid admitted invocation that
  cannot apply to the current target state.

Edict is not the Continuum runtime. It is not an authorization provider. It is
not an app framework. It is not an LLM prompt format. It is not a browser
sandbox by itself.

Edict is for the determinism boundary: creative systems may author behavior
above the boundary, but only compiled, digest-addressed, capability-scoped,
runtime-admitted artifacts may interact with causal truth below the boundary.

## Vocabulary Separation

Continuum must keep the following nouns separate.

### Participant

A protocol endpoint that speaks one or more Continuum profiles.

### Principal

An accountable identity to which capabilities, requests, signatures, admission
decisions, and audit evidence may be bound.

### Host

The software or hardware environment that communicates with participants,
protects keys, presents capabilities, and executes tools.

### Agent

A creative or planning subsystem that may generate source, propose actions,
interpret observations, and request host-mediated protocol operations.

### Role

The function performed in one artifact or protocol event:

- author;
- compiler operator;
- publisher;
- registrant;
- requester;
- invoker;
- capability issuer;
- admitting authority;
- observer;
- witness producer;
- reviewer.

An LLM may be recorded as an authoring agent or provenance subject, but the
protocol request is made by a participant endpoint on behalf of an accountable
principal. The model itself does not implicitly possess keys, capabilities, or
runtime authority.

This avoids the cursed question: "Which transformer checkpoint signed the
admission request?"

## Agent-Neutral Invariants

### 1. Participant Kind Does Not Grant Semantics

Continuum protocols may describe whether a caller is a human-operated CLI, app,
agent host, debugger, compiler, fixture, browser client, adapter, or runtime.
That description is evidence and routing context. It is not authority.

Participant kind is not self-authenticating authority. Participant policy may
consider authenticated or attested properties of a principal, host, execution
environment, or delegation chain when granting, restricting, or rejecting
authority. Such properties must be explicit evidence, not a self-asserted label
such as `agent`, `human`, `browser`, or `trusted app`.

Bad:

```text
caller.kind == "agent" -> allow invoke
caller.kind == "agent" -> deny everything
```

Good:

```text
attestedHostProfile
capabilityChain
principalIdentity
policyEpoch
requestedScope
basis
budget
```

The species label may be audit metadata. It is not a magic wand or a scarlet
letter.

### 2. Reads And Writes Share A Common Boundary

Reads are lawful observations. Writes are proposed intents. They share common
boundary facts, but they do not need identical wire message shapes.

Conceptual shared header:

```text
ParticipationContext {
  principal
  basis | frontier
  aperture | targetCoordinate
  profilePosture
  capabilityPresentations
  budget
  evidencePosture
  redactionPosture
  witnessReferences
}
```

Typed request variants may include:

- `ObservationRequest`;
- `IntentInvocationRequest`;
- `BundleRegistrationRequest`;
- `AdmissionRequest`;
- `LawpackPublicationRequest`;
- `TargetProfilePublicationRequest`.

A human clicking a button, an app saving a file, a browser requesting a page,
and an LLM invoking a newly authored Edict all cross the same lawful boundary.
They may cross it through different typed requests.

### 3. Admission Remains Runtime-Owned

Edict can produce a deterministic artifact. Continuum can name the artifact,
digest, profile, capability shape, and outcome vocabulary. Only the owning
runtime or host authority can admit, scope, stage, reject, narrow, defer,
revoke, or expire it for a causal domain.

No participant may convert successful compilation into admitted causal truth.
No participant may convert registration into invocation authority.

### 4. Host Time Is Not History

The following events are host-time proposals, not admitted history:

- an LLM generating Edict source;
- a browser callback firing;
- a CLI command receiving arguments;
- an MCP tool being called;
- a user pressing an approve button;
- a network message arriving;
- a local file changing.

Each may become evidence, input, or an intent. None becomes causal history until
a runtime admits it under explicit law at a bounded basis.

A retry is also host time. Whether a retry represents the same causal proposal
or a distinct causal proposal must be explicit in the invocation envelope and
profile replay policy.

### 5. Generated Source Is A Candidate Artifact

An LLM may dynamically write an Edict. That act creates an artifact candidate,
not authority. The candidate must be parsed, checked, compiled, content
addressed, registered, and admitted before it can be invoked as trusted
runtime interaction.

Any source-byte change changes the raw source artifact digest. A source-byte
change changes `releaseBundleDigest` because release identity binds exact
source provenance. `semanticBundleDigest` changes only when the normalized
executable semantics or other semantic preimage inputs change.

Registration, admission, and invocation must identify whether they bind the
semantic or release bundle subject.

### 6. Hidden State Is Forbidden Below The Boundary

Model hidden state, prompt context, browser DOM, filesystem state, network
responses, and host state may influence candidate source generation above the
determinism boundary.

They may not influence compiled operation execution below that boundary unless
materialized as explicit canonical input, witnessed evidence, an admitted basis,
or a capability presentation.

Forbidden hidden execution inputs include:

- wall-clock time;
- randomness;
- network responses;
- filesystem contents;
- browser DOM state;
- model hidden state;
- prompt context;
- closure captures;
- opaque callbacks;
- process-global mutable state;
- terminal text scraped outside an observation profile.

If any of these facts matter below the boundary, they must cross as explicit
witnessed inputs, retained readings, capabilities, or obstructions.

### 7. Determinism Is Below The Creativity Line

LLMs, humans, and apps may be creative before admission. They may propose new
operations, choose names, draft laws, search docs, or refine after obstruction.

Below the boundary, the artifact must be deterministic enough for a verifier,
runtime, or conformance harness to reproduce the same bundle subject and
understand the same permitted effect shape from the same inputs.

### 8. Registration, Admission, Activation, And Invocation Stay Separate

Registration means known. Admission means permitted. Activation means invocable
capability handles may exist. Invocation means attempted now.

The protocol must not merge those verbs.

### 9. Roles Stay Separate Even When One Process Plays Many

One LLM agent host might author source, compile it, submit a bundle, request
admission, and invoke it in one workflow. The protocol still records separate
roles so authority and evidence remain inspectable.

An author role does not imply an invoker role. A compiler operator role does
not imply admission authority. A participant endpoint can perform multiple
roles only when the relevant capability and policy evidence permits each role.

### 10. Obstruction Is Neutral But Redactable

For the same violation under the same target profile and effective authority,
the canonical obstruction class and repair category are participant-kind
neutral.

Payload fields may be redacted or withheld according to explicit evidence and
redaction policy. Redaction must be declared in the obstruction envelope and
must not change the underlying obstruction class.

Example:

```text
code: CAPABILITY_SCOPE_INSUFFICIENT
redactionApplied: true
missingCoordinates: withheld
repair:
  requestNarrowerObservation | presentAdditionalCapability
```

This preserves neutrality without turning obstruction messages into an oracle
for secret state.

### 11. Dynamic Self-Extension Is Tiered

Continuum should treat self-extension as escalating authority:

1. Invoking an already admitted operation.
2. Registering a new operation bundle.
3. Requesting admission of a new operation bundle.
4. Publishing or admitting a lawpack.
5. Publishing a target profile or verifier.
6. Changing runtime admission law.

Agents may participate in all tiers when authorized, but no tier inherits from
the previous tier by default.

Capability coordinates:

- `continuum.operation.invoke`;
- `continuum.bundle.register`;
- `continuum.bundle.request-admission`;
- `continuum.lawpack.publish`;
- `continuum.target-profile.publish`;
- `continuum.admission-policy.modify`.

No capability implies another unless delegation explicitly says so.

### 12. Continuum Does Not Own Target Semantics

Continuum should not define Edict Core, Echo DPO semantics, browser execution
semantics, or another runtime's internal law.

Continuum owns the participant protocol vocabulary: profiles, envelopes,
bundle subjects, capability posture, admission outcomes, evidence posture, and
witness requirements. Edict owns the language and deterministic artifact shape.
Each target runtime owns its admitted target law.

### 13. Adapters Must Not Launder Effects

A browser app, CLI, MCP host, or UI adapter must not mutate host state, hand
reconcile incompatible stories, and then label the result native Continuum
truth.

Adapters either emit readings with honest evidence posture or submit intents to
the admitting participant. Native witnesshood requires native witness evidence.

## Bundle Subject Binding

Every admission-related reference must identify the exact bundle subject:

```text
bundleSubject {
  kind: semantic | release
  digest: Digest
}
```

`semanticBundleDigest` identifies normalized executable semantics plus other
semantic preimage inputs.

`releaseBundleDigest` identifies exact release provenance, including source
bytes, comments, formatting, and build metadata that are part of release
identity.

Implications:

- a comment-only source change changes raw source digest;
- a comment-only source change changes `releaseBundleDigest`;
- a comment-only source change may preserve `semanticBundleDigest`;
- a semantic-subject admission may remain applicable after a comment change;
- a release-subject admission does not remain applicable after a comment
  change;
- a semantic change requires new semantic admission.

This distinction prevents Continuum from binding every invocation to release
identity when semantic identity is the intended admission subject.

## Lifecycle State Machine

The authoritative lifecycle is:

```text
CandidateSource
  -> CompiledBundle
  -> SubmittedBundle
  -> KnownBundle | RegisteredBundle
  -> AdmissionRequested
  -> Admitted | Staged | Rejected
  -> ActivatedCapability
  -> Invoked
  -> Reading | Receipt | RuntimeObstruction
  -> Revoked | Expired
```

Optional `preflight` may occur before admission. It evaluates structural
compatibility without granting admission.

Pinned verbs:

```text
submit:
  transfers or references an artifact

register:
  makes the exact bundleSubject known/cataloged to a participant
  grants no invocation authority

preflight:
  evaluates structural compatibility without admission

requestAdmission:
  asks participant policy to admit an exact bundleSubject

admit:
  issues participant-owned evidence permitting some operation set,
  scope, bounds, and capability posture

activate:
  optionally publishes or mints invocable capability handles

invoke:
  submits one operation attempt against a basis and current policy state
```

If registration emits evidence, call it `RegistrationReceipt`. Do not call it
an admission receipt.

Reserve `RuntimeObstruction` for an already valid, admitted invocation that
cannot apply to current state. Compiler failure, lowering failure, registration
failure, admission rejection, admission staging, admission deferral, and
admission narrowing are distinct outcomes.

## Invocation Envelope

This packet does not freeze the exact wire schema, but it freezes the semantic
fields an invocation must carry.

Conceptual shape:

```text
InvocationRequest {
  requestDigest
  bundleSubject
  operationCoordinate
  admissionReceiptBodyDigest | admittedCapabilityReceiptDigest
  principalProof
  basis | frontier
  canonicalVariables | variablesDigest
  capabilityPresentations
  requestedBudget
  evidencePosture
  redactionPosture
  witnessReferences
  replayPolicy
  idempotencyKey?
}
```

`requestDigest` covers the canonical invocation request. `principalProof`
binds the accountable principal and request. `operationCoordinate` identifies
the operation inside the bundle subject.

Retries and replay must be explicit:

```text
invocationAttemptDigest =
  hash(
    bundleSubject,
    operationCoordinate,
    basis,
    canonicalVariables,
    capabilityPresentationDigests,
    requestedBudget,
    evidencePosture,
    callerSuppliedIdempotencyKey
  )
```

Profiles declare:

```text
replayPolicy:
  rejectDuplicate
  | returnPriorOutcome
  | permitDistinctAttempts
```

Do not use ambient random IDs to distinguish attempts. A caller may supply an
explicit nonce or idempotency value as witnessed input.

## Effective Authority

The operation may execute only when:

```text
instantiatedRequirements(operation, basis, variables)
  subset_of intersection(
    admissionGrant,
    presentedCapabilities,
    currentParticipantPolicy,
    unrevokedCapabilityScope
  )
```

For budgets:

```text
effectiveBudget =
  minimum(
    bundleDeclaredCeiling,
    admissionGrantedCeiling,
    invocationRequestedCeiling,
    currentRuntimeCeiling
  )
```

For footprints and apertures:

```text
instantiatedFootprint
  <= bundleDeclaredFootprint
  <= admissionGrantedScope
  <= presentedCapabilityScope
```

More precisely, every inclusion must be proven in the target-owned algebra.

This is the core agent-neutral answer: a human and an agent do not necessarily
have equal authority. They are evaluated by the same authority calculus.

One-line doctrine:

```text
Lawful invocation =
  exact admitted artifact
  + explicit basis
  + canonical variables
  + sufficient presented capability
  + bounded budget
  + current participant policy
  + target-applicable state

participant kind is not in authority
```

## Delegation And Approval Evidence

A useful request may involve:

```text
human principal
  delegates editing scope to
agent host
  invokes
admitted Edict bundle
  presenting
participant-issued capability receipt
```

Continuum does not need to invent a token format here, but it should model:

- issuer;
- subject;
- audience;
- capability;
- scope;
- attenuation;
- proof chain;
- revocation reference.

A human approval click is host input, not causal truth by itself. It may
produce:

```text
host event: user clicked approve
  -> signed approval evidence
  -> admission policy evaluation
  -> admission receipt or capability receipt
  -> later invocation
```

The receipt is the protocol artifact. The click is merely how the host obtained
input.

## Discovery Snapshot Binding

Participant discovery should produce or identify:

- `participantDescriptorDigest`;
- `catalogSnapshotDigest`;
- `profileSetDigest`;
- `policyEpoch`.

Admission should bind descriptor, catalog, profile set, policy, and epoch
evidence. Invocation should reference the admission or capability evidence that
bound those facts instead of trusting a fresh unversioned hello response.

## LLM Participant Flow

An LLM-native Continuum participant can be powerful without being special:

1. Discover participants through `continuum.participant.hello.v1`.
2. Inspect profile support, contract families, conformance claims, policy
   epochs, catalog snapshots, and capability requirements.
3. Observe through declared readings with explicit basis and aperture.
4. Author Edict source as a proposal.
5. Compile the source into deterministic Core and target bundle artifacts.
6. Submit and register the exact bundle subject with a participant.
7. Preflight structural compatibility when available.
8. Request runtime admission of the bundle subject under explicit law.
9. Activate or receive invocable capability handles when policy permits.
10. Invoke the admitted bundle subject with basis, variables, capabilities,
    budget, replay policy, and evidence posture.
11. Receive readings, receipts, tick outcomes, conflicts, plurality, or
    runtime obstructions.
12. If obstructed, refine the proposal or request narrower authority.

At no step does the LLM get to say "trust me because I am an agent." It is a
participant that can author better proposals, not a second ontology.

## Consequences For Continuum Design

`continuum.agent.v1` should be renamed or narrowed before implementation.

Preferred names:

- `continuum.machine-client.v1`;
- `continuum.automation.v1`.

If `continuum.agent.v1` remains, it must normatively mean machine-oriented
discovery, structured diagnostics, rehearsal, repair, and proposal ergonomics
only. It defines no authorization grant, capability class, admission shortcut,
or effect semantics.

`continuum.law.optic.v1` should stay generic. It should name artifact
descriptors, bundle subjects, required capabilities, admission requests,
admission outcomes, scopes, revocations, and obstructions. It should not grow
agent-only fields such as `invokeEdictAsAgent`, `trustedAgent`, or
`agentBypass`.

Participant discovery should advertise what a participant can author, compile,
register, admit, invoke, observe, export, import, debug, and witness. It should
not require consumers to infer those powers from process type.

Protocol fields should name roles and evidence, not privileged species of
caller. Principal kind may be useful for audit, but capability and admission
must decide the operation.

## Diagnostics And Explanations

### Authority Lens

For every invocation, Continuum-compatible tooling should be able to explain:

- declared operation requirement;
- admitted participant grant;
- presented capability scope;
- current revocation and policy state;
- instantiated footprint;
- effective budget;
- final lawful authority.

Call this view the Authority Lens. It does for invocation authority what an
aperture ledger does for optic preservation.

### Participation Transcript

Participants should be able to emit a human-readable and agent-readable chain:

```text
authoredBy
compiledBy
publishedBy
registeredBy
admissionRequestedBy
admittedBy
invokedBy
witnessedBy
```

Each entry references exact artifacts and evidence.

### Rehearsal

Before admission, a rehearsal surface may return:

- lowerability status;
- missing capabilities;
- likely admission constraints;
- required basis shape;
- estimated aperture;
- budget ceiling;
- possible obstruction classes;
- capability downgrade explanations.

No mutation. No policy promise. Just structured guidance before the participant
steps into an avoidable denial.

Example downgrade explanation:

```text
bundle requires: History[repo/x] append
admission allows: History[repo/*] append
presented capability allows: History[repo/y] read
effective result: insufficient
```

### Counterfactual Repair

For an obstruction, a repair-oriented surface may answer:

- why was this obstructed?
- what minimum additional authority would make it admissible?
- what narrower operation would fit current authority?
- what different basis would make it applicable?

These answers should be typed counterfactuals, not ungrounded prose.

## Non-Determinism Threat Matrix

| Threat | Continuum rule |
| --- | --- |
| LLM sampling | Generated source is only a candidate artifact. |
| Prompt context drift | Context must be explicit below the boundary. |
| Browser clock or DOM | Must be observed or witnessed before execution use. |
| Network call during execution | Must be explicit effect or rejected. |
| Opaque host callback | Not a valid deterministic artifact dependency. |
| File save from an app | Emits an intent; runtime admits or rejects it. |
| Human approval click | Produces signed evidence, not mutation. |
| Comment-only Edict change | Release subject changes; semantic may not. |
| Semantic Edict change | Requires new semantic-subject admission. |
| Network retry | Governed by invocation digest and replay policy. |
| Adapter reconciliation | Reading only unless admitted by runtime law. |

## Smallest Honest Proof

The first proof should not attempt a universal agent framework. It should prove
that the boundary is participant-neutral and evidence-sensitive.

The same-result fixture must hold constant:

- bundle subject;
- operation coordinate;
- basis or frontier;
- canonical variables;
- effective capability set;
- admission receipt;
- policy epoch;
- budget;
- evidence posture;
- redaction posture;
- target state.

Only participant-kind metadata should differ.

Required fixtures:

- `self_asserted_agent_kind_does_not_expand_authority`;
- `self_asserted_human_kind_does_not_expand_authority`;
- `attested_host_property_affects_policy_only_through_explicit_rule`;
- `same_effective_authority_same_violation_same_obstruction_class`;
- `obstruction_payload_redaction_preserves_class`;
- `comment_change_preserves_semantic_subject_but_changes_release_subject`;
- `semantic_change_requires_new_semantic_admission`;
- `duplicate_retry_respects_profile_replay_policy`;
- `registration_without_admission_cannot_invoke`;
- `admission_without_presented_invocation_capability_cannot_invoke`;
- `revoked_capability_blocks_invocation_without_changing_bundle_identity`;
- `author_role_does_not_imply_invoker_role`;
- `compiler_operator_role_does_not_imply_admission_authority`;
- `human_label_no_magic`;
- `agent_label_no_magic`;
- `browser_label_no_magic`;
- `cli_label_no_magic`;
- `mcp_label_no_magic`;
- `runtime_label_no_magic`.

Passing this fixture set would show that agent autonomy comes from lawful
artifact authorship and capability-scoped invocation, not from agent
exceptionalism.

## Participant-Neutral Conformance Profile

Continuum should consider a future conformance profile:

```text
continuum.participation-neutrality.v1
```

It would test that a participant:

- does not derive authority from caller-kind labels;
- accepts the same request semantics from CLI, app, and agent hosts;
- applies the same capability calculus;
- emits the same semantic obstruction class under equal conditions;
- preserves role separation;
- never upgrades registration into admission;
- never upgrades admission into scheduler or runtime authority.

This packet names the need. The executable profile belongs in a later
implementation-backed spec.

## Do Not Add These Shortcuts

- Do not let agent-neutral mean all callers deserve equal authority.
- Do not treat an LLM model name as a principal identity.
- Do not let a participant self-assert `kind=human` and gain trust.
- Do not use registration as a synonym for activation.
- Do not use runtime obstruction as a synonym for admission denial.
- Do not let a stale admission receipt bypass current revocation checks.
- Do not require identical obstruction payloads when redaction policy differs.
- Do not bind every invocation to release identity when semantic identity is
  the intended admission subject.
- Do not let a human approval click mutate runtime state directly.
- Do not allow an adapter to say "the user approved it" without carrying the
  resulting signed authority evidence.
- Do not create `invokeEdictAsAgent`, `trustedAgent`, or `agentBypass` fields.

## What This Packet Freezes

- vocabulary separation for participant, principal, host, agent, and role;
- the agent-neutral but evidence-sensitive policy rule;
- the lifecycle state machine and verb meanings;
- bundle-subject binding with semantic and release subjects;
- invocation semantic fields;
- replay and idempotency requirements;
- effective-authority calculus;
- common participation context plus typed request variants;
- obstruction neutrality with redaction;
- fixture matrix requirements.

## What This Packet Does Not Freeze

- Edict syntax.
- Edict Core schema.
- Lawpack schema.
- The exact `continuum.law.optic.v1` contract fields.
- The exact invocation wire schema.
- The identity provider or capability token format.
- Echo target semantics.
- Browser or WASM target semantics.
- Whether `continuum.agent.v1` is renamed to `machine-client` or
  `automation`.

Those should be frozen only after the compiled artifact, registration,
admission, invocation, witness, and obstruction path is proven in the owning
repos.

## Playback Questions

### Human

- [ ] Can I explain how an LLM can author and invoke behavior without giving it
      ambient authority?
- [ ] Can I tell which part is Edict, which part is Continuum, and which part
      belongs to the admitting runtime?
- [ ] Can I reject an agent-specific shortcut without blocking agent autonomy?
- [ ] Can I tell which principal and host presented authority for a model's
      proposed operation?

### Agent Checklist

- [ ] Can I discover the required profiles before proposing an Edict?
- [ ] Can I identify the basis, aperture, capability, budget, replay policy,
      and evidence posture my invocation needs?
- [ ] Can I distinguish source generation, submission, registration,
      admission, activation, and invocation?
- [ ] Can I use obstruction witnesses to refine a proposal without scraping
      human prose?

## Follow-On Work

- Define the minimal `continuum.law.optic.v1` bundle descriptor and admission
  outcome nouns without freezing target runtime semantics.
- Add an Edict fixture matrix that proves human, app, and agent invocations use
  the same boundary.
- Decide whether `continuum.agent.v1` should be renamed to
  `continuum.machine-client.v1` or `continuum.automation.v1`.
- Map Edict artifact identity into Continuum evidence posture and conformance
  reports.
- Specify `continuum.participation-neutrality.v1` after the first executable
  conformance fixtures exist.

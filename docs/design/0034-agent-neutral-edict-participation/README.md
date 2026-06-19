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

Make Continuum participant design agent-neutral.

Agents should be able to become powerful Continuum participants by authoring
and invoking deterministic artifacts, but they must not gain ambient authority
or hidden mutation paths. The same boundary must restrict humans, apps,
browser clients, CLIs, MCP tools, fixtures, and LLM agent hosts.

The key claim is:

**Every Continuum participant reads and writes through bounded optics,
capabilities, witnessed evidence, and runtime-owned admission. Agents are not a
special case.**

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
- a law bundle is an artifact that a runtime may admit, scope, stage,
  obstruct, reject, revoke, or expire.

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
- **Bundle** is the digest-addressed compiled artifact and its metadata.
- **Registration** asks a participant to know about the bundle.
- **Admission** is the runtime-owned decision that scopes, admits, stages,
  rejects, obstructs, revokes, or expires that bundle.
- **Invocation** asks to use an admitted bundle against an explicit basis,
  variables, capabilities, budget, and evidence posture.
- **Outcome** is a reading, admitted tick result, receipt, obstruction,
  conflict, plurality, or other profile-defined result.

Edict is not the Continuum runtime. It is not an authorization provider. It is
not an app framework. It is not an LLM prompt format. It is not a browser
sandbox by itself.

Edict is for the determinism boundary: creative systems may author behavior
above the boundary, but only compiled, digest-addressed, capability-scoped,
runtime-admitted artifacts may interact with causal truth below the boundary.

## Agent-Neutral Invariants

### 1. Participant Kind Does Not Grant Semantics

Continuum protocols may describe whether a caller is a human-operated CLI, app,
agent host, debugger, compiler, fixture, browser client, adapter, or runtime.
That description is evidence and routing context. It is not authority.

Authority comes from capabilities, admitted artifacts, profile support,
witnesses, and runtime-owned law. A protocol that lets an agent bypass an optic
because it is an agent violates this invariant.

### 2. Reads And Writes Use The Same Boundary For Everyone

Reads are lawful observations. Writes are proposed intents. Both must cite the
same kinds of boundary facts:

- basis or frontier;
- aperture, footprint, or target coordinate;
- profile and contract-family posture;
- capability presentation;
- budget;
- evidence and redaction posture;
- witness or obstruction references.

A human clicking a button, an app saving a file, a browser requesting a page,
and an LLM invoking a newly authored Edict all cross this boundary in the same
shape.

### 3. Admission Remains Runtime-Owned

Edict can produce a deterministic artifact. Continuum can name the artifact,
digest, profile, capability shape, and outcome vocabulary. Only the owning
runtime or host authority can admit, scope, stage, obstruct, reject, revoke, or
expire it for a causal domain.

No participant may convert successful compilation into admitted causal truth.

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

### 5. Generated Source Is A Candidate Artifact

An LLM may dynamically write an Edict. That act creates an artifact candidate,
not authority. The candidate must be parsed, checked, compiled, content
addressed, registered, and admitted before it can be invoked as trusted
runtime interaction.

If the LLM changes one byte of source, the compiled bundle identity must change
or the verifier must explain why the semantic artifact is unchanged. In either
case, the invocation must cite the exact artifact identity it relies on.

### 6. No Hidden Dependencies

An Edict artifact may not depend on ambient host state that is not present in
the invocation envelope, admitted basis, retained witness, or capability
presentation.

Forbidden hidden inputs include:

- wall-clock time;
- randomness;
- network responses;
- filesystem contents;
- browser DOM state;
- model hidden state;
- closure captures;
- opaque callbacks;
- process-global mutable state;
- terminal text scraped outside an observation profile.

If any of these facts matter, they must cross the boundary as explicit
witnessed inputs, retained readings, capabilities, or obstructions.

### 7. Determinism Is Below The Creativity Line

LLMs, humans, and apps may be creative before admission. They may propose new
operations, choose names, draft laws, search docs, or refine after obstruction.

Below the boundary, the artifact must be deterministic enough for a verifier,
runtime, or conformance harness to reproduce the same bundle identity and
understand the same permitted effect shape from the same inputs.

### 8. Registration Is Not Invocation

Registration makes a bundle known to a participant. It may also produce
evidence that the bundle was seen, checked, staged, or rejected.

Invocation is separate. A valid invocation cites an admitted bundle or handle,
an exact basis, canonical variables, capability posture, and budget. It
produces readings, receipts, tick outcomes, conflicts, plurality, or
obstructions according to the target profile.

### 9. Roles Stay Separate Even When One Process Plays Many

Continuum should preserve the difference between:

- author;
- compiler operator;
- bundle publisher;
- registry participant;
- invoker;
- capability issuer;
- admitting runtime;
- observer;
- witness producer;
- reviewer.

One LLM agent host might play several of these roles in one workflow. The
protocol still records them separately so authority and evidence remain
inspectable.

### 10. Obstruction Is First-Class And Participant-Neutral

An agent-authored Edict, app-authored Edict, and human-authored Edict must
receive the same kind of obstruction for the same violation.

Obstruction should identify the failed profile, basis, capability, aperture,
law, verifier expectation, rights posture, residual, conflict, or missing
witness. It should also say whether a narrower observation, rehearsal, new
capability, or different basis could proceed.

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

### 12. Continuum Does Not Own Target Semantics

Continuum should not define Edict Core, Echo DPO semantics, browser execution
semantics, or another runtime's internal law.

Continuum owns the participant protocol vocabulary: profiles, envelopes,
artifact identity, capability posture, admission outcomes, evidence posture,
and witness requirements. Edict owns the language and deterministic artifact
shape. Each target runtime owns its admitted target law.

### 13. Adapters Must Not Launder Effects

A browser app, CLI, MCP host, or UI adapter must not mutate host state, hand
reconcile incompatible stories, and then label the result native Continuum
truth.

Adapters either emit readings with honest evidence posture or submit intents to
the admitting participant. Native witnesshood requires native witness evidence.

## LLM Participant Flow

An LLM-native Continuum participant can be powerful without being special:

1. Discover participants through `continuum.participant.hello.v1`.
2. Inspect profile support, contract families, conformance claims, and
   capability requirements.
3. Observe through declared readings with explicit basis and aperture.
4. Author Edict source as a proposal.
5. Compile the source into deterministic Core and target bundle artifacts.
6. Register the bundle with a participant.
7. Request runtime admission of the bundle under explicit law.
8. Invoke the admitted bundle with basis, variables, capabilities, and budget.
9. Receive readings, receipts, tick outcomes, conflicts, plurality, or
   obstructions.
10. If obstructed, refine the proposal or request narrower authority.

At no step does the LLM get to say "trust me because I am an agent." It is a
participant that can author better proposals, not a second ontology.

## Consequences For Continuum Design

`continuum.agent.v1` should be treated as a machine-client ergonomics profile,
not an authority tier. It can describe tool descriptors, resource descriptors,
machine-readable facts, action proposals, rehearsals, receipts, and
obstructions. It must not grant mutation rights that ordinary participants
cannot obtain through profiles, optics, capabilities, and admission.

`continuum.law.optic.v1` should stay generic. It should name artifact
descriptors, bundle digests, required capabilities, admission requests,
admission outcomes, scopes, revocations, and obstructions. It should not grow
an agent-only `invokeEdict` escape hatch.

Participant discovery should advertise what a participant can author, compile,
register, admit, invoke, observe, export, import, debug, and witness. It should
not require consumers to infer those powers from process type.

Protocol fields should name roles and evidence, not privileged species of
caller. Principal kind may be useful for audit, but capability and admission
must decide the operation.

## Non-Determinism Threat Matrix

| Threat | Continuum rule |
| --- | --- |
| LLM sampling | Generated source is only a candidate artifact. |
| Prompt context drift | Required context must be explicit input or evidence. |
| Browser clock or DOM | Must be observed or witnessed before use. |
| Network call during execution | Must be explicit effect or rejected. |
| Opaque host callback | Not a valid deterministic artifact dependency. |
| File save from an app | Emits an intent; runtime admits or obstructs it. |
| Human approval click | Presents authority or proposes intent; not mutation. |
| New generated Edict | New bundle identity and admission path. |
| Concurrent invocation | Basis and admission outcome preserve plurality. |
| Adapter reconciliation | Reading only unless admitted by runtime law. |

## Smallest Honest Proof

The first proof should not attempt a universal agent framework. It should prove
that the boundary is participant-neutral.

Useful fixtures:

- one Edict bundle invoked by a human CLI, app host, and LLM agent host against
  the same basis with the same inputs;
- one overbroad aperture rejected with the same obstruction shape for all three
  participant kinds;
- one hidden-clock or hidden-randomness attempt rejected before admission;
- one source-byte change that changes bundle identity and requires admission of
  the new identity;
- one capability downgrade that preserves artifact identity but obstructs
  invocation.

Passing this fixture would show that agent autonomy comes from lawful artifact
authorship and capability-scoped invocation, not from agent exceptionalism.

## What This Packet Does Not Freeze

- Edict syntax.
- Edict Core schema.
- Lawpack schema.
- The exact `continuum.law.optic.v1` contract fields.
- Echo target semantics.
- Browser or WASM target semantics.
- The identity provider or capability token format.
- Whether `continuum.agent.v1` remains separate from a broader machine-client
  ergonomics profile.

Those should be frozen only after the compiled artifact, registration,
invocation, witness, and obstruction path is proven in the owning repos.

## Playback Questions

### Human

- [ ] Can I explain how an LLM can author and invoke behavior without giving it
      ambient authority?
- [ ] Can I tell which part is Edict, which part is Continuum, and which part
      belongs to the admitting runtime?
- [ ] Can I reject an agent-specific shortcut without blocking agent autonomy?

### Agent

- [ ] Can I discover the required profiles before proposing an Edict?
- [ ] Can I identify the basis, aperture, capability, budget, and evidence
      posture my invocation needs?
- [ ] Can I distinguish source generation, bundle registration, admission, and
      invocation?
- [ ] Can I use obstruction witnesses to refine a proposal without scraping
      human prose?

## Follow-On Work

- Define the minimal `continuum.law.optic.v1` bundle descriptor and admission
  outcome nouns without freezing target runtime semantics.
- Add an Edict fixture matrix that proves human, app, and agent invocations use
  the same boundary.
- Decide whether `continuum.agent.v1` should be renamed or narrowed to avoid
  implying special authority.
- Map Edict artifact identity into Continuum evidence posture and conformance
  reports.

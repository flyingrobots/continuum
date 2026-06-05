# Continuum

Most tools share **state**. Continuum shares **history with proof**.

> A protocol suite for apps and tools that need to agree about what happened,
> why it happened, and what evidence proves it. [cite:1]

Continuum is the shared protocol layer for a small but growing causal-computing stack. It gives independent runtimes, apps, debuggers, agents, and developer tools a common way to exchange witnessed history instead of copying one shared database or scraping screenshots. [cite:1]

If this is the first encounter with Continuum, the short version is simple:

- Continuum is a shared protocol layer for talking about changes.
- It focuses on who proposed what, what the runtime decided, and what evidence backs that decision.
- It lets tools import, inspect, and replay history without hard-coding every app. [cite:1]

## Why Continuum exists

Most software asks for current state. That works until several systems need to agree about how that state came to exist, what rights or rules applied along the way, and what evidence proves the result. [cite:1]

A typical story looks like this:

1. A user edits a document.
2. An agent proposes a change.
3. A runtime decides whether that change is allowed.
4. A debugger asks what happened.
5. A filesystem-like tool wants to show the result as files.
6. Another runtime wants to import part of the history. [cite:1]

If every tool invents its own story, the ecosystem drifts. If every tool is forced to share one database, the ecosystem stops being an ecosystem. [cite:1]

Continuum standardizes the shared boundary that can cross implementation lines: proposed work, admission decisions, causal coordinates, witnesses and receipts, observations and readings, suffix export/import, obstruction reasons, and capability posture. Everything inside a runtime stays runtime-local. [cite:1]

## A tiny walkthrough

Think about editing a file in a Continuum-shaped system. Instead of "the editor mutates global state," the flow is: a tool submits an **intent**, a **runtime** decides whether to admit or obstruct it, the result becomes part of witnessed causal history, and other tools request lawful **readings** over that history. [cite:1]

In plain language:

- **Intent:** "I want to do this."
- **Admission:** "The runtime decided whether that can happen."
- **Witness:** "Here is evidence for the decision."
- **Reading:** "Here is one lawful view of the resulting history." [cite:1]

## The model shift

Continuum starts from this sentence:

> **The graph is a coordinate chart over witnessed causal history.** [cite:1]

Practically, that means there is no single magic graph that every tool must read. The durable thing is the history of admitted changes and their evidence, while a graph, file tree, debugger frame, editor buffer, or UI screen is a reading over that history. [cite:1]

Different tools may produce different readings from the same causal basis, but those readings must preserve what was proven, redacted, obstructed, or still unresolved. [cite:1]

The short version:

```text
History is the territory.
The graph is a coordinate chart.
State is a policy-relative materialized view.
Files are readings.
Writes are intents.
Admission is witnessed.
```
[cite:1]

## How Continuum fits into the stack

Continuum is not an app by itself. It sits underneath and between runtimes and tools in the causal-computing stack. [cite:1]

| Project | What it is | How it uses Continuum | Status / target tier |
| --- | --- | --- | --- |
| [Echo](https://github.com/flyingrobots/echo) | Deterministic runtime over witnessed causal history. | Runtime participant and admission owner. | Target: T2/T3+ as native witnesses land. [cite:1] |
| [jedit](https://github.com/flyingrobots/jedit) | Terminal-first editor shaped around Echo-backed editing. | Product-pressure app over Echo. | Target: observable app. [cite:1] |
| [git-warp](https://github.com/git-stunts/git-warp) | Git-backed causal runtime direction. | Expected sibling runtime. | Target: T3 exchange; native evidence still open. [cite:1] |
| [Graft](https://github.com/flyingrobots/graft) | Structural observer and review engine for code. | Observer participant. | T2-style structural readings with honest evidence. [cite:1] |
| [WARP TTD](https://github.com/flyingrobots/warp-ttd) | Time-travel debugger and causal observer. | Debugger/operator participant. | Consumes T2/T4/T5 profiles from targets. [cite:1] |
| [WARP DRIVE](https://github.com/flyingrobots/warp-drive) | POSIX-shaped membrane over readings and intents. | Filesystem membrane participant. | Profile/app over observation and intent surfaces. [cite:1] |
| [Wesley](https://github.com/flyingrobots/wesley) | Semantic contract compiler and witness tooling. | Compiler participant. | Compiles families; does not own runtime truth. [cite:1] |
| Continuum | Shared protocol doctrine, schemas, registry, and invariants. | Protocol source. | Defines profiles and tiers; not a runtime. [cite:1] |

Continuum supplies the shared boundary language and proof posture that lets these systems cooperate without pretending they are one monolith. [cite:1]

## Core ideas in simple terms

| Term | Plain meaning | Why it matters |
| --- | --- | --- |
| Participant | Anything that speaks at least one Continuum profile. | Apps, runtimes, tools, and fixtures can all join honestly. [cite:1] |
| Runtime | A participant that owns admission for at least one causal lane. | It has authority to accept or block proposed work. [cite:1] |
| Profile | A named behavior contract, such as observation or debug. | A participant can support some profiles without supporting all of them. [cite:1] |
| Contract family | Shared schema nouns authored as GraphQL SDL. | Families define shape; profiles define behavior. [cite:1] |
| Intent | Proposed work. | Writes and actions start as proposals, not direct mutation. [cite:1] |
| Admission | Runtime decision against a bounded basis and law. | This is where proposed work becomes causal history or gets blocked. [cite:1] |
| Witness | Evidence for a claim. | Tools should not trust prose when a witness is required. [cite:1] |
| Receipt | Transport/operator wrapper around evidence. | Helps tools route, inspect, retain, and explain claims. [cite:1] |
| Reading | A lawful view over causal history. | UI, files, graphs, reports, and debugger frames are readings. [cite:1] |
| Observer | A lawful read process with basis, aperture, budget, and law. | Explains where readings came from. [cite:1] |
| Lane | A causal track where history accumulates. | Lanes let work branch, converge, or remain plural. [cite:1] |
| Frontier | The known boundary of a lane or set of lanes. | Makes "from which point?" explicit. [cite:1] |
| Suffix | A package of causal history for export/import. | Continuum exchanges suffixes, not snapshots. [cite:1] |
| Evidence posture | Native, translated, fixture, redacted, obstructed, and similar statuses. | Prevents fake compatibility claims. [cite:1] |
| Obstruction | Machine-readable refusal or blockage. | Agents and humans can learn what boundary was hit. [cite:1] |
| Counterfactual | Scratch branch used to ask "what if?" | Not canonical until promoted. [cite:1] |
| Warpspace | Local project constellation and stack manifest. | Lets tools know which families, targets, and roots are in play. [cite:1] |

## Capability tiers

Continuum compatibility grows in visible tiers, and a participant can join early without pretending to support everything. [cite:1]

- **T0 — Descriptor only:** the participant can say what it is and what it does not support.
- **T1 — Contract-shaped:** the participant publishes or consumes contract families and schema digests.
- **T2 — Observable:** the participant can answer observation requests with reading envelopes.
- **T3 — History exchange:** the participant can export or import witnessed suffixes.
- **T4 — Debuggable:** the participant supports replay, seek, and step semantics for advertised debug operations.
- **T5 — Counterfactual:** the participant supports scratch branches and divergence reports.
- **T6 — Law/optic:** the participant can admit, obstruct, revoke, and witness law or optic artifacts. [cite:1]

A participant does not need to start at the top. T0 and T1 are valid ways to join the ecosystem honestly. [cite:1]

## Participant types

Participants all speak profiles and report evidence posture, but they do different jobs. A runtime is not just anything that can speak Continuum; it owns admission for at least one causal lane or history domain. [cite:1]

Participants that only observe, adapt, debug, mount, compile, or test are still useful participants, but they are not runtimes. [cite:1]

## Profiles in human terms

Profiles describe behavior, while contract families describe shared nouns. [cite:1]

Important profiles include:

- `continuum.participant.hello.v1`: identity, supported profiles, contract families, connection hints, auth posture, and evidence posture.
- `continuum.contract.index.v1`: authored and consumed families, generated artifacts, schema digests, witnesses, and open cuts.
- `continuum.observation.v1`: lawful readings returned as evidence-bearing `ReadingEnvelope` results or obstructions.
- `continuum.history.exchange.v1`: export/import of witnessed suffixes and settlement outcomes.
- `continuum.debug.v1`: app-agnostic debugger access to causal history.
- `continuum.counterfactual.v1`: scratch branches, alternate histories, divergence reports, and promotion requests.
- `continuum.law.optic.v1`: compiled law/optic artifacts admitted without ambient authority.
- `continuum.warpspace.v1`: local app constellations, runtime targets, generated roots, and stack tuple locks.
- `continuum.agent.v1`: structured discovery, inspection, proposal, rehearsal, and obstruction surfaces for agents.
- `continuum.warp-drive.v1`: file-shaped readings and write-as-intent semantics without making POSIX the core ontology. [cite:1]

For example, `continuum.observation.v1` may require `ObserverPlan`, `ObservationRequest`, and `ReadingEnvelope`, but compiling those nouns alone does not guarantee that a participant preserves rights, residuals, obstruction behavior, and evidence posture. [cite:1]

## WARP TTD and WARP DRIVE

WARP TTD is the debugger-shaped layer. A target may be inspectable, debuggable, or counterfactual-debuggable depending on whether it supports observation, replay/seek/step, and scratch-branch workflows. [cite:1]

Debug access is not authority-free by default. Private history, sensitive lanes, payload bodies, suffix export, branch creation, law admission, and promotion remain capability-gated operations. [cite:1]

WARP DRIVE is the filesystem-shaped layer:

```text
read file     -> ObservationRequest
file bytes    -> ReadingPayload
write file    -> IntentEnvelope
save result   -> TickResult | Obstruction
path          -> observer-relative coordinate
mount         -> profile descriptor + capability posture
stat metadata -> evidence posture + basis/frontier/digest
```
[cite:1]

WARP DRIVE mounts readings, not substrate truth. [cite:1]

## What Continuum is and is not

Continuum owns shared GraphQL contract families, protocol doctrine, contract-family ownership and witness posture, cross-repo invariants, WARPspace bootstrap direction, Continuum-owned Wesley module surfaces, and design packets with METHOD-shaped coordination discipline. [cite:1]

Continuum does not own Echo-local engine internals, `git-warp`-local internals, WARP TTD session internals, WARP DRIVE product semantics beyond shared profile boundaries, Graft-local structural reading payloads before promotion, generic Wesley base-platform implementation truth, app-local domain schemas, or one canonical materialized graph. [cite:1]

It also is not a runtime, graph database, storage engine, scheduler, debugger UI, filesystem, state-sync protocol, CRDT framework, global law registry, universal app ontology, or cloud daemon. [cite:1]

## Getting started

Pick the path that matches the learning style.

### Run something first

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
node --test apps/warp/test/*.test.mjs
```
[cite:1]

Then read:

1. [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
2. [docs/contract-family-registry.md](docs/contract-family-registry.md)
3. [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)
4. [schemas/README.md](schemas/README.md) [cite:1]

### Understand the model first

Read in this order:

1. [docs/OVERVIEW.md](docs/OVERVIEW.md)
2. [README_FULL.md](README_FULL.md)
3. [Continuum Compendium V1](docs/design/0031-continuum-compendium-v1/README.md)
4. [docs/VISION.md](docs/VISION.md)
5. [docs/BEARING.md](docs/BEARING.md)
6. [METHOD.md](METHOD.md)
7. [APP_GLOSSARY.md](APP_GLOSSARY.md) [cite:1]

## Current implementation direction

The next concrete proof is small and focused: define `continuum.participant.hello.v1`, add a descriptor-only participant fixture, add structured evidence posture, generate a witness through Wesley, prove WARP TTD can discover a target without app-specific knowledge, and teach `warp doctor` to report profile and evidence status honestly. [cite:1]

There are no counterfactuals yet, no global law registry yet, no identity-system decision yet, and no federation surface yet. [cite:1]

## The one rule

There is no canonical materialized graph. There is witnessed causal history, and graph-like structure is an observer-relative reading over that history. [cite:1]

## License

Continuum (c) 2026 by James Ross. Licensed under the [Apache License 2.0](./LICENSE). [cite:1]

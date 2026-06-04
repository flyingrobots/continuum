# Continuum

> A protocol suite for lawful causal interoperability over witnessed causal
> history.

Continuum is the shared boundary language for causal computing systems. It lets
runtimes, debuggers, observers, filesystem membranes, compilers, agent hosts,
fixtures, and applications describe what happened, where it happened, from
which basis, under which law, with which witness, under which evidence posture,
and with which residuals preserved.

Continuum does not make systems agree by sharing a database. It makes systems
agree by publishing causal claims and evidence at the boundaries between
independent implementations.

**Current work:** Continuum is just getting started across the active stack:
[Echo](https://github.com/flyingrobots/echo),
[jedit](https://github.com/flyingrobots/jedit),
[git-warp](https://github.com/git-stunts/git-warp),
[Graft](https://github.com/flyingrobots/graft),
[WARP TTD](https://github.com/flyingrobots/warp-ttd), and
[WARP DRIVE](https://github.com/flyingrobots/warp-drive). The shared protocol
surface is being shaped by those projects as they prove runtime admission,
readings, debugging, structural observation, and cross-runtime exchange.

## The Short Version

```text
History is the territory.
The graph is a coordinate chart.
State is a policy-relative materialized view.
Files are readings.
Writes are intents.
Admission is witnessed.
```

Continuum starts from one rule:

**The graph is a coordinate chart over witnessed causal history.**

There is no privileged, substrate-owned graph inside Echo, `git-warp`, or any
other runtime. What is real at the Continuum boundary is witnessed causal
history:

- admitted transitions;
- frontiers;
- lane identities;
- payload hashes;
- receipts;
- witnesses;
- checkpoints;
- suffix bundles;
- settlement and obstruction artifacts.

Graph-like values, files, UI models, structural outlines, debugger frames, and
query results can all be useful. They are readings over causal history, not the
source of truth.

## Why This Exists

Most integration designs eventually smuggle in one hidden authority:

- one database;
- one graph;
- one scheduler;
- one "latest state";
- one app-specific adapter that normalizes incompatible stories by hand.

Continuum rejects that shape.

The web did not require every browser and server to share one database. Git did
not require every working copy to share one process. Debug Adapter Protocol did
not require every editor to embed every debugger. Trace Context did not require
every service to use one tracing backend.

Continuum applies the same protocol move to causal computation: define the
facts that must cross implementation boundaries, then let implementations
remain free inside their own kernels.

## What Continuum Gives You

Continuum gives compatible participants a shared way to:

- discover each other through `continuum.participant.hello.v1`;
- publish which profiles, contract families, and evidence postures they
  support;
- request lawful observations and receive evidence-bearing readings;
- exchange witnessed causal suffixes instead of state snapshots;
- distinguish native, translated, fixture, descriptor-only, redacted,
  unsupported, and obstructed evidence;
- let WARP TTD attach only when a target advertises the required debug profile;
- let WARP DRIVE mount readings and submit writes as intents without making
  POSIX paths core ontology;
- publish and admit laws or optics without granting ambient authority;
- report conformance gaps through witnesses, open cuts, and `warp doctor`.

Not every participant supports every capability. That is the point. Continuum
should let a target say "I can be discovered, but not observed yet," or "I am
observable, but not debuggable," without lying.

## What Continuum Is Not

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
- a cloud daemon that must be online;
- a place for tools to fake compatibility.

Echo, `git-warp`, and future runtimes own runtime truth. Wesley compiles
contracts. WARP TTD debugs. WARP DRIVE mounts readings. Graft observes
structure. Apps create product experiences.

Continuum owns the shared boundary language and proof posture that lets those
systems cooperate.

## Participants And Runtimes

A **Continuum participant** is anything that speaks at least one Continuum
profile.

Participant kinds include:

- runtime;
- app;
- debugger;
- observer;
- filesystem membrane;
- compiler;
- agent host;
- Warpspace;
- adapter;
- fixture runtime;
- conformance harness.

A **Continuum runtime** is a participant that owns admission for at least one
causal lane or history domain and can publish runtime-owned outcomes according
to Continuum profiles.

A **full Continuum runtime** can publish, admit, observe, export, and import
witnessed causal history for its advertised profile set.

Participants that only observe, adapt, debug, mount, compile, or test are
Continuum participants, not runtimes.

This is why the first discovery profile is
`continuum.participant.hello.v1`, not `continuum.runtime.hello.v1`.

## Current Stack Roles

- **Continuum:** shared vocabulary, contract families, profiles, invariants,
  registry truth, and compatibility doctrine.
- [**Wesley**](https://github.com/flyingrobots/wesley): contract compiler,
  manifest/codegen surface, fixture support, and witness tooling.
- [**Echo**](https://github.com/flyingrobots/echo): sibling runtime
  implementation with runtime-owned admission, ticks, readings, and suffix
  transport.
- [**git-warp**](https://github.com/git-stunts/git-warp): expected sibling
  runtime with Git-backed deployment posture; native claims require witnesses.
- [**WARP TTD**](https://github.com/flyingrobots/warp-ttd): debugger/operator
  surface over discovery, observation, debug, counterfactual, receipt, and
  evidence profiles.
- [**WARP DRIVE**](https://github.com/flyingrobots/warp-drive): POSIX-shaped
  membrane over readings and intents; a profile/app, not Continuum core.
- [**Graft**](https://github.com/flyingrobots/graft): structural observer and
  review engine that emits structural readings with honest source evidence.
- **jedit:** product-pressure app. Edits submit intents, and
  history/debug/structural/file surfaces compose through profiles.
- **warp:** local CLI for WARPspace bootstrap, stack tuples, and eventually
  conformance checks.

## Profiles In Plain Language

Continuum profiles describe behavior. Contract families describe shared nouns.
A profile may require several families, and one family may appear in several
profiles.

For example, `continuum.observation.v1` is a profile. It may require the
runtime-boundary nouns `ObserverPlan`, `ObservationRequest`, and
`ReadingEnvelope`, but compiling those nouns does not prove the participant can
preserve rights, residuals, obstruction behavior, and evidence posture.

- `continuum.participant.hello.v1`: describe identity, supported profiles,
  contract families, connection hints, auth posture, and evidence posture.
- `continuum.contract.index.v1`: publish authored/consumed families, generated
  artifacts, schema digests, witnesses, and open cuts.
- `continuum.observation.v1`: request lawful readings and return
  evidence-bearing `ReadingEnvelope` results or obstructions.
- `continuum.history.exchange.v1`: export/import witnessed suffixes and report
  settlement/import outcomes.
- `continuum.debug.v1`: let WARP TTD or another debugger inspect causal history
  without app-specific knowledge.
- `continuum.counterfactual.v1`: create scratch branches, run alternate
  histories, compare outcomes, and request explicit promotion.
- `continuum.law.optic.v1`: publish compiled law/optic artifacts and request
  runtime admission without ambient authority.
- `continuum.warpspace.v1`: describe local app constellations, runtime targets,
  generated roots, and stack tuple locks.
- `continuum.agent.v1`: give agents structured discovery, inspection, proposal,
  rehearsal, and obstruction surfaces.
- `continuum.warp-drive.v1`: mount readings as files and submit writes as
  intents without making POSIX core ontology.

Historical `runtime.hello` wording is superseded by
`continuum.participant.hello.v1` for normative Continuum discovery.

## Evidence Posture

Continuum should not flatten evidence into one status string.

Every profile needs to preserve combinations such as:

- native witness, complete, available;
- translated substrate evidence, partial, redacted;
- fixture evidence, unsupported for runtime use;
- descriptor-only claim, credential required;
- obstructed with machine-readable reason.

This matters because a debugger, agent, or reviewer must know whether a result
was truly witnessed by a runtime, translated by an adapter, produced by a
fixture, redacted by policy, or merely claimed by a descriptor.

## Conformance Ladder

Continuum compatibility should grow in visible tiers:

- **Tier 0 - Descriptor only:** the participant can say what it is and what it
  does not support.
- **Tier 1 - Contract-shaped:** the participant publishes or consumes contract
  families and schema digests.
- **Tier 2 - Observable / inspectable:** the participant can answer observation
  requests with reading envelopes.
- **Tier 3 - History-exchange capable:** the participant can export or import
  witnessed suffixes.
- **Tier 4 - Debuggable:** the participant supports replay/seek/step semantics
  for advertised debug operations.
- **Tier 5 - Counterfactual-debuggable:** the participant supports scratch
  branches, alternate runs, and divergence reports.
- **Tier 6 - Law/optic participant:** the participant can admit, obstruct,
  revoke, and witness law or optic artifacts.

The ladder lets an implementation join early without overstating its proof.

## WARP TTD And WARP DRIVE

WARP TTD compatibility is not automatic. A target can be:

- **inspectable**: it supports observation and reading envelopes;
- **debuggable**: it also supports replay, seek, and step over retained or
  reconstructible evidence;
- **counterfactual-debuggable**: it also supports scratch branches, alternate
  runs, divergence reports, and explicit promotion requests.

Debug access is never authority-free by default. Private history, sensitive
lanes, payload bodies, suffix export, branch creation, law admission, and
promotion are capability-gated operations.

WARP DRIVE sits in a different layer:

```text
read file     -> ObservationRequest
file bytes    -> ReadingPayload
write file    -> IntentEnvelope
save result   -> TickResult | Obstruction
path          -> observer-relative coordinate
mount         -> profile descriptor + capability posture
stat metadata -> evidence posture + basis/frontier/digest
```

WARP DRIVE mounts readings, not substrate truth.

## What This Repo Owns

Continuum owns:

- shared GraphQL contract families in [schemas](schemas/README.md);
- protocol doctrine in
  [Continuum Compendium V1](docs/design/0031-continuum-compendium-v1/README.md);
- contract-family ownership and witness posture in
  [docs/contract-family-registry.md](docs/contract-family-registry.md);
- cross-repo invariants in
  [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md);
- WARPspace bootstrap direction in [apps/warp](apps/warp/README.md);
- Continuum-owned Wesley module surfaces under [wesley](wesley/README.md);
- design packets and METHOD-shaped coordination discipline.

Continuum does not own:

- Echo-local engine internals;
- `git-warp`-local engine internals;
- WARP TTD product/session internals;
- WARP DRIVE filesystem product semantics beyond shared profile boundaries;
- Graft-local structural reading payloads before promotion;
- generic Wesley base-platform implementation truth;
- app-local domain schemas;
- one canonical materialized graph.

## Getting Started

Read in this order:

1. [Continuum Compendium V1](docs/design/0031-continuum-compendium-v1/README.md)
2. [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
3. [docs/contract-family-registry.md](docs/contract-family-registry.md)
4. [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)
5. [schemas/README.md](schemas/README.md)

Try the WARPspace bootstrap proof:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
```

Run the currently independent WARPspace tests:

```bash
node --test apps/warp/test/*.test.mjs
```

Deeper orientation:

- [docs/OVERVIEW.md](docs/OVERVIEW.md)
- [docs/VISION.md](docs/VISION.md)
- [docs/BEARING.md](docs/BEARING.md)
- [METHOD.md](METHOD.md)
- [APP_GLOSSARY.md](APP_GLOSSARY.md)

## Current Implementation Direction

The next honest proof is small:

1. Define `continuum.participant.hello.v1`.
2. Add a descriptor-only participant fixture.
3. Add structured evidence posture.
4. Generate a witness through Wesley.
5. Prove WARP TTD can discover a target without app-specific knowledge.
6. Teach `warp doctor` to report profile/evidence status honestly.

No counterfactuals yet. No global law registry yet. No identity-system
decision yet. No federation surface yet.

## Rule To Remember

There is no canonical materialized graph.

There is witnessed causal history, and graph-like structure is an
observer-relative reading over that history.

## License

Continuum (c) 2026 by James Ross.

Licensed under the [Apache License 2.0](./LICENSE).

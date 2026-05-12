# Continuum

## There Is No Graph

Continuum starts from one rule:

**The graph is a coordinate chart over witnessed causal history.**

There is no privileged, substrate-owned graph inside Echo, `git-warp`, or any
other runtime.

What is real at the Continuum boundary is witnessed causal history:

- admitted transitions
- frontiers
- lane identities
- payload hashes
- receipts, witnesses, checkpoints, and related boundary artifacts

What people casually call "the graph" is a reading emitted by an observer or
optic over that history. Graph-like state can be useful, cached, retained, or
materialized, but it is not the primary ontology.

Continuum exists to keep that boundary honest across the WARP stack.

> [!WARNING]
> **Status: Nascent / Experimental**
> Continuum is under active research and development. Expect rapid iteration,
> breaking changes, and evolving boundaries while the shared stack hardens.

## What Continuum Is

Continuum is the shared protocol, contract, admissibility, and witness language
for distributed causal computation.

It owns coordination truth:

- shared vocabulary
- authored shared contract families
- admission and compatibility language
- witness and receipt boundaries
- cross-repo noun ownership
- compatibility evidence and open cuts
- invariants that keep sibling runtimes interoperable

It does not own runtime truth.

Echo, `git-warp`, and any later conforming implementation remain free to choose
their own storage, scheduler, indexes, caches, checkpoints, retained readings,
and local materializations.

- **Continuum** — Shared semantics, contract families, invariants, and coordination truth (this repo)
- [**Wesley**](https://github.com/flyingrobots/wesley) — Contract compiler, manifest generation, witness tooling, and TTD (Typed Transition Discipline) code generator
- [**Echo**](https://github.com/flyingrobots/echo) — Primary runtime implementation
- [**git-warp**](https://github.com/git-stunts/git-warp) — Complementary runtime implementation (Git-backed)
- **warp** — User-facing CLI for bootstrapping and managing WARPspaces
- [**warp-ttd**](https://github.com/flyingrobots/warp-ttd) — Shared debugger and operator surfaces

The shared boundary is not "the graph." The shared boundary is the witnessed
causal history and the contract-shaped artifacts that make it admissible,
observable, exportable, and importable.

## Why This Matters

Bad designs start by assuming:

- the runtime stores one universal graph
- synchronization means copying state
- queries read a god's-eye object
- one engine must own privileged truth
- tools may normalize incompatible host stories by hand

Continuum takes the stricter model:

- runtimes participate in shared causal history
- runtimes exchange witnessed suffixes, not state snapshots
- incoming claims are admitted, braided, staged, rejected, or obstructed
- observers emit what can be lawfully seen from available evidence
- graph-like values are observer-relative readings

That is how Echo and `git-warp` can be sibling runtime implementations without
one being subordinate to the other.

## Layer Model

Think in layers:

1. Shared causal history
2. Boundary artifacts and witnessed suffixes
3. Lawful observers and optics
4. Observer-relative readings
5. Optional graph-like materializations

The materialized graph-like thing may be real as a reading. It is not primary
as ontology.

The territory is causal history. The chart is what an observer can lawfully
emit.

## Observer Rule

An observer is not just a query.

An observer has:

- an aperture
- a basis
- state
- an update law
- an emission law

A reading is therefore never "the graph itself." It is what this lawful
observer can emit from this causal history, at this frontier, under this
budget.

Different observers may chart the same causal history differently. Those charts
may overlap, preserve plurality, disagree, be rights-gated, be partially
translatable, or obstruct. Continuum requires the published boundary to carry
witness for what was preserved, lost, blocked, or left plural.

## Current Stack

- **Continuum**: shared semantics, contract families, invariants, and
  coordination truth.
- **Wesley**: base compiler, manifest, witness, codec, and toolchain platform.
- **Continuum Wesley module**: Continuum-owned command, profile, fixture, and
  TTD protocol-family compiler surfaces under [wesley](wesley/README.md).
- **Echo**: sibling Continuum runtime implementation.
- **`git-warp`**: sibling Continuum runtime implementation.
- **`warp-ttd`**: debugger and operator surfaces over generated contracts.
- **`warp`**: user-facing CLI for bootstrapping and managing WARPspaces.

A Continuum runtime is any implementation that can publish, admit, observe,
export, and import witnessed causal history according to Continuum contract
families and admission laws.

## What Continuum Owns

Continuum owns:

- shared GraphQL contract families in [schemas](schemas/README.md)
- cross-repo noun maps and ownership laws
- canonical invariants in [docs/invariants](docs/invariants/CONTINUUM.md)
- witness and compatibility doctrine
- integration scenarios and proof plans
- WARPspace bootstrap direction
- Continuum-owned Wesley module surfaces under [wesley](wesley/README.md)
- METHOD-shaped process discipline for this coordination repo

Continuum does not own:

- Echo-local engine internals
- `git-warp`-local engine internals
- `warp-ttd` product/session internals
- generic Wesley base-platform implementation truth
- app-local domain schemas
- one canonical materialized graph

## Key Artifacts

- [docs/NORTHSTAR.md](docs/NORTHSTAR.md): the Think-on-Echo north star and
  first proof boundary.
- [schemas](schemas/README.md): authored Continuum contract families.
- [wesley](wesley/README.md): Continuum-owned Wesley module surfaces.
- [apps/warp](apps/warp/README.md): `warp init` and WARPspace templates.
- [docs/contract-family-registry.md](docs/contract-family-registry.md):
  current family registry, consumer posture, witness status, and gaps.
- [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md):
  cross-repo invariants.
- [APP_GLOSSARY.md](APP_GLOSSARY.md): living map between app surfaces and WARP
  concepts.

## Practical Translation

Prefer saying:

- "causal history" over "graph database"
- "witnessed suffix exchange" over "graph sync"
- "materialized reading" over "graph state"
- "observe through an optic" over "query the graph"

## Getting Started

1. Read [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).
2. Browse [APP_GLOSSARY.md](APP_GLOSSARY.md).
3. Read [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md).
4. Check [docs/contract-family-registry.md](docs/contract-family-registry.md).
5. Try the bootstrap:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
```

Deeper orientation:

- [docs/OVERVIEW.md](docs/OVERVIEW.md)
- [docs/VISION.md](docs/VISION.md)
- [docs/BEARING.md](docs/BEARING.md)
- [METHOD.md](METHOD.md)

Related repositories:

- [Echo](https://github.com/flyingrobots/echo): sibling runtime implementation.
- [git-warp](https://github.com/git-stunts/git-warp): sibling runtime
  implementation.
- [AIΩN](https://github.com/flyingrobots/aion): deeper theory repo.

## Rule To Remember

There is no canonical materialized graph.

There is witnessed causal history, and graph-like structure is an
observer-relative reading over that history.

## License

Continuum © 2026 by James Ross.

Licensed under the [Apache License 2.0](./LICENSE).

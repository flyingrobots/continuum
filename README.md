# Continuum

> [!WARNING]
> **Status: Nascent / Experimental**
> Continuum is still in active R&D. Expect raw edges, rapid iteration, and
> breaking changes while the shared stack hardens.

Continuum is the coordination membrane across the active WARP stack:

- [Echo](https://github.com/flyingrobots/echo) for hot execution and runtime truth
- [`git-warp`](https://github.com/git-stunts/git-warp) for colder causal and storage truth
- `warp-ttd` for shared debugger and operator surfaces
- Wesley for shared contract compilation, manifests, witnesses, and toolchain handoff

If you land here looking for "the engine," this repo is not it.

Continuum exists so those systems can tell **one story** instead of drifting
into:

- different names for the same nouns
- handwritten parallel schemas
- adapter folklore
- debugger-only normalizations
- theory that never cashes out into shared contracts

## What This Repo Is

Continuum owns the cross-repo glue:

- shared vocabulary
- authored shared contract families
- ownership laws for nouns that cross repo boundaries
- cross-repo invariants
- witness and compatibility truth
- integration scenarios and proof plans

The short version is:

**one semantic universe, multiple engines, one published contract**

## What This Repo Is Not

Continuum is **not**:

- a third runtime engine
- a replacement for Echo
- a replacement for `git-warp`
- a shadow compiler next to Wesley
- the place where every app should directly run

If a repo-local implementation detail matters only to Echo or only to
`git-warp`, it should usually stay there.

## The Current Stack

The intended stack looks like this:

1. Continuum owns shared semantics and authored shared contract families.
2. Wesley compiles those families into Rust, TypeScript, codecs, manifests,
   witnesses, and toolchain handoff artifacts.
3. Echo or `git-warp` is the runtime and engine layer.
4. Apps compose their own domain GraphQL with Continuum shared families and
   the chosen engine family.

That means app authors should extend the engine they are actually running on,
while consuming Continuum-defined shared contracts through Wesley-generated
artifacts.

Continuum does **not** require TypeScript or Rust as the one true app
language. The stable extension surface is the authored GraphQL family plus the
generated consumer artifacts for whatever target language the stack supports.

## The Vision

The interesting idea here is not merely "a family of apps that can work
together."

The stronger claim is:

- a client should experience **one logical graph**
- Echo and `git-warp` are two **execution temperatures** over that graph
- the published nouns should remain the same across both
- crossing between hot and cold runtimes should become a **first-class causal
  event**

That is the point of Continuum: keep the stack honest enough that a debugger,
tool, app, or agent does not have to learn a different conceptual language for
each engine.

## WARPspace and the User Entry Path

Continuum now carries the first user-facing WARPspace bootstrap lane through
the `warp` app:

- [apps/warp/README.md](apps/warp/README.md)
- [apps/warp/VISION.md](apps/warp/VISION.md)
- [docs/releases/demo/README.md](docs/releases/demo/README.md)

That lane is where Continuum starts to become consumable as a real stack
instead of only a theory and coordination repo.

## Where To Start

If you are new here, start with these:

- [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
  The practical entry point: where to begin, what to read first, and what to run.
- [docs/OVERVIEW.md](docs/OVERVIEW.md)
  Brief synthesis of the theory, ownership model, and current stack.
- [docs/VISION.md](docs/VISION.md)
  Repo purpose and current app/runtime model.
- [docs/BEARING.md](docs/BEARING.md)
  The current hill and what this repo is actively trying to lock down.
- [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)
  Canonical cross-repo invariants.
- [apps/warp/README.md](apps/warp/README.md)
  The current Continuum-owned prototype for the WARPspace CLI and stack bootstrap.

If you want the deeper theory behind the stack, read:

- [AIΩN](https://github.com/flyingrobots/aion)

If you want the active engines, go to:

- [Echo](https://github.com/flyingrobots/echo)
- [`git-warp`](https://github.com/git-stunts/git-warp)

## Repo Truth

Right now Continuum is succeeding when it can answer questions like:

- which repo owns this noun?
- which schema is canonical?
- what witness proves two generated legs agree?
- what scenarios prove Echo and `git-warp` tell one story through `warp-ttd`?
- what changed in the shared coordination surface?

Continuum fails if it turns into another place where the same ideas get
renamed, re-authored, and half-implemented.

## Historical Salvage

The seed salvage from the older Continuum work is in [GoodIdeas.md](GoodIdeas.md).

Process and signposts:

- [METHOD.md](METHOD.md)
- [docs/BEARING.md](docs/BEARING.md)
- [docs/VISION.md](docs/VISION.md)
- [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)

## License

Continuum © 2026 by James Ross. Continuum is licensed under the
[Apache License](./LICENSE), Version 2.0 OR
[MIND-UCAL](https://github.com/universalcharter/mind-ucal).

> [!NOTE]
> In short: you may freely use the theory, papers, and documentation without
> adopting MIND-UCAL; MIND-UCAL applies only to derivative ethical commitments,
> not technical use.

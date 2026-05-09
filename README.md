<div align="center">
  <img width="1288" height="188" alt="continuum" src="https://github.com/user-attachments/assets/7cb39622-4610-4db5-8fde-2cce456313a4" />
  <h3>A Protocol for Distributed Causal Computation</h3>
</div>

**Continuum** is the shared coordination layer for the WARP stack.

It provides the canonical vocabulary, contract families, admissibility rules, witness formats, and cross-repo invariants that allow multiple runtimes and tools to maintain **one coherent causal history** instead of drifting into incompatible schemas and interpretations.

---

> [!WARNING]
> **Status: Nascent / Experimental**  
> This repo is under active research and development. Expect rapid iteration, breaking changes, and evolving boundaries while the shared stack hardens.

### Purpose

Continuum exists to keep the WARP ecosystem honest:

- One semantic universe across sibling implementations
- Authored, versioned contract families as the source of truth
- Explicit ownership of nouns that cross repository boundaries
- Witnessed compatibility and integration truth
- Prevention of shadow schemas, adapter folklore, and renaming drift

It is **not** a runtime engine, compiler, or application framework.

### Core Stack

- **Continuum** — Shared semantics, contract families, invariants, and coordination truth (this repo)
- [**Wesley**](https://github.com/flyingrobots/wesley) — Contract compiler, manifest generation, witness tooling, and TTD (Typed Transition Discipline) code generator
- [**Echo**](https://github.com/flyingrobots/echo) — Primary runtime implementation
- [**git-warp**](https://github.com/git-stunts/git-warp) — Complementary runtime implementation (Git-backed)
- **warp** — User-facing CLI for bootstrapping and managing WARPspaces
- [**warp-ttd**](https://github.com/flyingrobots/warp-ttd) — Shared debugger and operator surfaces

A **Continuum runtime** is any implementation that can publish, admit, observe, export, and import witnessed causal history according to the shared contract families and admission laws.

### What Continuum Owns

- Shared GraphQL contract families (`schemas/`)
- Cross-repo noun glossary and ownership map
- Canonical invariants (`docs/invariants/`)
- Witness and compatibility mechanisms
- Integration scenarios and proof plans
- WARPspace bootstrap templates and stack release manifests
- METHOD-shaped process discipline for the stack

### Key Artifacts

- **`schemas/`** — Authored contract families (Neighborhood Core, Receipt, Settlement, Runtime Boundary, etc.)
- **`wesley/`** — Continuum-owned Wesley module with TTD compiler, invariant verifier, and code generators
- **`apps/warp/`** — The `warp` CLI (`warp init`) and WARPspace templates
- **`docs/`** — Design packets, bearing, vision, getting started, and contract registry
- **`APP_GLOSSARY.md`** — Living map between app surfaces and WARP concepts

### Getting Started

1. Read **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** — practical entry point.
2. Browse **[APP_GLOSSARY.md](APP_GLOSSARY.md)** — essential noun mapping.
3. See the current direction in **[docs/BEARING.md](docs/BEARING.md)**.
4. Explore shared contracts in **[docs/contract-family-registry.md](docs/contract-family-registry.md)**.
5. Try the bootstrap: `node apps/warp/bin/warp.mjs init my-app --profile demo`

Deeper orientation:
- **[docs/OVERVIEW.md](docs/OVERVIEW.md)**
- **[docs/VISION.md](docs/VISION.md)**
- **[METHOD.md](METHOD.md)** — how work is structured here
- **[docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)** — core laws

Active sibling repositories:
- [Echo](https://github.com/flyingrobots/echo)
- [git-warp](https://github.com/git-stunts/git-warp)
- [AIΩN](https://github.com/flyingrobots/aion) (theory)

### License

Continuum © 2026 by James Ross.

Licensed under the [Apache License 2.0](./LICENSE)

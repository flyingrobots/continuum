# VISION

Continuum is the shared coordination layer across the current stack.

## Roles

- Echo is a sibling Continuum runtime implementation.
- `git-warp` is a sibling Continuum runtime implementation.
- `warp-ttd` owns shared debugger and operator surfaces.
- Wesley owns compilation, publication boundaries, and conformance/witness
  lanes for shared contract families.
- Continuum owns the cross-repo glue:
  shared protocol language, admissibility laws, witness language, vocabulary,
  ownership maps, authored shared contract families, compatibility truth, and
  integration scenarios.
- Apps own their own domain families and compose those with Continuum shared
  families plus the chosen engine family.

Echo is not subordinate to `git-warp`.
`git-warp` is not the durable half of Echo.
Both runtimes may store causal history, indexes, caches, retained readings,
checkpoints, and implementation-local materializations.
Neither runtime owns privileged graph truth at the Continuum boundary.

A Continuum runtime is any implementation that can publish, admit, observe,
export, and import witnessed causal history according to Continuum contract
families and admission laws.

## App Model

Continuum is not the runtime engine for apps.

The intended extension story is:

- app authors declare domain GraphQL families
- app families compose with Continuum shared families and engine-local families
- Wesley compiles the composed family into target-language consumer artifacts
- the app runs on Echo, `git-warp`, or another conforming sibling runtime, not
  on Continuum itself

That means the app language is not fixed by doctrine. TypeScript is natural for
browser, tool, and `warp-ttd` surfaces. Rust is natural for runtime-facing
integration. But the semantic source of truth is the authored GraphQL family,
so any language with a supported generated surface can be a valid app target.

## Success Condition

Continuum succeeds when a developer or agent can answer these questions in one
 place:

- which repo owns this noun?
- which schema is canonical?
- what witness proves these generated legs agree?
- what scenarios prove Echo and `git-warp` tell one story through `warp-ttd`?
- what changed in the shared coordination surface?

The canonical invariant surface for those answers lives in
[docs/invariants/CONTINUUM.md](invariants/CONTINUUM.md).

## Failure Mode To Avoid

Continuum fails if it becomes another runtime, another shadow engine SDK, or
another place where the same nouns are renamed and re-explained.

# VISION

Continuum is the shared coordination layer across the current stack.

## Roles

- Echo owns hot execution/runtime truth.
- `git-warp` owns cold causal/storage truth.
- `warp-ttd` owns shared debugger and operator surfaces.
- Wesley owns compilation, publication boundaries, and conformance/witness
  lanes for shared contract families.
- Continuum owns the cross-repo glue:
  shared vocabulary, ownership maps, authored shared contract families,
  compatibility truth, and integration scenarios.
- Apps own their own domain families and compose those with Continuum shared
  families plus the chosen engine family.

## App Model

Continuum is not the runtime engine for apps.

The intended extension story is:

- app authors declare domain GraphQL families
- app families compose with Continuum shared families and engine-local families
- Wesley compiles the composed family into target-language consumer artifacts
- the app runs on Echo or `git-warp`, not on Continuum itself

That means the app language is not fixed by doctrine. TypeScript is natural for
browser, tool, and `warp-ttd` surfaces. Rust is natural for Echo-facing runtime
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

## Failure Mode To Avoid

Continuum fails if it becomes another runtime, another shadow engine SDK, or
another place where the same nouns are renamed and re-explained.

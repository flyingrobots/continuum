# VISION

Continuum is the shared coordination layer across the current stack.

## Roles

- Echo owns hot execution/runtime truth.
- `git-warp` owns cold causal/storage truth.
- `warp-ttd` owns shared debugger and operator surfaces.
- Wesley owns authored contract families, publication boundaries, and
  conformance/witness lanes.
- Continuum owns the cross-repo glue:
  shared vocabulary, ownership maps, compatibility truth, and integration
  scenarios.

## Success Condition

Continuum succeeds when a developer or agent can answer these questions in one
 place:

- which repo owns this noun?
- which schema is canonical?
- what witness proves these generated legs agree?
- what scenarios prove Echo and `git-warp` tell one story through `warp-ttd`?
- what changed in the shared coordination surface?

## Failure Mode To Avoid

Continuum fails if it becomes another runtime, another schema home, or another
 place where the same nouns are renamed and re-explained.

# Continuum

Continuum is the coordination membrane across Echo, `git-warp`, `warp-ttd`,
and Wesley.

It does not exist to become a third independent system. It exists to keep the
active systems aligned:

- shared doctrine
- shared contract and publication-boundary truth
- cross-repo invariants
- witness and compatibility work
- integration scenarios and golden traces

Continuum is **not** the engine layer for apps.

The intended stack is:

- Continuum owns shared semantics and authored shared contract families
- Wesley compiles those families into Rust, TypeScript, codecs, manifests, and
  witnesses
- Echo or `git-warp` is the runtime/engine layer
- apps compose their own domain GraphQL with Continuum shared families and the
  chosen engine family

That means app authors should extend the engine they are actually running on,
while consuming Continuum-defined shared contracts through Wesley-generated
artifacts. Continuum does not require TypeScript or Rust as the one true app
language. The stable extension surface is the authored GraphQL family plus the
generated consumer artifacts for whatever target language the stack supports.

The seed salvage from the old repo is in [GoodIdeas.md](GoodIdeas.md).

Current direction lives in:

- [docs/BEARING.md](docs/BEARING.md)
- [docs/VISION.md](docs/VISION.md)
- [docs/invariants/CONTINUUM.md](docs/invariants/CONTINUUM.md)
- [METHOD.md](METHOD.md)

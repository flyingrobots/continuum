# AGENTS.md

## Role

Continuum is the coordination spine for the active stack. It does not own a hot
 runtime, a cold substrate, or a parallel ontology. It owns shared truth across
 Echo, `git-warp`, `warp-ttd`, and Wesley.

## Git Safety

- Never amend commits.
- Never rebase.
- Never force git operations.
- Stage only the files written in the current turn.
- Commit each completed slice in the same turn.

## Process

- Read [METHOD.md](METHOD.md) before changing structure.
- Keep active work in `docs/design/`.
- Keep concrete work in `docs/method/backlog/`.
- Keep retros in `docs/method/retro/`.
- Update [docs/BEARING.md](docs/BEARING.md) and [docs/VISION.md](docs/VISION.md)
  only at cycle boundaries.

## Doctrine

- Continuum owns coordination truth, not substrate truth.
- Shared nouns need one authored home and explicit publication boundaries.
- Cross-repo witness and compatibility truth beats hand-wavy alignment claims.
- No shadow schemas, no shadow vocabularies, no shadow ownership.

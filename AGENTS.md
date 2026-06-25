# AGENTS.md

## Role

Continuum is the coordination spine for the active stack. It does not own a
runtime implementation, a substrate, or a parallel ontology. It owns shared
truth across Echo, `git-warp`, `warp-ttd`, and Wesley.

## Git Safety

- Never amend commits.
- Never rebase.
- Never force git operations.
- Stage only the files written in the current turn.
- Commit each completed slice in the same turn.

## Process

- Keep concrete work in `docs/method/backlog/` and retros in
  `docs/method/retro/`.
- Update [docs/BEARING.md](docs/BEARING.md) and [docs/VISION.md](docs/VISION.md)
  only at cycle boundaries.

## Documentation

- All documentation follows the
  [Continuum Documentation Standard](docs/DOCUMENTATION_POLICY.md). Read it
  before adding or changing docs.
- Durable truth lives in reader-task pages under `docs/` organized by reader
  need (today `docs/how-to/` and `docs/invariants/`; reference and explanation
  shelves are being lifted out of the design log), not in the design log.
- `docs/design/` is a **frozen historical decision log**. Do not add new packets
  there. Record new decisions as a one-screen ADR-lite note or a `CHANGELOG.md`
  line.
- Run the documentation gate before committing doc changes:
  `node scripts/docs-lint.mjs`.

## Testing

- Tests assert **software behavior only** — return values, state, observable
  API behavior. Never assert on stdout/help text, Markdown, generated output, or
  repo artifacts as strings (see [CONTRIBUTING.md](CONTRIBUTING.md) "Testing
  principle"). Doc/artifact checks belong in `scripts/docs-lint.mjs`, not the
  test suite.
- "Tests are the spec": do not alter, skip, or circumvent a failing test to
  unblock yourself. If a test looks wrong (e.g. it asserts on an artifact), stop
  and flag it rather than rewriting it silently.

## Doctrine

- Continuum owns coordination truth, not substrate truth.
- Shared nouns need one authored home and explicit publication boundaries.
- Cross-repo witness and compatibility truth beats hand-wavy alignment claims.
- No shadow schemas, no shadow vocabularies, no shadow ownership.

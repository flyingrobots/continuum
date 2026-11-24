# Contributing to Continuum

Continuum is the coordination spine for a causal-computing stack. It owns shared
truth across the stack (Echo, `git-warp`, Wesley, `warp-ttd`, WARP DRIVE, Graft,
Edict, `jedit`, xyph); it does **not** own any runtime, substrate, or app. Keep
contributions on the boundary Continuum owns and link outward for everything
below it.

## Documentation

All documentation follows the
[Continuum Documentation Standard](docs/DOCUMENTATION_POLICY.md). Read it before
adding or changing docs. In short:

- Durable truth lives in **reader-task pages** under `docs/` (today
  `docs/how-to/` and `docs/invariants/`; reference and explanation shelves are
  being lifted out of the design log), organized by what a reader is trying to
  do — not by source layout.
- `docs/design/` is a **frozen historical decision log**. Do not add new packets.
  Record a new decision as a one-screen ADR-lite note or a `CHANGELOG.md` line.
- Each capability is held to the coverage matrix in the standard; `not needed` is
  a valid, reasoned answer.
- New or changed docs are registered in [`docs/catalog.yaml`](docs/catalog.yaml).
- Start at the [documentation index](docs/index.md) to find the right page.

## Git

- Branch off `main`; never commit directly to `main`.
- **Never** rebase, force-push, amend, or squash. Make a new commit instead.
- Do not delete or unstage files you did not create.
- Use [Conventional Commits](https://www.conventionalcommits.org/) (for example
  `docs: …`, `fix: …`, `feat: …`).
- Update `CHANGELOG.md` under `## Unreleased` for any observable change.

## Checks

Run the documentation gate before committing doc changes, and the test suite
before pushing:

```bash
node scripts/docs-lint.mjs
node --test 'apps/warp/test/**/*.test.mjs'
```

Enable the versioned pre-commit hook once per checkout:

```bash
sh scripts/setup-hooks.sh
```

After that setup, the `pre-commit` hook runs the documentation gate
automatically. CI runs both checks on pull requests.

## Testing principle

Tests assert **software behavior**: return values, state transitions, data
structures, and the artifacts the software produces. Test what the software
*does*, not the exact strings it happens to print.

A test **must not** assert on incidental text:

- stdout/stderr or help/usage strings (the exact wording printed to a console),
- Markdown, README, or other prose matched as a string.

Those assertions are fragile — they break on cosmetic edits and create friction
every time a message or workflow changes. Checks over documentation belong in a
**separate gate** (`scripts/docs-lint.mjs`), never in the behavior test suite.

It **is** fine to assert that the software produced a generated artifact — code,
a schema, a lockfile, a structured report — because producing it is the
behavior. Assert the artifact's structured contract (parsed fields, the presence
of an expected symbol), not its incidental formatting. Within reason: a
template that substitutes a project name into a file is behavior worth checking;
a fixed sentence of prose in that file is not.

If you find a test asserting on incidental strings, flag it rather than silently
rewriting it — see the "Tests are the spec" rules in [AGENTS.md](AGENTS.md).

## Evidence discipline

A compatibility claim is only as strong as its recorded evidence. Record a gap as
a gap; never advance a registry row to make a claim aspirationally true; never
present translated substrate evidence as a native Continuum witness. See the
[contract family registry](docs/contract-family-registry.md).

## Agents

Automated contributors should also read [AGENTS.md](AGENTS.md).

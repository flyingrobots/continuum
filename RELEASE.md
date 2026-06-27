# Release process

This repo follows the
[Continuum Release Lifecycle and Runbook](docs/method/release-runbook.md).

Repo-specific release mechanics are declared in:

```text
.continuum/release.yml
```

## Current posture

The release profile is declared, but this repo does not yet have dedicated
release-prep, autotag, or publish workflows. Current validation is the existing
docs gate plus the `apps/warp` test suite.

## Release shape

The target release shape is:

```text
branch -> PR -> merge -> autotag -> publish -> verify -> retrospective
```

Until release automation exists, manual tagging is allowed only as the runbook's
fallback path and must not bypass failed gates.

## Local validation

```bash
node scripts/docs-lint.mjs
node --test 'apps/warp/test/**/*.test.mjs'
```

## Release branch

```bash
git checkout main
git pull --ff-only
git checkout -b release/vX.Y.Z
```

## Manual fallback

Manual tagging is allowed only when autotag cannot run and must not bypass failed
gates.

```bash
node scripts/docs-lint.mjs
node --test 'apps/warp/test/**/*.test.mjs'
git tag -a vX.Y.Z -m "release: vX.Y.Z"
git push origin vX.Y.Z
```

Do not move public tags. Patch forward.

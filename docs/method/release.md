# Release

Continuum release work is documentation and coordination release work.

The canonical lifecycle is the
[Continuum Release Lifecycle and Runbook](release-runbook.md). Repo-local
mechanics are declared in [`.continuum/release.yml`](../../.continuum/release.yml)
and summarized in [`RELEASE.md`](../../RELEASE.md).

Release slices should answer:

- which shared contracts or invariants changed
- which repos are affected
- what witness or compatibility state changed
- whether downstream consumers need to react

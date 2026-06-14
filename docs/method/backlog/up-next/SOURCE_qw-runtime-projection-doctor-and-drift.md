---
title: QW Runtime Projection Doctor And Drift
status: proposed
source: docs/design/0033-warpspace-runtime-projection-and-qw-install/README.md
---

# QW Runtime Projection Doctor And Drift

## Problem

The first `qw install` runtime cut can write `.devcontainer/devcontainer.json`
from `[runtime.default]`, but it does not yet detect runtime drift.

That leaves three follow-up gaps:

- `.devcontainer/devcontainer.json` can be edited by hand without warning
- runtime image references are not resolved to digests
- `qw doctor` does not report whether the generated runtime projection still
  matches `warpspace.toml` and `warpspace.lock.json`

## Hill

Teach `qw doctor` to inspect runtime projection state and report whether the
generated devcontainer matches the WARPspace runtime profile.

## Acceptance

- `qw doctor` reports missing, matching, and drifted devcontainer projection
  state.
- The report names the source runtime profile and generated file path.
- Runtime drift is reported separately from repo checkout drift.
- Image digest resolution is recorded when available, but host-specific paths
  stay out of canonical lock scope.
- A user can repair runtime drift with `qw install` or a future lower-level
  runtime materialization command.

## Non-Goals

- Do not require Docker to be running for basic drift checks.
- Do not make `.devcontainer/` the source of truth.
- Do not mount undeclared sibling repos just because they exist on the host.

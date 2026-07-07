# 0034 - `qw runtime` Projection Commands

## Status

Implemented in the first local-only cut.

## Context

`qw install` already knows how to turn a `[runtime.default]` declaration from a
WARPspace lock into local runtime files. For the Jim WARPspace, that currently
means writing `.devcontainer/devcontainer.json` so the same source constellation
can be edited on the host and run through a container mounted at
`/warpspaces/jim`.

That projection is useful, but it is not identity. The durable source world is
the WARPspace lock plus typed `warp://` locators. The devcontainer file is local
machine state derived from the lock.

## Decision

`qw runtime` owns runtime projection files as generated local state.

The first command set is:

```bash
qw runtime materialize [warpspace.lock.json] [--root <dir>]
qw runtime verify [warpspace.lock.json] [--root <dir>]
qw runtime doctor [warpspace.lock.json] [--root <dir>]
```

If the lock path is omitted, commands default to `warpspace.lock.json` in the
current working directory.

## Boundaries

`qw runtime materialize`:

- reads `warpspace.lock.json`
- reads `[runtime.default]`
- writes the local projection for supported runtime kinds
- currently supports `kind = "devcontainer"`
- does not refresh the lock
- does not sync repos
- does not start containers

`qw runtime verify`:

- computes the expected projection from the lock
- checks whether the local projection file exists
- reports drift for image, mount, workspace folder, workspace mount, and
  environment values

`qw runtime doctor`:

- wraps runtime verification in a doctor-shaped result
- keeps the door open for richer runtime diagnostics later

## Non-Goals

- No Docker or Dev Container CLI orchestration yet.
- No remote runtime provisioning.
- No canonical path identity in devcontainer paths.
- No attempt to treat `/warpspaces/...` as truth.

## Invariant

Runtime projection files are disposable local outputs. If they disagree with
`warpspace.lock.json`, the lock wins.

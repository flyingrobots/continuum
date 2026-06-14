# Warp

`qw` is the user-facing WARPspace CLI binary. The product/domain name remains
Warp/WARPspace, and the prototype still lives under `apps/warp`.

It lives in Continuum because Continuum owns:

- stack manifests
- WARPspace templates
- bootstrap and update doctrine
- the question "how does a developer start a Continuum app?"

`qw` does **not** own compilation. It orchestrates bootstrap, lockfiles,
template materialization, and toolchain handoff. Wesley remains the compiler
that `qw` invokes internally.

If you want the product-level statement of intent and the current truthful
status, read [VISION.md](./VISION.md).

The current JS implementation is a repo-local proof harness.
The permanent shipped product target is a standalone `qw` binary, as
described in [0025 - Warp Native Distribution And Node Runtime Policy](../../docs/design/0025-warp-native-distribution-and-node-runtime-policy/README.md).

## Current Commands

Prototype commands available here today:

- `qw init`
- lower-level pieces for the future `qw install` flow:
  - `qw warpspace lock`
  - `qw warpspace verify`
  - `qw warpspace sync`
  - `qw warpspace doctor`

Current posture:

- local-first
- default profile built into the repo is `demo`
- writes `warpspace.toml` and `warpspace.lock.json`
- scaffolds the demo host template
- materializes Continuum family sources into the host repo
- stages the current-process Node runtime under `.warpspace/packages/node/`
- stages the Wesley tool declared by the stack manifest under
  `.warpspace/packages/wesley/`
- invokes Wesley through those staged paths using the real `warpspace.toml`
- supports both the legacy Node Wesley entrypoint (`.mjs` via Node) and the
  native Rust Wesley binary runner (direct binary execution); new Wesley work
  should target the Rust runner
- supports manifest-declared package source sites, including a `local-packages`
  source used in tests and local proof work
- supports a narrow constellation flow for pinned Git repos:
  `qw warpspace lock <manifest.toml>` writes a JSON lock, `verify` checks
  local checkouts, `sync` clones/fetches/checks out the locked commits, and
  `doctor` reports verification health

Product target:

- `warpspace.toml` should be the package-manifest-shaped file for `qw`
- `warpspace.lock.json` should be the lock output
- `qw install` should become the user-facing command that reads
  `warpspace.toml`, refreshes the lock, materializes source checkouts and
  managed toolchain state, then verifies the WARPspace
- the current `qw warpspace lock/sync/verify/doctor` commands remain the
  lower-level primitives behind that flow

## Run It

When the package is linked or installed:

```bash
qw init my-app --profile demo
qw warpspace lock docs/warpspaces/jedit-echo-dev.toml --lock /tmp/jedit-echo-dev.lock.json
qw warpspace sync /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
qw warpspace verify /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
```

For repo-local development before packaging, the same CLI can be invoked with:

```bash
node apps/warp/bin/warp.mjs --help
```

# Warp

`warp` is the user-facing WARPspace CLI.

It lives in Continuum because Continuum owns:

- stack manifests
- WARPspace templates
- bootstrap and update doctrine
- the question "how does a developer start a Continuum app?"

`warp` does **not** own compilation. It orchestrates bootstrap, lockfiles,
template materialization, and toolchain handoff. Wesley remains the compiler
that `warp` invokes internally.

If you want the product-level statement of intent and the current truthful
status, read [VISION.md](./VISION.md).

The current JS implementation is a repo-local proof harness.
The permanent shipped product target is a standalone `warp` binary, as
described in [0025 - Warp Native Distribution And Node Runtime Policy](../../docs/design/0025-warp-native-distribution-and-node-runtime-policy/README.md).

## Current Commands

Prototype commands available here today:

- `warp init`
- `warp warpspace lock`
- `warp warpspace verify`
- `warp warpspace sync`
- `warp warpspace doctor`

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
- supports both the legacy Node Wesley entrypoint and the native Rust Wesley
  binary runner; new Wesley work should target the Rust runner
- supports manifest-declared package source sites, including a `local-packages`
  source used in tests and local proof work
- supports a narrow constellation flow for pinned Git repos:
  `warp warpspace lock <manifest.toml>` writes a JSON lock, `verify` checks
  local checkouts, `sync` clones/fetches/checks out the locked commits, and
  `doctor` reports verification health

## Run It

From this repo:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
node apps/warp/bin/warp.mjs warpspace lock docs/warpspaces/jedit-echo-dev.toml
node apps/warp/bin/warp.mjs warpspace sync docs/warpspaces/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
node apps/warp/bin/warp.mjs warpspace verify docs/warpspaces/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
```

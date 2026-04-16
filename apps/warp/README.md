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
status, read [VISION.md](/Users/james/git/continuum/apps/warp/VISION.md).

The current JS implementation is a repo-local proof harness.
The permanent shipped product target is a standalone `warp` binary, as
described in [0025 - Warp Native Distribution And Node Runtime Policy](../../docs/design/0025-warp-native-distribution-and-node-runtime-policy/README.md).

## Current Commands

Prototype commands available here today:

- `warp init`

Current posture:

- local-first
- default profile built into the repo is `demo`
- writes `warpspace.toml` and `warpspace.lock.json`
- scaffolds the demo host template
- materializes Continuum family sources into the host repo
- stages the current-process Node runtime under `.warpspace/packages/node/`
- stages the sibling Wesley entrypoint declared by the demo manifest under
  `.warpspace/packages/wesley/`
- invokes Wesley through those staged paths using the real `warpspace.toml`
- supports manifest-declared package source sites, including a `local-packages`
  source used in tests and local proof work

## Run It

From this repo:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
```

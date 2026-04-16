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

## Current Commands

Prototype commands available here today:

- `warp init`

Current posture:

- local-first
- default profile built into the repo is `demo`
- writes `warpspace.toml` and `warpspace.lock.json`
- scaffolds the demo host template
- materializes Continuum family sources into the host repo
- writes an ignored `.warpspace.wesley.mjs` bridge file while Wesley still
  expects `warpspace.mjs`
- optionally calls Wesley when `--wesley-bin` is provided

## Run It

From this repo:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
```

To also run the current Wesley generator proof:

```bash
node apps/warp/bin/warp.mjs init my-app \
  --profile demo \
  --wesley-bin ../wesley/packages/wesley-host-node/bin/wesley.mjs
```

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
- `qw install`
- lower-level pieces behind the install flow:
  - `qw warpspace lock`
  - `qw warpspace verify`
  - `qw warpspace sync`
  - `qw warpspace doctor`
  - `qw warpspace locate`

Current posture:

- local-first
- default profile built into the repo is `demo`
- writes `warpspace.toml` and `warpspace.lock.json`
- scaffolds the demo host template
- materializes Continuum family sources into the host repo
- the `demo` profile resolves the crates.io Wesley CLI (`cargo install wesley-cli`)
  from `PATH` via the `crate` install source and invokes it natively (no Node
  required); the resolution is recorded as a receipt under `.warpspace/packages/wesley/`
- Wesley install sources: `crate` (resolve the crates.io binary from `PATH`),
  `local-sibling-binary` (a built Rust binary), `package-source` (staged from a
  declared source site), and the legacy `local-sibling-entrypoint` (Node `.mjs`,
  now unused since Wesley is a Rust crate)
- when a profile needs Node (legacy paths only), stages the current-process Node
  runtime under `.warpspace/packages/node/`
- supports manifest-declared package source sites, including a `local-packages`
  source used in tests and local proof work
- supports a narrow constellation flow for pinned Git repos:
  `qw warpspace lock <manifest.toml>` writes a JSON lock, `verify` checks
  local checkouts, `sync` clones/fetches/checks out the locked commits, and
  `doctor` reports verification health
- supports a first TACHYON locator flow:
  `qw warpspace locate <path>` converts a runtime path projection into a typed
  `warp://` locator scoped to repos declared in `warpspace.lock.json`
- supports a first `qw install` cut for constellation-style
  `warpspace.toml` files: it refreshes `warpspace.lock.json`, syncs declared
  repo checkouts, writes `.devcontainer/devcontainer.json` for a
  `[runtime.default]` devcontainer profile, and verifies the result

Product target:

- `warpspace.toml` should be the package-manifest-shaped file for `qw`
- `warpspace.lock.json` should be the lock output
- `qw install` is the user-facing command that reads `warpspace.toml`,
  refreshes the lock, materializes source checkouts and runtime projection
  state, then verifies the WARPspace
- managed toolchain installation under `.warpspace/` is still incomplete for
  constellation-style installs
- the current `qw warpspace lock/sync/verify/doctor` commands remain the
  lower-level primitives behind that flow

## Run It

When the package is linked or installed:

```bash
qw init my-app --profile demo
qw install
qw warpspace lock docs/warpspaces/jedit-echo-dev.toml --lock /tmp/jedit-echo-dev.lock.json
qw warpspace sync /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
qw warpspace verify /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
qw warpspace locate ../echo/src/lib.rs --lock warpspace.lock.json --root /warpspaces/jim --cwd /warpspaces/jim/jedit --json
```

For repo-local development before packaging, the same CLI can be invoked with:

```bash
node apps/warp/bin/warp.mjs --help
```

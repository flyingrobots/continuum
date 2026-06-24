---
title: qw command reference
status: current
---

# qw command reference

`qw` is the user-facing WARPspace CLI. This page is the exact command surface;
for the product story and what is and is not finished, see
[apps/warp/VISION.md](../../apps/warp/VISION.md); for a guided first run see
[Getting Started](../GETTING_STARTED.md).

When the package is linked or installed the binary is `qw`. For repo-local
development the same CLI runs as `node apps/warp/bin/warp.mjs`.

Top-level commands are `init`, `install`, and `warpspace <subcommand>`. Any
other command prints usage and exits non-zero. Every command accepts `-h` /
`--help`.

## `qw init`

```text
qw init <projectDir> [--profile <id>] [--manifest <path>] [--authority-root <p>]
        [--skip-generate] [--force] [--json] [-q|--quiet]
```

Bootstraps a new WARPspace into `<projectDir>` (exactly one directory required).
Writes `warpspace.toml` and `warpspace.lock.json`, stages the managed toolchain
under `.warpspace/`, materializes the first shared family into
`contracts/continuum/`, and invokes Wesley to generate host outputs.

| Flag | Effect |
| --- | --- |
| `--profile <id>` | Use a built-in release profile such as `demo`. |
| `--manifest <path>` | Stack release manifest (`continuum-stack-release.json`). |
| `--authority-root <p>` | Override the Continuum authored-home root. |
| `--skip-generate` | Do not invoke Wesley during bootstrap. |
| `--force` | Initialize into a non-empty target directory. |
| `--json` | Emit structured JSON. |
| `-q`, `--quiet` | Suppress success text. |

## `qw install`

```text
qw install [warpspace.toml] [--manifest <path>] [--root <dir>] [--lock <path>]
           [--allow-dirty] [--skip-sync] [--json] [-q|--quiet]
```

Reads a constellation-style `warpspace.toml` (positional or `--manifest`, not
both), refreshes `warpspace.lock.json`, syncs declared repo checkouts, writes a
devcontainer runtime projection when `[runtime.default]` declares one, and
verifies the result. Manifest defaults to `warpspace.toml`.

| Flag | Effect |
| --- | --- |
| `--manifest <path>` | Manifest path (alternative to the positional). |
| `--root <dir>` | WARPspace root. |
| `--lock <path>` | Lock output path. |
| `--allow-dirty` | Permit a dirty working tree during verification. |
| `--skip-sync` | Skip syncing declared repo checkouts. |
| `--json` | Emit structured JSON (exit code follows `ok`). |
| `-q`, `--quiet` | Suppress success text. |

## `qw warpspace`

Lower-level primitives behind the install flow. Each takes exactly one
positional path.

```text
qw warpspace lock   <manifest.toml>        [--lock <path>] [--json]
qw warpspace verify <warpspace.lock.json>  [--root <dir>] [--allow-dirty] [--json]
qw warpspace sync   <warpspace.lock.json>   --root <dir>  [--json]
qw warpspace doctor <warpspace.lock.json>  [--root <dir>] [--allow-dirty] [--json]
qw warpspace locate <path>                 [--lock <path>] [--root <dir>] [--cwd <dir>] [--basis <ref>] [--json]
```

| Subcommand | Result |
| --- | --- |
| `lock` | Resolve a manifest's pinned Git coordinates and write a JSON lock. |
| `verify` | Check local checkouts against the lock; exit non-zero on mismatch. |
| `sync` | Clone/fetch/checkout the locked commits (`--root` required). |
| `doctor` | Report verification health; exit non-zero when not ok. |
| `locate` | Convert a runtime path into a typed `warp://` locator scoped to repos in the lock (the TACHYON resolver surface). |

## Commands that do not exist yet

`qw build`, `qw doctor` (top-level), and `qw update` are referenced as product
intent but are **not implemented**. The only `doctor` today is
`qw warpspace doctor`. See [apps/warp/VISION.md](../../apps/warp/VISION.md).

## Examples

```bash
qw init my-app --profile demo
qw install
qw warpspace lock docs/warpspaces/jedit-echo-dev.toml --lock /tmp/jedit-echo-dev.lock.json
qw warpspace sync /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
qw warpspace verify /tmp/jedit-echo-dev.lock.json --root ~/warpspaces/jedit-echo-dev
```

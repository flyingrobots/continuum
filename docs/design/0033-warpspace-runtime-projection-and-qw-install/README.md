---
title: WARPspace Runtime Projection And QW Install
status: archived
---

# WARPspace Runtime Projection And QW Install

**Cycle:** 0033-warpspace-runtime-projection-and-qw-install
**Legend:** SOURCE
**Type:** coordination cycle
**Sponsor Human:** Warpspace maintainer/runtime author
**Sponsor Agent:** Implementation and review agent
**Impacted Repos:** Continuum, jedit

## Hill

Define the devcontainer as a runtime projection of a WARPspace, then make
`qw install` the first concrete command that materializes that projection from
`warpspace.toml`.

This packet answers the practical question:

**If a WARPspace declares a source constellation and a runtime container, what
owns that declaration, what gets generated, and what remains local
projection rather than canonical identity?**

## Why This Exists

Jim/Jedit exposes the same path problem as Echo canonical history:

- the host sees `/Users/james/git/jim`
- the runtime container sees `/warpspaces/jim`
- Jedit edits sibling repos inside that projected root
- Echo/Jedit history must not hash either absolute path as durable truth

The devcontainer is useful because it can keep Rust, Node, native tools, and
runtime filesystem scope out of the host. It is dangerous only if it becomes
the source of truth for what the WARPspace is.

The source of truth must stay in the WARPspace:

- `warpspace.toml` declares the world
- `warpspace.lock.json` pins exact resolved identities
- `.devcontainer/` is a generated runtime projection
- `.warpspace/` is local managed install/cache state

## Decision

### 1. The devcontainer is a runtime projection

A devcontainer is not the WARPspace. It is one runnable projection of the
WARPspace.

It may define:

- container image
- toolchain environment
- workspace mount point
- runtime environment variables
- post-create or setup commands in later cuts

It must not define:

- canonical source identity
- repo membership
- path normalization rules
- observer-basis truth
- Echo/Jedit causal history payloads

The preferred mount for Jim-style WARPspaces is:

```text
/warpspaces/<name>
```

For Jim:

```text
host:      /Users/james/git/jim
container: /warpspaces/jim
```

Both are runtime projections. Neither is ontology.

### 2. `warpspace.toml` owns runtime intent

Runtime intent belongs in the checked-in WARPspace manifest:

```toml
[runtime.default]
kind = "devcontainer"
mount = "/warpspaces/jim"

[runtime.default.image]
ref = "ghcr.io/flyingrobots/jim-runtime:2026-06-14"

[runtime.default.env]
JIM_WARPSPACE_ROOT = "/warpspaces/jim"
```

Devcontainer runtime profiles must declare both `[runtime.default].mount` and
`[runtime.default.image]`. The mount must be an absolute comma-free container
path. `qw install` refuses to guess a mount or generic base image because the
filesystem horizon and runtime toolchain are part of the projection contract.
`[runtime.default.env]` values must be strings, numbers, or booleans so the
generated `remoteEnv` cannot silently collapse arrays or tables.

The generated devcontainer should use portable editor/container substitution
variables, not host absolute paths.

For example:

```json
{
  "workspaceFolder": "/warpspaces/jim",
  "workspaceMount": "source=${localWorkspaceFolder},target=/warpspaces/jim,type=bind,consistency=cached"
}
```

### 3. `warpspace.lock.json` carries resolved runtime facts

The lock should preserve the runtime profile that `qw` used when it
materialized local files. Later cuts can add image digests and setup receipts.

The first cut records:

- runtime kind
- mount path
- image reference
- runtime environment

When a refresh resolves to the same lock content, `qw install` preserves the
existing `lockedAt` value so repeated installs do not churn the lock file on
timestamp alone.

Later cuts should add:

- image digest
- generated file digest
- setup command receipts
- host-local projection binding outside hash scope

### 4. `qw install` is the package-manager-shaped entry point

The boring happy path should be:

```bash
git clone <jim-envelope-repo> jim
cd jim
qw install
```

For the first source-constellation cut, `qw install` does this:

1. read `warpspace.toml`
2. write or refresh `warpspace.lock.json`
3. materialize declared sibling repos through the lock
4. write `.devcontainer/devcontainer.json` for a devcontainer runtime profile
5. verify the resulting WARPspace

This intentionally composes the lower-level proof commands:

```text
qw warpspace lock
qw warpspace sync
qw warpspace verify
```

Those lower-level commands remain useful for debugging and CI.

### 5. Dirty checkout safety stays mandatory

`qw install` may move checkouts to locked revisions. It must not do that over
uncommitted work.

The first cut inherits the existing `qw warpspace sync` safety rule:

- clean existing checkouts may be fetched and checked out to the lock
- dirty existing checkouts stop the install
- missing checkouts may be cloned

This is acceptable for a fresh envelope repo. Later cuts can add an
adopt/update mode for active development workspaces where checking out a clean
branch is too disruptive.

## Non-Goals

- Do not make devcontainer config canonical source identity.
- Do not mount the whole host `~/git` tree into the runtime by default.
- Do not make TACHYON a devcontainer concern.
- Do not put raw host paths into lock hash scope.
- Do not implement full managed toolchain installation in this cut.

## Smallest Honest Artifact

This cycle is proved by:

- `qw install` command support in `apps/warp`
- lock preservation of `[runtime.default]`
- `.devcontainer/devcontainer.json` generation from `warpspace.toml`
- tests proving install, sync, verify, and runtime generation together
- docs that state the devcontainer is a projection, not the WARPspace

## Playback Questions

1. Does `warpspace.toml` now have enough vocabulary to declare a runtime
   projection without making the runtime authoritative?
2. Is `qw install` the right user-facing verb for source constellation
   materialization plus runtime projection generation?
3. Do we need an explicit `qw runtime materialize` subcommand, or should that
   stay an internal step behind `qw install` until users need the lower-level
   surface?

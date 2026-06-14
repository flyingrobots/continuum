---
title: Warp Install From Warpspace TOML
status: proposed
source: docs/design/0024-warp-cli-and-warpspace-toml/README.md
---

# Warp Install From Warpspace TOML

## Problem

`qw` has the right manifest and lockfile names, and the first source
constellation install cut exists. The user-facing install verb still needs to
graduate into the full managed toolchain path.

The intended mental model should be as boring as Node:

```text
package.json       -> npm install      -> package-lock.json + node_modules/
warpspace.toml     -> qw install       -> warpspace.lock.json + .warpspace/
```

For source constellations such as Jim/Jedit, `qw install` must also
materialize declared sibling checkouts:

```text
warpspace.toml     -> qw install       -> jedit/ echo/ wesley/ ... + lock
```

The first source-constellation cut now exists as `qw install`. Before that,
the flow was split across lower-level proof commands:

```text
qw warpspace lock
qw warpspace sync
qw warpspace verify
```

Those are useful primitives, but they are not the final user experience.

## Hill

Grow `qw install` from the current constellation/runtime projection proof into
the full install command that reads the current directory's `warpspace.toml`,
resolves a lock, materializes declared source and managed toolchain state, and
leaves the WARPspace ready to run.

## Intended Semantics

`qw install` should:

1. Discover `warpspace.toml` from the current directory or an explicit path.
2. Resolve declared repos, packages, tools, templates, and local policy.
3. Write or refresh `warpspace.lock.json`.
4. Materialize declared sibling repos at the locked revisions.
5. Materialize declared runtime projection files such as `.devcontainer/`.
6. Install or stage managed toolchain artifacts under `.warpspace/`.
7. Preserve dirty checkout safety.
8. Verify the resulting WARPspace.
9. Emit machine-readable JSON with installed components, local projections, and
   unresolved issues.

## Non-Goals

- Do not replace `qw init`.
- Do not remove lower-level `qw warpspace lock/sync/verify/doctor` commands.
- Do not treat raw host/container paths as canonical identity.
- Do not make `warpspace.toml` executable.
- Do not hide compatibility or observer-basis facts inside ad hoc install
  scripts.

## Acceptance

- Running `qw install` in a directory with `warpspace.toml` is enough to
  recreate the declared WARPspace source constellation on a fresh machine or
  in a devcontainer.
- `warpspace.lock.json` is the single machine-written lock output.
- `[runtime.default]` can produce a checked-in or inspectable devcontainer
  projection.
- Existing lower-level commands remain available for debugging and CI.
- The Jim/Jedit Warpspace can be described as "run `qw install` here" rather
  than "manually clone these sibling repos and check out these SHAs."
- TACHYON remains the sanctioned path/locator boundary for any runtime paths
  discovered during install.

---
title: TACHYON Warpspace Resolver
status: proposed
source: docs/design/0032-tachyon-warpspace-resolution/README.md
---

# TACHYON Warpspace Resolver

Build the first `qw` implementation surface for TACHYON:

```text
Typed Addressing for Causal History, Yielding Observer-basis Normalization
```

## Problem

Warpspace paths currently resolve only as ordinary filesystem paths during
`qw warpspace` sync/verify flows. Jim/Jedit now needs a stronger boundary:
runtime paths from host shells, devcontainers, CI, and WARP DRIVE projections
must normalize into typed Warpspace locators before they can enter durable
causal evidence.

Without one resolver, apps will each invent their own path cleanup rules and
raw paths such as `/Users/...` or `/warpspaces/...` will eventually leak into
canonical history hash scope.

## Hill

Add a small shared resolver module and CLI command under `apps/warp` that
converts:

```text
runtime path + cwd + Warpspace root binding + observer/basis context
```

into:

```text
typed warp locator + basis relationship + local runtime projection metadata
```

## First Slice

1. Add resolver functions in `apps/warp/src/`.
2. Add a JSON CLI surface, probably:

   ```sh
   qw warpspace locate \
     --root /warpspaces/jim \
     --cwd /warpspaces/jim/jedit \
     ../echo/src/lib.rs \
     --json
   ```

3. Resolve paths only inside repos declared by `warpspace.lock.json`.
4. Return `runtimeProjection.hashScope = "excluded"`.
5. Reject undeclared siblings, symlink escapes, and paths outside the Warpspace
   unless a future explicit external policy says otherwise.
6. Add focused tests that prove host and container projections produce the same
   typed locator.

## Non-Goals

- Do not build WARP DRIVE.
- Do not teach Echo to normalize host paths.
- Do not turn `warpspace.lock.json` into the whole observer-basis model.
- Do not make Git SHAs the meaning of `warp@<basis-ref>://`.
- Do not use raw rendered locator strings as the only canonical internal form.

## Acceptance

- `qw warpspace locate` emits a typed `warp.locator.v1` object.
- The rendered display form uses `warp://`.
- Basis-qualified display uses `warp@<basis-ref>://` when a basis is supplied.
- Runtime absolute paths are present only in a local projection object marked
  outside hash scope.
- Tests include both `/Users/...`-style and `/warpspaces/...`-style roots
  resolving to the same locator.
- Documentation points Jedit, Echo adapters, and WARP DRIVE at this resolver as
  the only sanctioned runtime-path-to-Warpspace-locator conversion boundary.

# Continuum Wesley Module

This directory is the Continuum-owned home for Wesley module surfaces.

Right now it owns the module boundary and command registration surface for the
Continuum lane:

- `contract`
- `witness`
- `witness-continuum`
- `drift-watch`
- `observer-plan`

Current honest posture:

- this repo owns which Wesley surfaces belong to the Continuum module
- the concrete command implementations, support code, fixtures, and profile
  helpers now live here
- TTD protocol compilation now lives here under `wesley/ttd/`; generic Wesley
  no longer owns the protocol-family compiler implementation
- this module still imports generic Wesley base-platform pieces from the sibling
  Wesley repo through explicit relative paths
- generic Wesley loads no domain module by default; Continuum must be loaded
  explicitly through `WESLEY_MODULES`, `wesley.config.mjs`, or a higher-level
  wrapper such as `warp`

That is still a bridge, but it is now a much cleaner one: Wesley no longer owns
the Continuum command layer.

## Stack-Development Boundary

This module is not a Continuum runtime and does not make Continuum a runtime
facade. It is the Continuum-owned Wesley module surface for compiling and
witnessing Continuum contract families.

The current checkout layout is still stack-development oriented:

- Continuum lives at `../continuum`
- Wesley lives at `../wesley`
- the Node host CLI is normally
  `../wesley/packages/wesley-host-node/bin/wesley.mjs`

Set `WESLEY_CLI_PATH` if that host CLI lives somewhere else. Release packaging
should replace the sibling-relative imports with explicit package dependencies
before treating this module as standalone repo truth.

## Local Checks

The unit checks do not require the Wesley **host CLI**, but they do require the
Wesley base platform (`@wesley/core`). Install `@wesley/cli` and `@wesley/core`,
or set `WESLEY_REPO_ROOT` to a Wesley checkout, then run:

```bash
node --test wesley/test/*.test.mjs
```

Without a resolvable `@wesley/core` these tests fail to load (see
`wesley/support/wesley-deps.mjs`). They are therefore not run in this repo's CI,
which has no Wesley checkout.

The Bats checks require `bats`, the sibling Wesley host CLI, and the Continuum
module loaded through `WESLEY_MODULES`. The test helper sets `WESLEY_MODULES`
for this module and skips with a clear reason if the host CLI is unavailable:

```bash
bats wesley/test/*.bats
```

Current-minimum witness cases also require TTD and Echo minimum-surface schemas.
Those schemas are not tracked in this Continuum checkout, so those specific Bats
cases skip until the source schemas are promoted or supplied by the stack.

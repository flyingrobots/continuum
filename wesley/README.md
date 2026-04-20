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
- this module still imports generic Wesley base-platform pieces from the sibling
  Wesley repo through explicit relative paths
- generic Wesley loads no domain module by default; Continuum must be loaded
  explicitly through `WESLEY_MODULES`, `wesley.config.mjs`, or a higher-level
  wrapper such as `warp`

That is still a bridge, but it is now a much cleaner one: Wesley no longer owns
the Continuum command layer.

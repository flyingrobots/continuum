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
- the concrete command implementations still live in the Wesley repo
- this module imports those implementations through relative bootstrap paths
- Wesley prefers this foreign-owned module when the sibling Continuum repo is
  present and falls back to its internal bootstrap shim otherwise

That is a bridge, not the end state.

The next step after this handoff is to move the command implementations and
their Continuum-specific support code out of generic Wesley surfaces and into
Continuum-owned module code.

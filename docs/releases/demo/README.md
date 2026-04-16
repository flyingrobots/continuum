# Demo Stack Release

This directory holds the first concrete Continuum stack release artifact for
the `demo` WARPspace profile.

Primary artifact:

- [continuum-stack-release.json](continuum-stack-release.json)

## What This Is

This release artifact freezes one exact compatibility tuple for the current
neighborhood-core demo slice:

- Continuum neighborhood-core family `0.1.0`
- Wesley host tooling `0.1.0`
- Echo `warp-core` `0.1.1`
- `git-warp` `17.0.0`
- `warp-ttd` `0.1.0`

It also records:

- the family digest
- the default projections
- the default host output roots
- the expected checked-in WARPspace files
- the current local-override posture

## Current Posture

This is a **local sibling proof** of the future stack-release flow, not yet a
public packaged installer release.

That means:

- the compatibility tuple is concrete
- the selected repos and artifacts are explicit
- the current demo can anchor itself to this manifest
- the final `warpspace init` consumer flow is still a follow-on implementation

## Why It Matters

The point of this artifact is to bridge the gap between:

- abstract bootstrap doctrine in `0023`
- the newcomer story in `docs/GETTING_STARTED.md`
- and a tool that can actually resolve and materialize one WARPspace

Without a concrete release manifest, the installer story is still just prose.

---
title: Warp Native Distribution And Node Runtime Policy
status: proposed
---

# Warp Native Distribution And Node Runtime Policy

**Cycle:** 0025-warp-native-distribution-and-node-runtime-policy  
**Legend:** SOURCE  
**Type:** coordination cycle  
**Sponsor Human:** James  
**Sponsor Agent:** Codex  
**Impacted Repos:** Continuum, Wesley

## Hill

Freeze the permanent ship model for `warp` so the stack does not waste time on
an intermediate JS-first product path and does not leave the Node prerequisite
as ambient folklore.

Lock down:

- what the shipped `warp` artifact actually is
- what counts as a convenience installer versus the real product
- how `warp` satisfies the Node prerequisite needed for Wesley and TypeScript
  generation
- what gets recorded in `warpspace.lock.json`

This packet answers the practical question:

**If we ship `warp` correctly, what does the user install, and how do we make
sure the WARPspace has a compatible Node runtime before Wesley is invoked?**

## Why This Exists

The current Continuum-owned prototype proved the bootstrap boundary, but it is
still implemented as a local JS CLI.

That was useful for proving:

- manifest-driven bootstrap
- WARPspace template application
- `warpspace.toml`
- `warpspace.lock.json`
- Wesley handoff

It is **not** the desired shipped form.

There is no reason to ship an intermediate "install the JS CLI first" product
if the final product is already clear:

- `warp` should be one user-facing binary
- the rest of the stack should remain internal

At the same time, Wesley and the TypeScript generation path still require a
compatible Node runtime.
That prerequisite must become explicit policy.

## Decision

### 1. The permanent shipped product is a standalone `warp` binary

The canonical shipped artifact is:

- a platform-native `warp` binary

Examples:

- `warp-darwin-arm64`
- `warp-darwin-x64`
- `warp-linux-x64`
- `warp-linux-arm64`

Possible wrappers may still exist:

- Homebrew formula
- OS package
- installer script

But those are only convenience distribution paths.
They are **not** the product.

The product is the `warp` binary itself.

### 2. Do not ship the JS prototype as the permanent user path

The current JS implementation in Continuum remains a proving harness.

It should not become the long-term customer-facing release posture.

That means:

- no "Phase 1 ship the Node CLI and clean it up later" plan
- no npm package as the primary product boundary
- no bash script as the primary product boundary

The repo-local JS CLI is allowed to continue as an implementation proof while
the native bootstrapper is designed or built.

### 3. `warp` must ensure a compatible Node runtime exists before Wesley handoff

Wesley and the TypeScript/Zod/TTD generation path require a compatible Node
runtime.

That means `warp` must own a first-class **Node runtime policy**.

The rule is:

- `warp` may not invoke Wesley until it has established a compatible Node
  runtime for the current WARPspace

This is not optional environment folklore.
It is part of successful bootstrap and build.

### 4. Released profiles should default to a managed Node runtime

For released profiles, the default policy is:

- `managed`

Meaning:

- `warp` installs a pinned Node runtime into `.warpspace/packages/`
- `warp` invokes Wesley through that managed runtime
- the selected Node version and install receipt are recorded in
  `warpspace.lock.json`

Why:

- reproducibility beats ambient workstation drift
- the stack already wants pinned compatible toolchain tuples
- Node is a toolchain dependency, not part of the app's authored truth

### 5. System Node may still be allowed, but only as explicit policy

There are still legitimate cases for using a host-installed Node:

- local stack development
- CI environments with curated base images
- power-user overrides

So `warp` may support a system Node mode, but it must be explicit and
recordable.

Allowed runtime sources:

- `managed`
- `system`

Recommended profile defaults:

- released profiles: `managed`
- local-dev profiles: `system` or `prefer-system` may be allowed

If system Node is used, `warp` must still:

- validate version compatibility
- record the resolved version and path in `warpspace.lock.json`
- fail clearly when the system runtime is missing or out of envelope

### 6. Node runtime source belongs in the stack manifest and lockfile

The Continuum stack manifest should declare the Node runtime envelope needed by
the selected Wesley/toolchain tuple.

At minimum:

- supported Node major or semver envelope
- default runtime source policy
- platform constraints for managed distributions

`warpspace.lock.json` should then record:

- selected runtime source
- exact Node version
- install receipt or resolved executable path
- whether the runtime is managed or system-provided

### 7. `.warpspace/packages/` should hold managed Node alongside Wesley

The intended install layout remains:

- `.warpspace/packages/`
- `.warpspace/cache/`
- `.warpspace/downloads/`

Managed Node belongs alongside the other internal stack components:

- Wesley
- Echo tooling as needed
- `git-warp` tooling as needed
- `warp-ttd` tooling as needed

That keeps the user-facing model clean:

- one global binary: `warp`
- one local managed toolchain: `.warpspace/`

## Consequences

### Continuum

Continuum now needs to own:

- native `warp` distribution planning
- Node runtime policy in the stack manifest
- install receipts and runtime provenance in the lockfile contract

### Wesley

Wesley remains a managed internal toolchain component.

It does not need to become the thing users install globally.

It should assume that `warp` has already established a compatible runtime
environment before invoking it.

### App Authors

The desired end state is:

1. Install `warp`
2. Run `warp init my-app`
3. Let `warp` ensure the compatible internal toolchain, including Node
4. Never think about Wesley installation details directly

## Strong Recommendation

Do **not** make global system Node a hidden prerequisite for released
WARPspaces.

The stronger product rule is:

- `warp` ensures Node

not:

- "the user probably has Node installed somewhere"

System Node can still exist as an explicit override path.
It should not be the default release posture.

## Playback Questions

- [ ] Does this packet cut the JS-first ship path clearly enough?
- [ ] Is the native binary now the unambiguous permanent `warp` artifact?
- [ ] Is the Node prerequisite now elevated from ambient assumption to explicit
      stack policy?
- [ ] Is the managed-vs-system Node split clear enough to guide manifest and
      lockfile design?

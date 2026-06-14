---
title: Warp CLI And WARPspace TOML
status: proposed
---

# Warp CLI And WARPspace TOML

**Cycle:** 0024-warp-cli-and-warpspace-toml  
**Legend:** SOURCE  
**Type:** coordination cycle  
**Sponsor Human:** James  
**Sponsor Agent:** Codex  
**Impacted Repos:** Continuum, Wesley

## Hill

Freeze the permanent consumer entry point for a Continuum app so the stack
stops teaching a Wesley-hosted `warpspace.mjs` prototype as if it were the
final product boundary.

Lock down:

- the user-facing CLI name and repo home
- the authored WARPspace config format
- the resolved lockfile format and installed-state boundary
- the split between `warp` orchestration and Wesley compilation
- the role of WARPspace templates in bootstrap

This packet answers the practical question:

**If I am starting from nothing, what binary do I download, what files should
land in my app repo, and what internal tools should remain hidden under
`.warpspace/`?**

Distribution shape and Node runtime policy are refined in
[0025 - Warp Native Distribution And Node Runtime Policy](../0025-warp-native-distribution-and-node-runtime-policy/README.md).

## Why This Exists

`0023` was a useful first cut, but it froze two stage-0 assumptions that do not
survive contact with the real user story:

1. the wizard lived in Wesley
2. the checked-in workspace config was `warpspace.mjs`

Both were expedient proof mechanics, not the right long-term boundary.

The user-facing product must sit **above** Wesley because it is responsible for
acquiring Wesley in the first place. And the checked-in workspace config should
be a boring declarative file, not executable JavaScript.

## Decision

### 1. The user-facing CLI is `warp`, and it lives in Continuum

The product name remains **WARPspace**.
The binary users run is:

- `warp`

The repo home for that CLI is:

- Continuum, under [apps/warp](../../../apps/warp/README.md)

This matches ownership:

- **Continuum** owns stack manifests, WARPspace templates, bootstrap doctrine,
  and the question "how does a developer start a Continuum app?"
- **Wesley** remains the compiler/generator that `warp` invokes internally
  after toolchain resolution.

The user should never need to know whether Wesley, Echo, or `git-warp` are
installed globally.

### 2. The authored workspace config is `warpspace.toml`

The checked-in WARPspace config file is:

- `warpspace.toml`

It is:

- human-authored or scaffolded by `warp`
- declarative
- boring
- suitable for local overrides that still remain within the declared
  compatibility envelope

It is **not**:

- executable JavaScript
- a second semantic contract language next to GraphQL
- a place to hide ambient resolution logic

GraphQL remains the authored semantic surface for shared families that Wesley
compiles.
`warpspace.toml` is just workspace configuration.

For the user model, `warpspace.toml` should play the same role that
`package.json` plays for Node projects: it is the checked-in declaration that
the install tool knows how to realize. The corresponding operation should be:

- `warp install`

`warp install` should read `warpspace.toml`, resolve or refresh
`warpspace.lock.json`, materialize declared source checkouts and managed tools,
and leave the WARPspace ready for `warp doctor`, `warp build`, or app-specific
commands. The current `warp warpspace lock` and `warp warpspace sync` commands
are useful lower-level proof surfaces, but they should not be the final
package-manager-shaped user experience.

### 3. The resolved lockfile remains JSON

The resolved workspace lock is:

- `warpspace.lock.json`

It records:

- the exact Continuum stack release chosen
- the WARPspace template used
- exact stack component identities
- the install layout under `.warpspace/`
- local override posture
- bootstrap receipts such as Wesley handoff commands

This file is machine-written.
JSON is the right format for that role.

### 4. Installed toolchain state lives under `.warpspace/`

`warp` owns a managed internal directory:

- `.warpspace/`

Current reserved layout:

- `.warpspace/packages/`
- `.warpspace/cache/`
- `.warpspace/downloads/`

These paths are for installed or cached toolchain state.
They are not the repo's authored truth.

The app repo should check in:

- `warpspace.toml`
- `warpspace.lock.json`
- `contracts/continuum/`
- generated outputs meant to be repo-visible
- app-local source

The app repo should ignore:

- `.warpspace/`

Current prototype note:

- Wesley now consumes `warpspace.toml` directly
- no engine-local bridge file is required for normal bootstrap or build flows
- `warp warpspace lock`, `verify`, `sync`, and `doctor` now cover the first
  pinned-Git constellation flow for repos such as Wesley, Echo, `jedit`, and
  `warp-ttd`

### 5. WARPspace templates are a first-class bootstrap artifact

The stack manifest chooses compatibility.
The WARPspace template chooses host scaffold shape.

That split must stay explicit.

The stack release manifest points at a template artifact, for example:

- `demo-web-rust-v1`

The template owns:

- starter repo skeleton
- package/crate/workspace files
- default app roots
- minimal README and ignore posture

The stack manifest owns:

- compatible Continuum, Wesley, Echo, `git-warp`, and `warp-ttd` identities
- shared family ids, versions, and digests
- default generated output roots
- default install layout

### 6. `warp` orchestrates; Wesley compiles

The boundary is:

- `warp init`
  - resolves a stack release
  - applies a WARPspace template
  - writes `warpspace.toml`
  - writes `warpspace.lock.json`
  - materializes shared families
  - installs or locates internal toolchain components
  - invokes Wesley as needed
- Wesley
  - compiles shared families
  - generates host artifacts
  - does not become the primary end-user product identity

`warp` must not absorb Wesley codegen logic.
Wesley must not pretend to be the installer above itself.

## Smallest Honest Artifact

The smallest artifact that proves this hill is:

- a Continuum-owned [apps/warp](../../../apps/warp/README.md) prototype
- a concrete [demo stack release manifest](../../releases/demo/continuum-stack-release.json)
  that references a WARPspace template
- a checked-in WARPspace template artifact under `apps/warp/templates/`
- a bootstrap run that writes `warpspace.toml` and `warpspace.lock.json`
- a constellation manifest such as
  [jedit-echo-dev.toml](../../warpspaces/jedit-echo-dev.toml) that can be
  locked and synced by `warp warpspace`

## Consequences

### Continuum

Continuum now owns:

- `warp`
- WARPspace templates
- user-facing bootstrap and update doctrine
- stack manifest to host-template mapping

### Wesley

Wesley is now explicitly downstream of `warp` in the consumer experience.

The Wesley-hosted `warpspace` prototype remains useful as a stage-0 proof of
bootstrap mechanics, but it is not the permanent product home.

### App Authors

The intended first-time experience becomes:

```bash
warp init my-app
```

or explicitly:

```bash
warp init my-app --profile demo
```

And the checked-in workspace truth becomes:

- `warpspace.toml`
- `warpspace.lock.json`

not executable JavaScript.

## Playback Questions

- [ ] Is `warp` now the unambiguous user-facing entry point?
- [ ] Does this packet make the home/responsibility split between Continuum and
      Wesley explicit?
- [ ] Is the difference between `warpspace.toml`, `warpspace.lock.json`, and
      `.warpspace/` now sharp enough to guide implementation?
- [ ] Does the template split keep stack compatibility truth separate from host
      scaffold truth?

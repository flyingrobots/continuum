---
title: Warp Package Sources And Local Packages Site
status: proposed
---

# Warp Package Sources And Local Packages Site

**Cycle:** 0026-warp-package-sources-and-local-packages-site  
**Legend:** SOURCE  
**Type:** coordination cycle  
**Sponsor Human:** James  
**Sponsor Agent:** Codex  
**Impacted Repos:** Continuum, Wesley

## Hill

Freeze the package-source model for `warp` so managed toolchain installs do not
assume one registry or one publication path, and so local development can test
that model without pretending npm or crates.io already exist.

Lock down:

- how a Continuum stack manifest names multiple package source sites
- how toolchain components refer to those sites
- what a `local-packages` source means
- how `warp` resolves and stages packages from that source

This packet answers the practical question:

**How does `warp` install toolchain components from more than one source site,
and what is the sanctioned local proof source before real published artifacts
exist?**

## Why This Exists

The previous toolchain work proved that `warp` can stage Node and Wesley into
`.warpspace/packages/`, but the first proof still relied on:

- the current process Node binary
- a sibling Wesley entrypoint

That is fine for local proof.
It is not the right long-term install contract.

At the same time, Wesley is not yet on npm and Echo is not yet on crates.io.
So the managed install story must not assume a single registry-shaped future.

## Decision

### 1. `warp` installs from named package source sites

The Continuum stack manifest may declare:

- `packageSources`

Each source site gets a stable id such as:

- `testLocalPackages`
- `continuumReleaseAssets`
- `internalMirror`

Toolchain install specs then refer to those sites explicitly rather than
hard-coding one package host assumption into `warp`.

### 2. Source-site selection is explicit in install specs

Toolchain install specs may use:

- `source: "package-source"`

and then declare:

- `sourceSite`
- `package`
- `version`
- `variant`
- `managedPath`

That means the package installer contract is:

- source site identity
- package identity
- version identity
- variant identity
- destination inside `.warpspace/packages/`

### 3. `local-packages` is the sanctioned test/proof source site

The first concrete source-site kind is:

- `local-packages`

Meaning:

- package contents live under a local directory tree
- `warp` reads a package manifest from that tree
- `warp` copies the selected payload variant into `.warpspace/packages/`
- `warp` records the source site, package, version, variant, and receipt in
  `warpspace.lock.json`

This source is for:

- tests
- local proof work
- development without published artifacts

It is not the intended release distribution posture.

### 4. Local packages have their own package manifest contract

The local package manifest kind is:

- `warp.package.v1`

It names:

- package id
- version
- variant map

Each variant declares:

- payload path
- entrypoint path inside that payload

This keeps the package-source contract inspectable and reusable across
different source-site kinds.

### 5. Release distribution remains a separate source-site problem

`local-packages` proves the package-source architecture.
It does not answer final publication.

Future source-site kinds may include things like:

- GitHub release assets
- Continuum-controlled HTTP artifact indexes
- internal mirrors

Those should be added as additional source-site kinds without changing the
WARPspace install contract.

## Consequences

### Continuum

Continuum now owns:

- package source-site doctrine
- the `warp.package.v1` local package shape
- the rule that publication host assumptions stay in manifests, not hard-coded
  in `warp`

### Warp

`warp` now needs two separable install layers:

- source-site resolution
- package staging

That is healthier than baking registry logic straight into the tool installer.

### Toolchain Work

The next release-facing step is not "pick npm or crates.io."
It is:

- add at least one real downloadable source-site kind
- keep `local-packages` as the proof harness

## Smallest Honest Artifact

The smallest honest artifact that proves this hill is:

- `warp` support for `packageSources`
- `warp` support for `source: "package-source"`
- one working `local-packages` source-site implementation
- tests that install staged Node and Wesley packages from that source

## Playback Questions

- [ ] Does this packet keep `warp` from assuming one publication host?
- [ ] Is `local-packages` now explicit as a proof source rather than ad hoc
      local copying?
- [ ] Is the difference between source-site resolution and package staging
      sharp enough to guide future downloadable artifact work?

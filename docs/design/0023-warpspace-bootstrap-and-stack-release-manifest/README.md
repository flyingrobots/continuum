---
title: WARPspace Bootstrap And Stack Release Manifest
status: archived
---

# WARPspace Bootstrap And Stack Release Manifest

> Historical note: this packet captures the first bootstrap cut. The permanent
> CLI home and config boundary are now refined in
> [0024 - Warp CLI And WARPspace TOML](../0024-warp-cli-and-warpspace-toml/README.md);
> the current user-facing binary name is `qw`.

**Cycle:** 0023-warpspace-bootstrap-and-stack-release-manifest  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Define the bootstrap/install story for a consumer WARPspace project so an app
team can start from one command instead of assembling Continuum, Wesley, Echo,
`git-warp`, and `warp-ttd` by hand.

Freeze:

- the name of the installer/wizard product
- the release artifact it consumes as source of truth
- how compatible versions are chosen across the stack
- what a demo host project receives after bootstrap
- what is installed locally versus referenced remotely
- how `warpspace.mjs` participates in the flow

This packet answers the practical question:

**If I am starting a new Continuum app, what exactly do I run, who decides the
versions, and what lands in my host project afterward?**

## Why This Exists

Continuum now has real shared-family doctrine and real authored family sources,
and `continuum-demo` has already proved that a host-local `warpspace.mjs` can
materialize the neighborhood-core family into Echo-facing and `warp-ttd`-facing
outputs.

But the current consumer story is still sibling-repo assembly:

- copy or sync a family from `../continuum`
- invoke Wesley from `../wesley`
- hand-wire runtime/tool versions in the host repo

That is acceptable for stack surgery.
It is not an honest app-developer story.

The gap is now clear:

- Continuum owns shared semantics and compatibility truth
- Wesley owns compilation and bundle identity
- engines and tools own their local runtime truth
- the host project still lacks one lawful bootstrap path that ties those pieces
  together

Without that path, "build a Continuum app" remains ambient folklore.

## Decision

### 1. The user-facing bootstrap product is called `warpspace`

The "Unity installer" equivalent for this stack is the `warpspace` bootstrap
tool.

User-facing entrypoints are:

- `warpspace init`
- `warpspace doctor`
- `warpspace sync`
- `warpspace generate`

The product is named after the host project boundary, not after Continuum or
Wesley.

That naming matters:

- **Continuum** is the authority for shared stack coordination truth
- **Wesley** is the compiler/tooling authority
- **WARPspace** is the consumer project's local realization of those upstream
  decisions

The app author should feel like they are creating a WARPspace, not manually
assembling five repos.

The first implementation may ship inside Wesley-hosted tooling if that is the
fastest path.
The user-facing product name still remains `warpspace`.

### 2. The source of truth is a Continuum-authored stack release manifest

`warpspace init` consumes a Continuum-authored **stack release manifest**.

Suggested canonical artifact name:

- `continuum-stack-release.json`

First concrete example:

- [docs/releases/demo/continuum-stack-release.json](../../releases/demo/continuum-stack-release.json)

That manifest is the release-set truth for a named profile or channel such as:

- `demo`
- `echo-first`
- `sibling-runtime`

The manifest is not just "latest versions."
It is a tested and declared compatibility set.

At minimum it names:

- stack profile id and release id
- Continuum family ids, versions, and digests
- Wesley bundle-format and compiler compatibility
- compatible Echo release identities
- compatible `git-warp` release identities
- compatible `warp-ttd` release identities
- bootstrap template/profile defaults
- default projections and host output expectations

This keeps the top-level bootstrap authority in Continuum, which already owns:

- shared vocabulary
- authored shared families
- compatibility truth
- integration scenarios

### 3. Version authority is split by ownership, but resolution is centralized

Version choice must not degenerate into "install the newest thing from every
repo and hope."

The lawful split is:

- **Continuum**
  - declares the shared family set and stack profile
  - publishes the stack release manifest
  - owns the meaning of compatibility at the shared boundary
- **Wesley**
  - declares supported bundle formats, compiler identity, and generated-artifact
    compatibility
  - remains the authority for bundle/manifests/codegen capability
- **Echo**
  - publishes its own release identity plus compatibility metadata for the
    shared families and toolchain it can consume
- **`git-warp`**
  - publishes its own release identity plus compatibility metadata for the
    shared families and toolchain it can consume
- **`warp-ttd`**
  - publishes its own release identity plus compatibility metadata for the
    shared families and toolchain it can consume

`warpspace init` resolves one exact install set from those declarations and
writes that result into a host lockfile.

Suggested lock artifact:

- `warpspace.lock.json`

The bootstrap default should prefer the exact tested tuple named by the
Continuum stack release manifest, not an open-ended solver over broad semver
ranges.

Broad compatibility ranges still matter.
They are how each repo declares what it understands.
But the first consumer experience should land on one known-good release set.

### 4. Stack profiles choose compatibility, not fake lockstep versions

This packet extends `0021-family-versions-vs-repo-versions` rather than
replacing it.

The installer chooses compatibility in this order:

1. The user picks a stack profile or channel, such as `demo`.
2. `warpspace init` fetches the matching `continuum-stack-release.json`.
3. The manifest fixes the shared family set and required family versions.
4. The manifest fixes the required Wesley bundle-format and compiler envelope.
5. Echo, `git-warp`, and `warp-ttd` releases are selected from the tested tuple
   named in that manifest.
6. The exact resolved identities and digests are written to
   `warpspace.lock.json`.

That means the installer does choose compatible versions of:

- **Continuum**
  - by stack release id plus family versions/digests
- **Wesley**
  - by compiler/toolchain version compatible with the stack release
- **Echo**
  - by the runtime integration release declared compatible with that stack
    release
- **`git-warp`**
  - by the runtime integration release declared compatible with that stack
    release
- **`warp-ttd`**
  - by the observer/protocol release declared compatible with that stack
    release

This is explicit compatibility, not a fake monorepo release train.

### 5. A bootstrapped host project receives a checked-in WARPspace

After bootstrap, a demo host project should receive:

- a checked-in `warpspace.mjs`
- a checked-in `warpspace.lock.json`
- a local `contracts/continuum/` materialization for the selected shared family
  slice
- generated output roots for the selected projections
- host package/crate dependencies for the selected targets
- bootstrap scripts or `warpspace` commands for sync/generate/doctor flows
- optional runtime launch/dev wiring for the chosen profile

For the current demo profile, the first shared family materialized into the
host is:

- `continuum-neighborhood-core-family.graphql`

and the first projections are:

- TypeScript
- Zod
- Echo-facing generated outputs
- `warp-ttd`-facing generated outputs

The important product rule is:

- the host project receives a usable local workspace
- it does **not** receive "please clone five sibling repos and wire them up by
  hand"

### 6. Install host-local artifacts; reference upstream authority remotely

The default bootstrap split is:

#### Installed or materialized locally in the host repo

- `warpspace.mjs`
- `warpspace.lock.json`
- selected shared family source or immutable bundle under `contracts/continuum/`
- generated artifacts
- host-side package/crate dependencies
- optional local caches under a `.warpspace/` directory

#### Referenced remotely by default

- Continuum stack release manifests
- Wesley package/binary releases
- Echo release artifacts
- `git-warp` release artifacts
- `warp-ttd` release artifacts

The host should depend on released artifacts by default.

The current sibling-repo pattern:

- `../continuum`
- `../wesley`
- `../echo`
- `../git-warp`
- `../warp-ttd`

is a stack-development override mode, not the canonical consumer story.

### 7. `warpspace.mjs` is host topology, not stack semantics

`warpspace.mjs` remains a checked-in host file.
It names:

- the chosen stack profile
- selected families
- requested projections
- output roots
- runtime targets
- optional local override sources

It does **not** become the place that redefines:

- shared family meaning
- bundle-format law
- cross-repo compatibility truth

Those remain upstream.

So the lawful split is:

- `continuum-stack-release.json`
  - upstream stack compatibility authority
- `warpspace.lock.json`
  - exact resolved local install state
- `warpspace.mjs`
  - host topology, targets, and local overrides

This keeps WARPspace powerful without turning every app repo into its own
private doctrine center.

### 8. Local overrides are explicit escape hatches for stack development

Local overrides are allowed because active stack work often happens across
sibling repos.

Examples:

- use `../continuum` as family source instead of a released bundle
- use `../wesley` as the active generator/tool binary
- use local Echo or `git-warp` builds instead of released artifacts

Those overrides belong in `warpspace.mjs` and are recorded as such in
`warpspace.lock.json`.

Override rules:

- overrides may change acquisition source or local tool path
- overrides may not silently rename shared families or invent shadow versions
- if an override leaves the declared compatibility envelope, the WARPspace
  should be marked as local/dev or out-of-band rather than pretending it is a
  clean release install

This preserves honest experimentation without corrupting published compatibility
truth.

### 9. What remains engine-local

The installer/bootstrap flow does **not** freeze one universal runtime.

It leaves local:

- Echo scheduler/admission/finalization internals
- `git-warp` storage/import/provenance internals
- `warp-ttd` session/product ergonomics beyond shared published families
- exact engine-local policy implementations
- bounded-site computation internals
- app-local domain families and app-specific runtime composition

The bootstrap story owns the shared boundary and the host acquisition flow.
It does not erase engine-local freedom.

## Minimal Bootstrap Flow

The intended happy path is:

1. Create or enter an app repo.
2. Run `warpspace init --profile demo`.
3. `warpspace` fetches `continuum-stack-release.json`.
4. `warpspace` resolves the exact tested tool/runtime tuple and writes
   `warpspace.lock.json`.
5. `warpspace` materializes the first shared Continuum family into
   `contracts/continuum/`.
6. `warpspace` writes `warpspace.mjs` with default outputs and target roots.
7. `warpspace` installs the required host-side tooling/dependencies and runs
   the first generation pass.

After that, the host project can build on top of:

- one known WARPspace
- one known stack release set
- one materialized shared family

instead of starting from ambient stack lore.

## First Product Posture

The immediate proving path should be:

- **Continuum**
  - define the manifest format and publish the first stack release manifests
- **Wesley**
  - host the first real `warpspace` command if that is the fastest path to a
    working tool
- **`continuum-demo`**
  - consume the released bootstrap flow instead of relying on sibling-repo
    copies once the first manifest path exists

That sequencing keeps authority, implementation, and demo proof in the correct
repos without blocking near-term progress.

## Playback Questions

### Human

- [ ] Can an app team start a WARPspace with one command instead of learning
      stack folklore?
- [ ] Can they tell which artifact owns stack compatibility truth versus host
      topology versus exact local resolution?

### Agent

- [ ] Can I resolve a compatible Continuum/Wesley/Echo/`git-warp`/`warp-ttd`
      tuple from declared manifests instead of guessing from repo versions?
- [ ] Can I tell when a host is on a released stack profile versus a local
      sibling-repo override mode?

## Non-goals

- making Continuum itself the app runtime
- forcing all repos onto one shared numeric version
- cloning every stack repo into every host project by default
- eliminating local development overrides
- freezing engine-local implementation details into bootstrap doctrine

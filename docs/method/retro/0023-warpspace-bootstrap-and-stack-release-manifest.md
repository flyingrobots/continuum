---
title: Retro - WARPspace Bootstrap And Stack Release Manifest
status: complete
---

# Retro

## Hill

Turn the WARPspace bootstrap story from doctrine into something a developer can
actually try.

The target was not "design a future installer in prose."
The target was:

- define the bootstrap authority split in Continuum
- freeze one concrete stack release manifest
- prove that a fresh host repo can be created from that manifest
- do it without mutating `continuum-demo`

## Outcome

This cycle landed five real things:

1. **Bootstrap doctrine in Continuum**
   - `0023-warpspace-bootstrap-and-stack-release-manifest`
   - `warpspace` named as the user-facing bootstrap tool
   - `continuum-stack-release.json` named as the stack authority artifact

2. **A newcomer path in Continuum**
   - `docs/GETTING_STARTED.md`
   - a cleaner answer to "where do I start?" than "read all the packets"

3. **A concrete demo stack release manifest**
   - `docs/releases/demo/continuum-stack-release.json`
   - one pinned tuple for Continuum, Wesley, Echo, `git-warp`, and `warp-ttd`

4. **A working local-first `warpspace init` prototype in Wesley**
   - Wesley commit `72fbeb7`
   - reads the Continuum manifest
   - writes `warpspace.mjs`
   - writes `warpspace.lock.json`
   - materializes the first shared family
   - runs the first generator pass

5. **A fresh host proof repo**
   - sibling repo `../continuum-wizard-demo`
   - commit `ee39f9a`
   - proves the bootstrap can create a brand-new host repo without touching
     `continuum-demo`

That means the stack now has a real, inspectable answer to:

**What happens if I try to start a new Continuum app from a manifest-driven
WARPspace flow?**

## What Proved True

### 1. The authority split was right

The clean split held up under implementation pressure:

- **Continuum** defines stack compatibility truth
- **Wesley** can host the bootstrap mechanics
- the **host repo** owns `warpspace.mjs` and `warpspace.lock.json`

That is the right division of labor.
The tool can live in Wesley without moving stack authority out of Continuum.

### 2. A stack release manifest is enough to drive a real first cut

The manifest was not just documentation.
It was enough to:

- identify the selected shared family
- identify the compatible tool/runtime tuple
- tell the bootstrap where generated outputs should land
- record the local resolution into a lockfile

That validates the basic manifest idea.

### 3. `warpspace.mjs` and `warpspace.lock.json` are the right local artifacts

The host repo wanted exactly these two checked-in files:

- `warpspace.mjs` for host topology and targets
- `warpspace.lock.json` for resolved manifest and local provenance

The tool naturally wanted to write them.
That is a good sign that the artifact boundary is honest.

### 4. The first family slice was the right one

Neighborhood core was small enough and concrete enough to bootstrap cleanly.

The proof repo now contains:

- the materialized family source
- shared TypeScript and Zod outputs
- Echo-facing generated outputs
- `warp-ttd` manifest and TypeScript outputs

That is a much more convincing host proof than generic talk about "shared
families."

## What Proved Incomplete

### 1. The manifest is carrying some template truth that does not belong there

The current demo manifest names output roots such as:

- `packages/demo-web/...`
- `crates/demo-contracts/...`

That worked for the proof.
It also exposed the next design pressure clearly:

- **stack compatibility truth**
  is not the same thing as
- **host template/scaffold truth**

The current manifest is carrying some of both.

That is acceptable for the first cut.
It is not the right long-term boundary.

### 2. A bootstrapped repo is not yet a usable app repo

The wizard proof created a correct host tree, but not a complete app skeleton.

Still missing:

- package manager/workspace manifests
- crate/workspace manifests
- dependency installation
- any app-local runtime or UI skeleton

So the current flow proves:

- manifest-driven materialization
- generation

but not yet:

- a truly adoptable app bootstrap

### 3. `git-warp` is only pinned, not exercised

The demo tuple includes `git-warp`, but the current host proof does not yet
materialize a `git-warp`-facing generated leg or prove a hot-to-cold handoff.

That is still honest as long as the profile is described correctly.
It does mean the profile is presently:

- Echo + `warp-ttd` first
- `git-warp` pinned but not yet surfaced in the host bootstrap

### 4. The bootstrap is still local-development posture

The working command still requires:

- `--manifest <path>`
- `--authority-root <path>`

That is good enough for stack development.
It is not yet the boring user-facing entry point described in the doctrine.

## Strongest Lesson

The most important thing we learned is:

**the next missing boundary is not "more version doctrine." It is the split
between stack release truth and host template truth.**

The implementation pressure made this obvious.

Today one artifact is doing too much:

- saying which stack tuple is compatible
- saying which family is materialized
- implicitly saying what kind of host repo should exist

Those are related, but they are not the same concern.

The next design cut should separate:

- **stack manifest**
  - compatibility tuple
  - family versions
  - tool/runtime identities
- **WARPspace template**
  - repo scaffold
  - package/crate roots
  - dependency posture
  - starter app/runtime shape

## What I Would Do Next

If I were pulling the next honest slice, I would do exactly this:

### 1. Define one WARPspace template artifact

Add one explicit template concept for the demo host profile.

It should own:

- package/crate/workspace skeleton
- default output roots
- dependency declarations
- minimal README/bootstrap scripts

It should not be smuggled into the stack manifest as ambient path defaults.

### 2. Point the stack release manifest at that template

Continuum should keep owning the stack release manifest, but the manifest
should reference a template id or template artifact rather than hard-coding a
demo-shaped repo layout.

That would make the compatibility story cleaner and the host scaffold more
portable.

### 3. Extend `warpspace init` to scaffold the host template

Once the template exists, Wesley should:

- materialize the template
- install or declare host dependencies
- then materialize the shared family
- then run generation

That turns the current proof from "generated outputs landed in a repo" into
"the user now has a plausible starter app workspace."

### 4. Only after that, drop the local-only bootstrap flags

After the template/scaffold split is in place, then it is worth doing:

- `warpspace init --profile demo`
- manifest/profile fetch
- automatic authority resolution for released paths

That is the right order.
Otherwise we would make the fetch story cleaner while the host repo shape is
still underspecified.

## Evidence

- Continuum packet:
  - `docs/design/0023-warpspace-bootstrap-and-stack-release-manifest/README.md`
- Continuum onboarding:
  - `docs/GETTING_STARTED.md`
- Continuum release artifact:
  - `docs/releases/demo/continuum-stack-release.json`
- Wesley prototype:
  - commit `72fbeb7`
- Fresh host proof:
  - sibling repo `../continuum-wizard-demo`
  - commit `ee39f9a`

## Bottom Line

This cycle succeeded.

We no longer just have an opinion about how a developer should enter the
Continuum stack.
We have:

- one named bootstrap tool
- one concrete stack manifest
- one working prototype implementation
- one fresh host repo created from that flow

The next hill is to make that host repo look like the beginning of an app, not
just the destination of generated files.

---
title: Family Versions versus Repo Versions
status: proposed
---

# Family Versions versus Repo Versions

**Cycle:** 0021-family-versions-vs-repo-versions  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Reduce coordination complexity across Continuum, Wesley, Echo, `git-warp`, and
`warp-ttd` by freezing one release rule:

**shared semantic families version independently from repositories, while each
repo declares compatibility explicitly rather than joining a fake lockstep
release train.**

## Why This Exists

The current stack wants all of the following at once:

- shared semantic law
- shared contract families
- Wesley-generated artefacts
- multiple runtimes and tools
- independent implementation pace

If we try to satisfy that by forcing all repos onto one version number, we will
turn normal development into a coordination tax.

That tax is unnecessary because the things that actually need shared identity
are narrower:

- semantic families
- generated bundle formats
- compiler/toolchain identity
- explicit compatibility declarations

This packet freezes the lighter-weight release doctrine.

## Decision

### 1. Repository versions stay repository-local

Echo, `git-warp`, Wesley, Continuum, and `warp-ttd` may release at different
cadences.

No repo is required to share one numeric version with another repo merely
because they participate in the same semantic stack.

### 2. Shared semantic families are the primary compatibility units

Continuum owns the semantic family boundaries.

Examples include:

- lane identity and coordinate families
- admission outcome families
- shell and witness publication families
- settlement and reintegration publication families
- observer or projection surface families

Those families should carry their own semver or equivalent compatibility
identity.

### 3. Wesley owns compiler and bundle identity

Wesley should remain the authority for:

- generated artefact format versions
- compiler package version
- exact bundle identity or digest
- bundle metadata that ties family versions together into one published unit

This follows the existing direction in Wesley's contract-bundle release packet
rather than re-inventing a second release centre elsewhere.

### 4. Consuming repos publish compatibility, not lockstep sameness

Each consuming repo should declare, in inspectable metadata, which shared
families and toolchain versions it understands.

The minimal compatibility story should include:

- supported family ids and versions
- supported bundle format versions
- Wesley compiler version or compatible range when generated artefacts matter
- optional capability flags for partial support

### 5. CI should test matrices, not a synthetic monorepo

The important automated question is not:

- "did every repo ship version `v0.x.y` together?"

It is:

- "does this Echo build interoperate with this `warp-ttd` build over the same
  family versions?"
- "does this `git-warp` build publish the same meaning for the shared family?"
- "does Wesley emit deterministic bundles and manifests for those families?"

Compatibility-matrix testing is therefore more honest than a forced shared
release train.

### 6. Hosts consume policy and semantics by family, not by ambient repo folklore

The family-version model also protects policy publication.

When a host chooses:

- an admission policy family
- a settlement publication family
- an observer surface family

it should do so against versioned, authored semantic families rather than
against ambient repo assumptions.

## Recommended Ownership Split

- **Continuum**
  - semantic family boundaries
  - invariant law
  - family ids and compatibility meaning
- **Wesley**
  - bundle compilation
  - format versions
  - digests and generated manifests
- **Echo / `git-warp`**
  - engine-local implementation
  - compatibility declarations
  - capability publication
- **`warp-ttd`**
  - consumer/tooling compatibility declarations
  - observer/product capability publication

## Minimal Consumer Posture

Each consumer should be able to publish something equivalent to:

```json
{
  "continuumFamilies": {
    "lane-identity": "^0.4.0",
    "admission-outcome": "^0.2.0",
    "witness-shell": "^0.3.0"
  },
  "bundleFormat": 1,
  "wesley": "^0.5.0",
  "capabilities": {
    "observerCollapse": true,
    "canonicalSettlement": false
  }
}
```

The exact file or schema is still open. The doctrine is not.

## Why This Is Better

This model lets us keep:

- shared semantics where they matter
- independent release cadence where it is healthy
- explicit compatibility instead of social guesswork
- Wesley as compiler authority without making Wesley the version number for the
  whole world

## Playback Questions

### Human

- [ ] Can two repos move at different speeds without forcing a fake coordinated
      release?
- [ ] Can an operator tell what family versions and capabilities a given build
      actually supports?

### Agent

- [ ] Can I decide interoperability from family/version metadata rather than
      inferring it from repo versions?
- [ ] Can I tell which changes are semantic-family changes versus engine-local
      implementation changes?

## Non-goals

- forcing one version number across all repos
- moving all release authority into Wesley
- freezing one shared monorepo process


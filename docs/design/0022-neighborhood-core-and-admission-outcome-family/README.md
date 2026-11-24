---
title: Neighborhood Core And Admission Outcome Family
status: archived
---

# Neighborhood Core And Admission Outcome Family

**Cycle:** 0022-neighborhood-core-and-admission-outcome-family  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze one small, authored Continuum family that turns the shared admission-law
doctrine into a concrete generated contract target:

- neighborhood core is a shared publication family
- it carries the shared `AdmissionOutcomeKind`
- it stays smaller than settlement, reintegration detail, and receipt shell

This packet answers the practical question:

**What is the first concrete admission/publication family slice Echo can map to
today without asking adapters or Wesley to infer the meaning by hand?**

## Why This Exists

`0020` already froze the cross-engine doctrine:

- the shared boundary publishes admission, not mere application
- the lawful outcome family is shared
- policy identity matters when it changes published meaning
- bounded sites are shared semantically, not structurally

Echo now has enough runtime truth to cash out part of that doctrine honestly:

- `TickReceiptDisposition::Applied` => `Derived`
- `TickReceiptDisposition::Rejected(FootprintConflict)` => `Obstruction`
- `NeighborhoodSite::Singleton` => `Derived`
- `NeighborhoodSite::Braided` => `Plural`
- `SettlementDecision::ImportCandidate` => `Derived`
- `SettlementDecision::ConflictArtifact` => `Conflict`

That makes neighborhood core the smallest truthful generated-family target.

## Decision

### 1. Neighborhood core is the first concrete admission/publication slice

The first authored family after the doctrine packet should not try to encode
all of settlement, reintegration detail, and receipt shell at once.

It should publish one bounded observer/debugger object:

- the local observed site
- the participating lanes at that site
- the top-level lawful outcome kind

That is enough to make the admission law concrete without forcing the entire
stack through one giant schema jump.

### 2. `AdmissionOutcomeKind` is shared at the family boundary

The authored family should freeze one top-level lawful outcome enum:

- `DERIVED`
- `PLURAL`
- `CONFLICT`
- `OBSTRUCTION`

This family does **not** require every host to emit every outcome from the
neighborhood-core surface immediately.

It does require hosts to stop inventing separate top-level outcome vocabularies
for the same admitted fact.

For the first neighborhood-core family cut, the published neighborhood surface
uses only:

- `DERIVED`
- `PLURAL`

`CONFLICT` and `OBSTRUCTION` remain part of the shared algebra, but they stay
carried by adjacent settlement and receipt-adjacent families until
neighborhood-core publication has a real need to surface them directly.

### 3. Neighborhood plurality is shared semantically, not host-specifically

The shared family should preserve singleton-vs-plural site truth, but without
forcing Echo's internal `Braided` noun onto every host implementation.

So the shared family uses:

- `SINGLETON`
- `PLURAL`

Hosts may keep richer local publication nouns below that boundary.

### 4. Participant roles are part of the shared publication

The neighborhood-core family should name the participant-role subset already
stable enough to share:

- `PRIMARY`
- `BASIS_ANCHOR`
- `SUPPORT`

These roles are narrow, observer-facing, and already needed for cross-host
debugger honesty.

### 5. Bounded site remains semantically shared but structurally local

This packet does **not** freeze one universal `BoundedSite` struct for every
engine.

It freezes only the publication surface that results from local bounded-site
reasoning.

That preserves the `0020` rule:

- bounded sites are shared semantically
- their internal runtime structure remains engine-local

### 6. Shell and policy stay adjacent, not embedded

Neighborhood core is not receipt shell.
Neighborhood core is not reintegration detail.
Neighborhood core is not policy definition.

Those families remain adjacent and may refine neighborhood publication later,
but they must not be collapsed into it.

## Minimum Shared Family

The authored family for this packet is:

- `schemas/continuum-neighborhood-core-family.graphql`

The authored family should minimally publish:

- `AdmissionOutcomeKind`
- `NeighborhoodPlurality`
- `NeighborhoodParticipantRole`
- `NeighborhoodParticipant`
- `NeighborhoodCore`

With shared meaning:

- `NeighborhoodCore`
  - stable site identity
  - anchor lane and coordinate
  - top-level lawful outcome kind
  - singleton-vs-plural site truth
  - participant set

- `NeighborhoodParticipant`
  - lane identity
  - optional strand identity
  - participant role
  - exact coordinate
  - state identity/hash

## Echo Mapping

Echo's current truthful mapping is:

- `NeighborhoodSite.site_id` => `NeighborhoodCore.siteId`
- `NeighborhoodSite.anchor.worldline_id` => `NeighborhoodCore.anchorLaneId`
- `NeighborhoodSite.anchor.resolved_worldline_tick` => `NeighborhoodCore.anchorFrameIndex`
- `NeighborhoodSite::admission_outcome_kind()` => `NeighborhoodCore.outcomeKind`
- `NeighborhoodSite::Singleton` => `NeighborhoodPlurality::SINGLETON`
- `NeighborhoodSite::Braided` => `NeighborhoodPlurality::PLURAL`
- `SiteParticipant` => `NeighborhoodParticipant`

This is why neighborhood core is the right first generated slice: Echo can
already publish it without pretending settlement or reintegration are done.

## Relation To Existing Families

### Settlement family

Settlement is a different family.

- neighborhood core says which lanes define the current local site
- settlement says which source history can lawfully become target history

Both may use the same `AdmissionOutcomeKind`, but they are not the same family.

### Receipt family

Receipt shell remains:

- explanatory
- host-specific
- drill-down capable

It may refine neighborhood publication, but it must not become the only place
where neighborhood outcome truth lives.

### Reintegration detail

Neighborhood core is the local site-facing surface.
Reintegration detail is the seam-facing surface.

They may be related by witness or shell, but they should not be fused.

## What This Freezes

- one authored neighborhood-core family exists in Continuum
- `AdmissionOutcomeKind` is part of the shared publication boundary
- participant roles and singleton-vs-plural site truth are shared
- Echo and `git-warp` may differ locally but must publish the same category

## What This Leaves Local

- internal bounded-site computation
- neighborhood search and expansion strategy
- support-pin caching strategy
- host-local shell fields and richer labels
- local braid geometry data structures

## Non-goals

- freezing one universal engine-local bounded-site struct
- replacing the settlement family
- making receipt shell the same thing as neighborhood core
- forcing hosts to emit every outcome variant from neighborhood publication in
  the first cut

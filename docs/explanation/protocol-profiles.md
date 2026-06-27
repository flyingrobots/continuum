---
title: Protocol profiles and capability tiers (proposed)
status: proposed
---

# Protocol profiles and capability tiers (proposed)

> **Status: proposed — design target, not yet authored.** The capability tiers
> and `continuum.*.v1` profiles below describe the *intended* participation
> model. They are **not** present in `schemas/` or any code in this repo today.
> The only authored, source-backed contracts are the four families under
> [`schemas/`](../../schemas/README.md); see the
> [Contract Family Registry](../contract-family-registry.md) for what actually
> exists and its evidence. Do not cite anything on this page as a current
> capability. Active design for the first profile is tracked in
> [continuum#24](https://github.com/flyingrobots/continuum/issues/24).

This page was lifted out of `README_FULL.md` so the front-door narrative does
not present an unbuilt protocol surface as current truth.

## Capability tiers

The intended model: compatibility grows in visible tiers, and a participant can
join early without pretending to support everything.

- **T0 — Descriptor only:** the participant can say what it is and what it does not support.
- **T1 — Contract-shaped:** publishes or consumes contract families and schema digests.
- **T2 — Observable:** can answer observation requests with reading envelopes.
- **T3 — History exchange:** can export or import witnessed suffixes.
- **T4 — Debuggable:** supports replay, seek, and step semantics for advertised debug operations.
- **T5 — Counterfactual:** supports scratch branches and divergence reports.
- **T6 — Law/optic:** can admit, obstruct, revoke, and witness law or optic artifacts.

T0 and T1 are intended to be valid ways to join the ecosystem honestly.

## Profiles

Profiles would describe behavior; contract families describe shared nouns. The
intended profile set:

- `continuum.participant.hello.v1`: identity, supported profiles, contract families, connection hints, auth posture, and evidence posture.
- `continuum.contract.index.v1`: authored and consumed families, generated artifacts, schema digests, witnesses, and open cuts.
- `continuum.observation.v1`: lawful readings returned as evidence-bearing `ReadingEnvelope` results or obstructions.
- `continuum.history.exchange.v1`: export/import of witnessed suffixes and settlement outcomes.
- `continuum.debug.v1`: app-agnostic debugger access to causal history.
- `continuum.counterfactual.v1`: scratch branches, alternate histories, divergence reports, and promotion requests.
- `continuum.law.optic.v1`: compiled law/optic artifacts admitted without ambient authority.
- `continuum.warpspace.v1`: local app constellations, runtime targets, generated roots, and stack tuple locks.
- `continuum.agent.v1`: structured discovery, inspection, proposal, rehearsal, and obstruction surfaces for agents.
- `continuum.warp-drive.v1`: file-shaped readings and write-as-intent semantics without making POSIX the core ontology.

## Why a profile is more than its nouns

A profile would require *behavior*, not just shape. For example,
`continuum.observation.v1` may require the
[`ObserverPlan`, `ObservationRequest`, `ReadingEnvelope`](../../schemas/continuum-runtime-boundary-family.graphql)
nouns — which *do* exist in the runtime-boundary family today — but compiling
those nouns alone does not guarantee that a participant preserves rights,
residuals, obstruction behavior, and evidence posture. That behavioral contract
is the part still to be authored.

## Intended first proof

The intended first concrete step (not yet done): define
`continuum.participant.hello.v1`, add a descriptor-only participant fixture, add
structured evidence posture, generate a witness through Wesley, prove WARP TTD
can discover a target without app-specific knowledge, and teach the `qw` CLI to
report profile and evidence status honestly. There are no counterfactuals yet,
no global law registry, no identity-system decision, and no federation surface.

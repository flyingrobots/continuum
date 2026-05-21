---
title: Continuum Lane Identity Family Boundary
status: proposed
---

# Continuum Lane Identity Family Boundary

## Why

The Continuum ownership map and lane packets now say more clearly:

- `Lane` is the deeper base kind
- `Worldline` and `Strand` are lane forms with different admission/governance
- `Braid` is a compositional object over lanes, not just another lane

Continuum should freeze how much of that identity story belongs in shared
authored families versus host-local runtime truth. Without that cut, hosts and
debugger surfaces can each publish slightly different lane noun stacks.

## Goal

Record the family boundary for shared lane identity nouns and leave runtime
specific detail to hosts without letting the public contract drift or flatten
the ontology.

## Done When

- one packet states which lane nouns are contract-worthy now
- the packet names what belongs in a shared authored family versus host-local
  elaboration
- the cut explains how `warp-ttd` protocol ownership and receipt-family
  ownership relate
- downstream generators can emit stable lane identity surfaces without
  pretending every host has identical runtime structure

## Evidence

- `docs/design/0001-lane-ontology-and-merge-temporality/README.md`
- `docs/design/0002-kairotic-merge-and-derived-lanes/README.md`
- `docs/design/0014-shared-noun-ownership-map/README.md`

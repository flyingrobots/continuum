---
title: Continuum documentation index
status: current
---

# Continuum documentation

Continuum is the shared coordination layer for a causal-computing stack. This
page routes you to the right kind of help. It is a router, not an encyclopedia —
follow the links.

For how this documentation is organized and the rules it follows, see the
[documentation policy](DOCUMENTATION_POLICY.md). The machine-readable index is
[`catalog.yaml`](catalog.yaml).

## Start here

- New to the model? Read the [overview](OVERVIEW.md), then [README_FULL](../README_FULL.md).
- Want to run something first? Follow [Getting Started](GETTING_STARTED.md).
- Setting direction? See [Bearing](BEARING.md) and [Vision](VISION.md).

## Conform a repo to Continuum (sibling maintainers)

- [Contract Family Registry](contract-family-registry.md) — authored homes, shared nouns, current evidence, and the open cut per family.
- [Publish runtime evidence that closes a contract-family gap](how-to/publish-runtime-evidence-for-a-contract-family.md).
- [Shared Noun Ownership Map](design/0014-shared-noun-ownership-map/README.md) — who owns the semantics, authored home, runtime truth, and product surface of each shared noun.
- [Continuum invariants](invariants/CONTINUUM.md) — rules the stack must not violate.

## Author and consume contract families

- [Schemas](../schemas/README.md) — the authored home for shared families.
- Families: [receipt](../schemas/continuum-receipt-family.graphql), [settlement](../schemas/continuum-settlement-family.graphql), [neighborhood core](../schemas/continuum-neighborhood-core-family.graphql), [runtime boundary](../schemas/continuum-runtime-boundary-family.graphql).

## Coordinate the stack release (stack maintainers)

- [Continuum Stack Convergence](design/0035-continuum-stack-convergence/README.md) — ownership, gates, and the compatibility set.
- [Release Roadmap](design/0036-continuum-stack-release-roadmap/README.md) and [Project Slice Plan](design/0037-continuum-stack-project-slice-plan/README.md).

## Understand the theory

- [Overview](OVERVIEW.md) is the synthesis hub.
- The full record lives in the [design packets](design/README.md). Packets are
  append-only decision records; a superseded packet links forward rather than
  being deleted.

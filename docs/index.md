---
title: Continuum documentation index
status: current
---

# Continuum documentation

Continuum is the shared coordination layer for a causal-computing stack. This
page routes you to the right kind of help. It is a router, not an encyclopedia —
follow the links.

For how this documentation is organized and the rules it follows, see the
[documentation standard](DOCUMENTATION_POLICY.md). Agents route through the
[machine-readable catalog](catalog.yaml).

## Start here

- New to the model? Read the [overview](OVERVIEW.md), then the [full reference](../README_FULL.md).
- Want to run something first? Follow [Getting Started](GETTING_STARTED.md); the exact commands are in the [qw command reference](reference/qw-cli.md).
- Need a term? See the [Shared Noun Glossary](reference/glossary.md).
- Setting direction? See [Bearing](BEARING.md) and [Vision](VISION.md).

## Conform a repo to Continuum (sibling maintainers)

- [Contract Family Registry](contract-family-registry.md) — authored homes, shared nouns, current evidence, and the open cut per family.
- [Publish runtime evidence that closes a contract-family gap](how-to/publish-runtime-evidence-for-a-contract-family.md).
- [Shared Noun Ownership Map](reference/ownership-map.md) — who owns the semantics, authored home, runtime truth, and product surface of each shared noun.
- [Continuum invariants](invariants/CONTINUUM.md) — rules the stack must not violate.

## Author and consume contract families

- [Schemas](../schemas/README.md) — the authored home for shared families.
- Families: [receipt](../schemas/continuum-receipt-family.graphql), [settlement](../schemas/continuum-settlement-family.graphql), [neighborhood core](../schemas/continuum-neighborhood-core-family.graphql), [runtime boundary](../schemas/continuum-runtime-boundary-family.graphql).

## Coordinate the stack release (stack maintainers)

- [Continuum Stack Convergence](reference/convergence.md) — ownership, gates, goalpost ordering, and the compatibility set; links to live GitHub state.
- Design history: [convergence packet](design/0035-continuum-stack-convergence/README.md), [release roadmap](design/0036-continuum-stack-release-roadmap/README.md), [project slice plan](design/0037-continuum-stack-project-slice-plan/README.md).

## Understand the theory

- [Overview](OVERVIEW.md) is the living explanation of the model.
- The full record lives in the [design packets](design/README.md), a **frozen
  historical decision log**. A superseded packet stays as history rather than
  being deleted; new decisions use a decision record or a `CHANGELOG.md` line.

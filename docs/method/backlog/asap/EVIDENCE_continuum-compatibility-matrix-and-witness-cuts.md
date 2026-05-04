---
title: Compatibility Matrix And Witness Cuts
status: proposed
---

# Compatibility Matrix And Witness Cuts

## Why

The first Continuum-local compatibility matrix now exists:

- [docs/contract-family-registry.md](../../../contract-family-registry.md)

The remaining gap is evidence. Some rows are authored and some are
fixture-witnessed, but none yet prove live sibling-runtime exchange.

## Goal

Turn the registry's open cuts into witnessed evidence.

Track, at minimum:

- contract family
- canonical authored home
- generated realizations
- known consumers
- current witness scope
- missing cuts

## Done When

- the registry row for `runtime-boundary-family` has a Wesley profile
- the registry row for `runtime-boundary-family` has fixture witness evidence
- at least one sibling-runtime suffix exchange/admission claim is backed by an
  inspectable witness
- unproved cross-repo claims remain visible as gaps rather than folklore

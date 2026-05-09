---
title: Minimum Runtime Boundary Contract Family
status: proposed
---

# Minimum Runtime Boundary Contract Family

## Why

Continuum already has real shared families for neighborhood, receipt, and
settlement, but the active stack still lacks one minimum runtime-boundary cut
that answers the immediate interoperability questions:

- what does an app-side set operation compile into?
- what is the immediate runtime result of admission?
- what is the get-side plan/request/result split?
- what is the shared import/export shell for remote suffixes?

Without that cut, Echo, `warp-ttd`, Wesley, and app repos will keep guessing.

## Goal

Freeze one minimum authored family containing:

- `IntentEnvelope`
- `TickResult`
- `ObserverPlan`
- `ObservationRequest`
- `ReadingEnvelope`
- `WitnessedSuffixShell`
- `CausalSuffixBundle`
- `ImportOutcome`

and make that family the next concrete compiler/runtime target.

## Dead-code / cruft posture

This slice should also reduce Continuum cruft rather than add to it.

That means:

- no overlapping packet pile saying the same runtime-boundary thing in
  different words
- no product-local `apps/warp` types quietly becoming shadow contract owners
- no local smoke or tmp scaffolds being treated as canonical repo truth

Current audit posture:

- tracked executable surface in `apps/warp` is small and not obviously dead
  code
- the bigger cruft risk is overlapping contract doctrine, not abandoned
  runtime modules
- local `tmp/warp-smoke` style proof residue should stay local/ignored and not
  influence authored contract truth

## Done When

- one Continuum design packet defines the minimum family boundary
- one authored schema exists for that family
- the schema is narrow enough that Echo, Wesley, `warp-ttd`, and apps can all
  point at it as the next shared seam
- the packet explicitly says what this family does **not** yet own

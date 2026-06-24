---
title: Footprint As Focus Boundary
status: archived
---

# Footprint As Focus Boundary

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Reconcile the formal `F` object with the existing runtime/product noun
`footprint` so we do not let two parallel vocabularies drift.

The question is:

> do we need both `F` and `footprint`, or is one the formal reading of the
> other?

## Starting Point

The optics note already says the important thing:

- the WARP notion of a footprint is very close to the optic notion of a focus
  boundary
- it answers what the rewrite reads, writes, affects, and where lawful
  reintegration must occur

And the worked example already uses footprint in exactly that expanded sense.

So the current packet is not inventing a new ontology. It is exposing one that
was already implicit.

## Main Claim

The main claim is:

**`footprint` is the runtime/product noun. `F` is the formal role that a
serious footprint plays in the local evaluation story.**

So:

- we do not need a new public noun next to footprint
- we do need to stop under-specifying footprint

That is the reconciliation.

## Clean Relationship

The clean relationship is:

- `footprint` = the concrete WARP noun used in product/runtime/design surfaces
- `F` = the formal site-definition slot in the evaluation story

In other words:

**a focus boundary is the mathematical interpretation of a sufficiently rich
footprint.**

That means:

- if the current implementation only treats footprint as read/write-ish metadata,
  then the implementation is too thin
- if footprint is enriched to cover the full local-site role, then `F` and
  footprint line up cleanly

## Why This Is Better Than Introducing A New Public Noun

If we introduced `focus boundary` as a second runtime noun next to `footprint`,
we would create fresh drift:

- docs would alternate between them
- product surfaces would become inconsistent
- engineers and agents would start wondering whether they differ in some hidden
  way

That is exactly the kind of mental sludge we are trying to kill.

So the better move is:

- keep `footprint` in runtime/product language
- keep `F` in formal math when useful
- make the mapping explicit once

## What A Serious Footprint Must Contain

If footprint is going to do the job of `F` honestly, it cannot just mean:

- "things written"

or even:

- "reads and writes"

It needs enough structure to answer the full local-site questions.

So the current best reading is:

`footprint ≈ F = (S, R, W, E, B)`

where:

- `S` = subject anchor set
- `R` = read boundary
- `W` = write boundary
- `E` = affect boundary
- `B` = reintegration boundary

This does not mean every implementation surface must expose five separate
fields immediately.

It does mean that if footprint does not preserve those distinctions somewhere,
it is not yet strong enough for the theory we are already using.

## Footprint Versus Aperture

This is one of the most important clarifications.

- `aperture` says what is visible under an observer
- `footprint` says what local site is in play for the rewrite/composition
  problem

So:

- aperture is about projection
- footprint is about locality, interaction, and reintegration

This is why the same observer can see a large region while a particular local
rewrite has a much smaller footprint.

And it is why `warp-ttd` can keep:

- a broad world/graph view
- but a narrowly scoped local merge/collapse site

without contradiction.

## Footprint And Lane Relevance

This reconciliation also strengthens the debugger story.

If footprint is the local site-definition object, then a lane is relevant when
it intersects the current footprint in a way that matters to:

- reads
- writes
- affects
- reintegration

That means the Worldlines view can honestly be:

- branch-family scoped
- footprint scoped
- and not just "every strand we know about"

This is a direct product consequence of taking footprint seriously.

## Footprint And Obstruction

Taking footprint seriously also clarifies why `A` and `O` had to be separated.

Footprint helps determine:

- which local overlaps count
- which dependencies count
- which lanes are relevant

But footprint alone does not determine the final outcome.

We still need:

- local braid geometry `A`
- governing frame `C`
- residual reintegration structure `R`

So the better dependency story is:

- `footprint` defines the local site
- `A` describes the geometry inside that site
- `Eval(A ; footprint, C, R) -> O`

This keeps the nouns clean:

- footprint = site
- geometry = relation
- outcome = verdict

## Where Earlier Theory Should Be Touched Up

Yes, earlier theory should eventually be harmonized.

The main touch-up rule is:

- where older notes say `focus boundary`, prefer explaining it as the formal
  reading of footprint
- where older notes use footprint too thinly, note that footprint must include
  read/write/affect/reintegration structure
- do not introduce a new public noun unless a real semantic distinction
  appears

So the direction is not "replace footprint."
It is "upgrade footprint."

## Practical Consequence

This yields a simple doctrine for active repos:

### In Math Notes

It is acceptable to use `F` when we need compact formal notation.

### In Product / Runtime / API Notes

Prefer `footprint`, but make sure it is not being used in a thin or misleading
way.

### In Cross-Repo Coordination

Continuum should treat:

- `footprint` as the shared noun
- `F` as the formal variable bound to that noun

This is the least sludgy arrangement.

## Two Useful Sentences

1. **Footprint is the runtime noun; `F` is the formal role it plays.**
2. **A serious footprint is the bounded site-definition object for a local optic problem.**

## Remaining Questions

This packet resolves the naming split, but still leaves real work:

1. Do we expose the full `(S, R, W, E, B)` structure directly, or normalize it
   into one richer footprint object with derived views?
2. Are `E` and `B` truly independent coordinates of footprint?
3. Which existing repo docs use footprint too thinly and should be corrected?

## Playback Questions

1. Does this eliminate the need for a separate public `focus boundary` noun?
2. Does the runtime noun `footprint` now feel strong enough to carry the math?
3. Does this give us a clean rule for touching up earlier theory without
   creating fresh vocabulary drift?

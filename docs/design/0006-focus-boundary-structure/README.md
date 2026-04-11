---
title: Focus Boundary Structure
status: proposed
---

# Focus Boundary Structure

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Give `F`, the focus boundary, enough formal structure that it stops acting like
"some region thing" and starts acting like a real part of the local witness and
evaluation frame.

The goal is to answer:

- what is `F`, actually?
- what must it preserve?
- how does it differ from an observer/aperture?
- how does it determine locality, overlap, and lane relevance?

## Starting Point

The previous packets already rely on `F` heavily:

- `F` bounds the local site
- `F` prevents the neighborhood from inflating into a global search problem
- `F` affects whether a site appears commutative or obstructed
- `F` helps determine which lanes are relevant to the current site

And the older optics material already pointed this way:

- footprint is the optic notion of a focus boundary
- it answers what the rewrite reads, writes, affects, and where lawful
  reintegration must occur

So this packet is making that implicit role explicit.

## First Claim

The first claim is:

**`F` is not merely a region. `F` is the bounded site-definition object for a
local optic problem.**

That is why it matters so much.

It is what turns:

- a whole graph
- plus many lanes
- plus many possible overlaps

into:

- this local site
- with these relevant interactions
- under this bounded notion of "nearby"

## What `F` Must Do

At minimum, `F` must answer:

1. what is the local site?
2. what counts as in-bounds for local analysis?
3. which reads, writes, and effects are relevant here?
4. where must reintegration be checked?
5. which lane contributions are relevant to this site?

If a supposed focus boundary cannot answer those, it is not doing enough.

## Proposed Structure

The cleanest next cut is to treat:

`F = (S, R, W, E, B)`

where:

- `S` = subject anchor set
- `R` = read boundary
- `W` = write boundary
- `E` = affect boundary
- `B` = reintegration boundary

The names are provisional. The roles are the important part.

## Why These Components

### 1. Subject anchor set `S`

This says what the local site is *about*.

Examples:

- staged file set
- selected symbol set
- one task node and its immediate causal neighborhood
- one merge/collapse target

Without `S`, there is no way to say why this site was chosen rather than some
other nearby region.

`S` is the semantic anchor of locality.

### 2. Read boundary `R`

This says what the local analysis is allowed or required to inspect.

It answers:

- which context the local rewrite depends on
- which hidden dependencies might matter
- where overlap can arise through reads even if writes do not collide

This matters because a site can appear independent at the write level but still
fail due to a read dependency.

So `R` is necessary.

### 3. Write boundary `W`

This says what the local rewrite is allowed or intended to change directly.

It is the most familiar part of footprint thinking.

This matters for:

- direct overlap
- conflict or commutation tests
- derived-lane construction

So `W` is necessary.

### 4. Affect boundary `E`

This says what is materially changed or semantically affected, even if it is
not written directly as a primitive field update.

This matters because:

- some rewrites have a narrow write set but a wider semantic effect set
- lane relevance often depends on effects, not just direct writes
- the local neighborhood should capture meaningful nearby alternatives, not
  only byte-identical writes

So `E` is necessary if `F` is to support real local analysis instead of a too
thin implementation trace.

### 5. Reintegration boundary `B`

This says where lawful reassembly into the whole must be checked.

This is the part most likely to be missed if we think of `F` as only a read/write set.

`B` matters because:

- a rewrite can look locally plausible but fail at reassembly
- some nearby alternatives differ only in reintegration viability
- the witness and residual structure need a place to attach

So `B` is necessary.

## Why `F` Is Not The Same As Observer / Aperture

This distinction matters a lot.

### Aperture / Observer Frame

An observer or aperture says:

- what is visible
- what is hidden
- what is summarized
- what is redacted

This is a projection question.

### Focus Boundary

`F` says:

- what local site is in play for the optic problem
- what counts as a local dependency
- where overlap and reintegration must be checked

This is a locality and composition question.

So the clean split is:

- aperture answers "what can be seen?"
- focus boundary answers "what counts as this local site?"

These are related, but not identical.

## Minimal Rules For `F`

The packet does not prove a full formal system, but it does suggest three good
rules.

### Rule 1: Boundedness

`F` must be finite or effectively bounded for the local site under the current
analysis mode.

Otherwise local optic neighborhoods collapse into global search.

### Rule 2: Monotonicity Of Enlargement

If `F` is enlarged, the local neighborhood may:

- reveal more overlaps
- reveal more obstructions
- reveal more nearby alternatives

but it should not arbitrarily lose already-valid local distinctions without
explicit projection/lowering changes.

That means enlarging `F` changes the problem by adding context, not by
rewriting the meaning of existing structure.

### Rule 3: Relevance Criterion

A lane is relevant to the current site if it intersects `F` in a way that
matters to one of:

- `R`
- `W`
- `E`
- `B`

This gives the first clean criterion for lane relevance in the debugger.

## Consequences For `A`

This packet also clarifies the relation between `F` and `A`.

`A` is the raw local braid geometry.
`F` selects which part of that geometry counts as the current site.

So a better dependency picture is:

- `A` = site-capable geometry
- `F` = site selector / boundary
- `O = Eval(A ; F, C, R) =` evaluated result

This means:

- `A` without `F` is too global for Level 2 locality
- `F` without `A` is just an empty boundary declaration

They need each other, but they are not the same thing.

## Consequences For `warp-ttd`

This packet sharpens the Worldlines view directly.

The Worldlines view should not ask:

- what lanes exist?

It should ask:

- what lanes intersect the current focus boundary in a way that matters?

That means:

- some strands can be hidden because they do not intersect the current site
- the same repo can yield a much smaller, more relevant branch-family view
- the UI can justify why a lane is present: read overlap, write overlap, effect
  overlap, or reintegration relevance

This is much stronger than an ad hoc relevance heuristic.

## Consequences For Witness Design

If `F` has the shape proposed here, then a Level 2 witness needs more than a
single vague "footprint" blob.

It should preserve enough to reconstruct:

- the subject anchor
- the read/write/affect/reintegration boundaries

Whether those are stored separately or normalized into one richer footprint
object is an implementation choice. But the distinctions should not be lost.

## Remaining Open Questions

This packet makes `F` more real, but still leaves good work to do.

1. Are `E` and `B` genuinely separate, or should one be derived from the other
   in a tighter model?
2. What is the smallest useful substrate representation of `F` for a real
   implementation?
3. When do two different focus boundaries define the same local site?
4. How should observer aperture and focus boundary interact when one is wider
   than the other?

## Two Useful Sentences

1. **`F` is the bounded site-definition object for a local optic problem.**
2. **A lane is relevant when it intersects the current focus boundary in a way that matters to read, write, affect, or reintegration.**

## Playback Questions

1. Does `F = (S, R, W, E, B)` feel like a useful next structure rather than
   an arbitrary decomposition?
2. Does this sharpen the difference between aperture and focus boundary?
3. Does the lane relevance rule feel strong enough to guide `warp-ttd` views?

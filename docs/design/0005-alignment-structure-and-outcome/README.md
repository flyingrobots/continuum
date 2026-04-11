---
title: Alignment Structure And Outcome
status: proposed
---

# Alignment Structure And Outcome

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Answer the next hard center:

> is `O`, the obstruction or acceptance outcome, intrinsically linked to `A`,
> the alignment and overlap structure?

The goal is to determine whether:

- `O` should really be part of `A`
- `O` is entirely separate from `A`
- or `O` is induced from `A` only relative to other witness components

This matters because `A` is doing a lot of hidden work already:

- braid identity
- local neighborhood shape
- commutation
- obstruction
- relevant-lane filtering
- merge/collapse explanation

## Starting Point

From the previous packet:

- `A` = alignment and overlap structure
- `O` = obstruction or acceptance outcome

The packet already hinted that `O` may not be a pure primitive:

- some notion of obstruction is likely substrate-side
- but observed/declared outcome also depends on governing frame and
  reintegration law

This packet makes that split explicit.

## First Claim

The first claim is:

**`A` is not the same thing as `O`.**

`A` describes the local relation among lanes at the site.
`O` describes what follows when we evaluate that relation under a particular
bounded law/policy/reintegration frame.

So `A` is geometric/structural.
`O` is evaluative/resultive.

That is the cleanest first cut.

## What `A` Really Is

`A` should be thought of as the minimum local structure that preserves:

- which lanes are aligned at the site
- where they overlap
- where they diverge
- what local dependencies hold
- what local interferences are possible

So a useful informal decomposition is:

`A = (anchor relation, overlap relation, divergence relation, dependency relation)`

The exact names may change, but the point is:

`A` is the substrate-side local geometry of the braid site.

It tells us what the local situation *is*.

## What `O` Really Is

`O` should be thought of as the local result of evaluating that site under the
relevant law.

Typical possibilities:

- lawful acceptance
- lawful commutation
- lawful but policy-pending plurality
- obstruction
- obstruction plus admissible enriched preservation

So `O` tells us what the system can honestly say or do *about* the site under
the current governing frame.

It tells us what the local situation *means for action or admission*.

## Why `O` Is Not Intrinsic To `A` Alone

The shortest reason is:

the same local alignment geometry can yield different outcomes under different
frames.

That means `A` alone cannot generally determine `O`.

### Example 1: Different Policy Frames

Suppose two local rewrites overlap the same region.

The raw overlap geometry is unchanged.

But:

- under one merge law, the site may be an obstruction
- under another merge law, the site may admit an enriched merge
- under a stronger domain-specific composition law, the site may admit lawful
  composition

Same `A`.
Different `O`.

So `O` is not intrinsic to `A` alone.

### Example 2: Different Observer / Focus Frames

Suppose the full substrate site contains an overlap, but the current bounded
focus excludes the conflicting portion.

Then:

- with one focus boundary, the local site appears commutative
- with a wider focus boundary, the local site appears obstructed

Same underlying local geometry.
Different effective evaluation at the chosen site.

So `F` matters, not only `A`.

### Example 3: Residual Reintegration Structure

Suppose two local rewrites look compatible at the overlap level, but one lacks
the residual structure needed for lawful reintegration.

Then:

- from bare alignment, they seem composable
- once reintegration residue is considered, they obstruct

Same `A`.
Different `O`.

So `R` matters, not only `A`.

## Stronger Claim

The stronger and more useful claim is:

**`O` is induced by `A` under `(F, C, R)`.**

That is:

`O = Eval(A ; F, C, R)`

where:

- `F` = focus boundary
- `C` = governing frame
- `R` = residual reintegration structure

This formula is not meant as final notation. It expresses the dependency
pattern:

- `A` supplies the local geometry
- `F` says which part counts as the site
- `C` says what law/policy/observer frame is being used
- `R` says whether reintegration is actually possible

Then `O` is the evaluated local result.

## Is `O` Ever Intrinsic To `A`?

Sometimes, yes, but only in restricted senses.

### Substrate-Level Intrinsic Cases

If the governing law is fixed and built into the substrate at the relevant
level, then some parts of `O` may be treated as intrinsic to `A`.

For example:

- if disjoint footprints always commute under the substrate law, then a certain
  acceptance result may follow directly from `A`
- if a certain overlap form is always forbidden, then a certain obstruction may
  follow directly from `A`

In those cases, we can say:

`A` determines `O` *relative to a fixed law.*

But that qualifier matters.

### Observer/Presentation-Level Cases

At observer or lowering levels, `O` is much less intrinsic.

Different observers may:

- hide the relevant overlap
- merge distinctions presentation-wise
- expose different local alternatives

So observer-relative `O` should almost never be folded into `A`.

## Proposed Clean Split

The clean split is:

- `A` = local braid geometry
- `O` = evaluated local result

with `O` produced by:

`Eval : (A, F, C, R) -> O`

That is the main answer of this packet.

## Consequences For Witness Design

This has a direct implication for `W₂`.

The previous packet treated `A` and `O` as separate witness components. I think
that remains correct.

Why:

- if we fold `O` into `A`, we hide the distinction between geometry and
  evaluated result
- if we drop `O`, we lose the explicit current result reference
- if we keep them separate, we can compare:
  - same `A`, different `O`
  - or same `O`, different underlying `A`

That is much more informative.

So the likely refined doctrine is:

- `A` belongs to the substrate-side structural core
- `O` belongs to the evaluated local result
- the witness should usually preserve both

## Consequences For `warp-ttd`

This split clarifies the UI surfaces.

### Worldlines View

The worldlines view depends primarily on `L` and `A`:

- which lanes participate?
- how are they locally related?

It should not be driven directly by `O`.

Why:

the set of relevant lanes exists before we decide whether the site is accepted,
obstructed, or policy-pending.

### Merge / Collapse Inspector

The inspector should probably show:

- the site geometry `A`
- the current evaluation `O`
- the governing frame `C`
- nearby alternatives that could change `O`

That gives the user the right distinction:

- what the site is
- what the system currently says about it

## Consequences For Math

This packet resolves one ambiguity but opens a sharper question:

What is the smallest useful mathematical model of `A`?

Now we can ask that cleanly, because we are no longer trying to pack outcome
into the same noun.

The next likely theorem cut is:

- define a minimal internal structure for `A`
- identify which fragments of `A` are sufficient for:
  - relevance filtering
  - commutation tests
  - obstruction tests
  - neighborhood generation

## Two Useful Sentences

1. **`A` says what the local braid site is.**
2. **`O` says what follows when that site is evaluated under a bounded frame.**

## Playback Questions

1. Does the `Eval(A ; F, C, R) -> O` split feel like the right dependency
   shape?
2. Does this make it clearer why the same site can produce different outcomes
   under different policies or observers?
3. Does keeping `A` and `O` separate make the debugger and witness stories
   cleaner?

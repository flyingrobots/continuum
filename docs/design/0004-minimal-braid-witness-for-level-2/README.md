---
title: Minimal Braid Witness For Level 2
status: proposed
---

# Minimal Braid Witness For Level 2

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Answer the tightest open question from the previous packet:

> what is the minimal braid witness sufficient for Level 2 local optic
> counterfactual strength?

And answer two adjacent questions while we are here:

- which parts of the local optic neighborhood are observer-invariant?
- when do two witness presentations encode the same local neighborhood?

The goal is not a finished theorem-proof stack. The goal is a clean
coordination doctrine that can drive later math and product work.

## Starting Point

The previous packet defined:

- Level 1 counterfactual strength = replay/audit only
- Level 2 counterfactual strength = enough to explore nearby lawful
  alternatives
- Level 3 counterfactual strength = broad or global Aionic exploration

This packet is about Level 2.

That means the witness must support more than:

- what happened
- what was accepted
- what was rejected

It must support:

- what else was nearby and lawful
- what nearby alternatives failed and why
- which differences are real versus observer/lowering artifacts

## Definition: Level 2 Sufficiency

A braid witness is **Level 2 sufficient** when it preserves enough structure to
reconstruct the local optic neighborhood at one braid site under a fixed
observer/policy frame, together with enough residual structure to distinguish:

- nearby lawful local rewrites
- nearby lawful reintegrations
- nearby obstructions
- observer-collapse artifacts from genuine local differences

That is the target.

## Proposed Minimal Witness Shape

The proposed minimal witness is:

`W₂ = (P, L, A, F, C, R, O)`

where:

- `P` = shared precursor anchor
- `L` = participating lane set
- `A` = alignment and overlap structure
- `F` = focus boundary
- `C` = governing frame
- `R` = residual reintegration structure
- `O` = obstruction or acceptance outcome

The symbols are not sacred. The structure is.

## Why Each Component Is Necessary

### 1. Shared precursor anchor `P`

This identifies the common causal site from which the local alternatives are
being considered.

Without `P`, "nearby alternative" floats free of its causal origin.

You may still be able to replay one chosen result, but you cannot honestly say:

- what else could have happened from here
- what counts as "same site"
- whether two alternatives are actually adjacent

So `P` is necessary.

### 2. Participating lane set `L`

This identifies the lanes that make up the braid site.

Without `L`, the witness loses the actual plural causal context.

You can no longer tell:

- which branch contributed what
- which strands are relevant to the local site
- whether some candidate alternative depends on a lane that is not even in play

This matters directly for `warp-ttd`: a worldlines view scoped to the current
site needs `L` to know which strands are relevant and which ones can be
excluded.

So `L` is necessary.

### 3. Alignment and overlap structure `A`

This is the minimum structure that says how the participating lanes relate at
the local site.

It must preserve enough to answer:

- where they overlap
- where they diverge
- what commutes
- what obstructs
- what merely differs by presentation or ordering

Without `A`, there is no honest local neighborhood, only a bag of branches.

So `A` is necessary.

### 4. Focus boundary `F`

This is the bounded region of the whole that defines the local site.

Without `F`, the neighborhood inflates into an unbounded global search problem.

Level 2 is explicitly local, so the witness must preserve locality.

So `F` is necessary.

### 5. Governing frame `C`

This is the effective frame under which the local alternatives are judged.

It must preserve enough to recover:

- the observer/aperture assumptions
- the policy assumptions relevant to lawfulness
- the admission or composition law being used

Without `C`, "lawful alternative" is unstable because the notion of lawful has
changed underneath you.

So `C` is necessary.

### 6. Residual reintegration structure `R`

This is the residual information needed to distinguish:

- a nearby local rewrite that can still be lawfully reassembled
- a nearby local rewrite that immediately breaks reintegration

Without `R`, the witness may support replay but cannot support bounded local
exploration of alternatives.

This is the difference between "what happened" and "what else nearby could have
worked."

So `R` is necessary.

### 7. Obstruction or acceptance outcome `O`

This records whether the local site currently represents:

- a lawful accepted composition
- a local obstruction
- a policy-pending fork

Without `O`, the neighborhood lacks a reference result against which nearby
alternatives are being compared.

`O` does not have to be large. It just has to be explicit.

So `O` is necessary.

## What Is Not Minimal

The following may be useful, but they are not part of the proposed minimum:

- the entire graph state
- every future branch beyond the local site
- every possible observer
- fully materialized lowerings for every candidate alternative
- complete execution traces outside the local site

Those can strengthen the witness, but they are not required for Level 2.

## A Good Informal Sufficiency Test

If a witness is really Level 2 sufficient, it should let a tool answer these
questions at one site without re-running the whole universe:

1. What branches are relevant here?
2. What local alternatives were actually nearby?
3. Which of them were lawful?
4. Which failed, and why?
5. Which differences are observer/policy artifacts rather than genuine local
   divergence?

If the witness cannot answer those, it is below Level 2.

## Observer-Invariant Versus Observer-Relative Parts

This is the second open question.

The local optic neighborhood is not wholly observer-invariant, but it is not
wholly observer-relative either.

### Likely Observer-Invariant Core

These parts should survive changes of observer, even if they are described
differently:

- the shared precursor anchor `P`
- the participating lanes `L`
- the raw alignment/overlap structure `A`
- the bounded site identity `F` at an appropriate substrate level
- the existence of an obstruction versus a lawful local composition, if judged
  at the substrate law rather than at one lowering

This is the substrate-side core.

### Likely Observer-Relative Layer

These parts depend on the observer frame:

- which alternatives are visible at all
- which alternatives collapse to the same apparent result
- which differences are deemed meaningful
- which lowerings are considered nearby
- the effective size of the local rulial ball over the neighborhood

This is the frame-relative presentation and accessibility layer.

### Good Rule

The braid witness should preserve enough substrate-side core that different
observers can still argue about the same site, even if they do not see the same
neighborhood structure.

That is the clean split.

## Witness Equivalence

This answers the third open question.

Two witness presentations should count as Level 2 equivalent when they induce
the same local optic neighborhood **up to the relevant observer translation
equivalence**.

In plainer language:

two witnesses are equivalent if they preserve the same nearby lawful
alternatives and the same obstruction structure, even if they package or encode
that structure differently.

That suggests a practical equivalence test:

`W₂ ~ W₂'` if they agree on:

- the site anchor
- lane membership
- overlap/interference structure
- effective focus boundary
- governing frame
- which nearby alternatives remain lawful
- which nearby alternatives obstruct

and differ only by:

- encoding format
- redundant trace detail
- observer-translation choices inside the same local rulial ball

This is not yet a proof-ready equivalence relation, but it is a useful
engineering doctrine.

## Two Useful Propositions

These are the theorem-shaped claims worth carrying forward.

### Proposition A: Necessity

Any witness lacking one of `P, L, A, F, C, R, O` is not generally sufficient
for Level 2 local optic counterfactual strength.

Reason:

removing any one of those components destroys either locality, lawfulness,
branch identity, reintegration viability, or outcome reference.

### Proposition B: Frame-Split

The local optic neighborhood factors into:

- an observer-invariant substrate core
- and an observer-relative accessibility/presentation layer

This is why a local optic neighborhood and a local rulial ball are related but
not identical.

## Consequences For `warp-ttd`

This packet sharpens a few product implications immediately.

### Worldlines View

The worldlines view should be scoped by `L`, the participating lane set at the
current site.

That means it can exclude strands that are not relevant to the current tick or
current local braid site.

So the view is not "all strands in the repo."
It is the locally relevant branch family.

### Merge / Collapse Inspector

If `warp-ttd` wants a real neighborhood browser later, it should surface:

- the current site anchor
- participating lanes
- overlap/obstruction structure
- current governing frame
- nearby lawful alternatives
- nearby failed alternatives and their obstruction reasons

That is a direct product cut from `W₂`.

## Consequences For Contract Surfaces

If Level 2 becomes a real capability, the stack probably needs explicit nouns
for:

- branch family
- braid witness
- focus boundary
- governing frame
- obstruction outcome
- local rulial-ball scope

This is likely a Wesley/TTD/Continuum coordination problem before it is a
runtime implementation problem.

## Remaining Open Questions

This packet resolves some questions, but not all.

Still open:

1. Is `O` best modeled as part of the witness or as a separate local result
   object carried alongside it?
2. What is the smallest useful mathematical model of `A`, the alignment and
   overlap structure?
3. Can `R`, the residual reintegration structure, itself be minimized further
   into a canonical witness core plus operational shell?
4. What metric on local neighborhoods would be most useful in tooling:
   distance, branching factor, or density of lawful alternatives?

## Playback Questions

1. Does the proposed `W₂` split feel minimally sufficient rather than padded?
2. Does the observer-invariant versus observer-relative split feel like the
   right seam?
3. Does witness equivalence now feel like an inspectable engineering question
   rather than a vague metaphysical one?

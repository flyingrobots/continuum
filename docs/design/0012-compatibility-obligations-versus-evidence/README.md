---
title: Compatibility Obligations Versus Evidence
status: archived
---

# Compatibility Obligations Versus Evidence

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Answer the next sharp question inside:

`R_core = (J, K, V)`

The question is:

> are `K` and `V` really separate, or did we split one thing into two names?

This matters because if they are not genuinely distinct, the current residual
core can be simplified. If they are distinct, the separation buys us a real
law/evidence joint that later contracts and debugger surfaces should preserve.

## Starting Point

The residual packet proposed:

- `J` = seam anchors
- `K` = compatibility obligations
- `V` = residual compatibility witness

That was the first clean cut.

But the packet also left the obvious next pressure point:

- maybe `K` is just a fancy name for the conditions encoded in `V`
- maybe `V` is just a concrete presentation of `K`

This packet answers that.

## Main Claim

The main claim is:

**`K` and `V` are linked but irreducible.**

More precisely:

- `K` is the **normative side** of fit:
  what must hold at the seam
- `V` is the **evidential side** of fit:
  the hidden information needed to determine or justify that it does hold

So the cleaner reading is:

- `K` = seam law
- `V` = seam evidence

That is not redundant structure.

## Why The Distinction Matters

If we collapse `K` into `V`, then hidden data and the law it is supposed to
justify become the same thing.

If we collapse `V` into `K`, then we only name the law but do not preserve the
hidden evidence needed to decide whether it is actually satisfied.

Both collapses are bad:

- one destroys normativity
- the other destroys decidability or justification

So the split is doing real work.

## What `K` Is

`K` is the compatibility rule family at the seam.

It answers:

- what must line up?
- what counts as lawful fit?
- which invariants still bind here?
- what makes a reintegration admissible rather than broken?

Examples:

- identity uniqueness
- parentage compatibility
- admissible attachment law
- provenance interface rules
- canonical admission law

These are obligations.
They are not yet the hidden facts that show they hold.

## What `V` Is

`V` is the minimal hidden information needed to check or justify that the
obligations in `K` are satisfied for this candidate reintegration.

It answers:

- which hidden anchors are actually being matched?
- what hidden prior values or correspondences matter?
- what residual context makes this seam compatible?
- what hidden mismatch explains failure?

Examples:

- hidden anchor identity
- prior hidden value needed for comparison
- correspondence between speculative and canonical attachment points
- hidden ordering or adjacency information

These are evidential carriers.
They are not themselves the law.

## The Cleanest Distinction

The best short split is:

1. **`K` says what fit means.**
2. **`V` says what hidden facts decide or justify whether fit is achieved.**

That is much cleaner than thinking of both as generic "compatibility data."

## Why `K` Does Not Determine `V`

You can know the obligation without knowing the hidden evidence required to
evaluate it.

Example:

- seam law says identity must be unique and attachment parentage must match

That tells you what fit means.

It does not tell you:

- which hidden anchor identity this candidate is actually targeting
- which prior hidden correspondence matters
- which residual parent relation is the relevant one

So:

- `K` can be known
- while `V` is still missing

This is a real failure mode:

- the rule is known
- the evidence needed to apply the rule is absent

So `K` does not determine `V`.

## Why `V` Does Not Determine `K`

You can also have hidden evidence without a unique rule family that says what
to do with it.

Example:

- you have hidden anchor identity and prior correspondence data

That does not yet tell you:

- whether identity uniqueness is the relevant obligation
- whether parentage or provenance interface law matters
- whether one policy admits the reintegration while another rejects it

So:

- `V` can be present
- while `K` is still underdetermined by the governing frame

This is another real failure mode:

- evidence exists
- but the law of fit is ambiguous or varies by frame

So `V` does not determine `K`.

## The Better Dependency Picture

The residual packet used:

`(J, K) -> what must fit`

`V -> the hidden evidence needed to test or justify fit`

This packet sharpens that further:

`Eval_fit(J, K, V ; C) -> satisfied | obstructed | underdetermined`

That is:

- `J` identifies the seam
- `K` gives the law of fit
- `V` gives the hidden evidence
- `C` still matters because the governing frame may choose or constrain the
  relevant obligation family

This is a much better evaluator than any "compatibility blob" story.

## A Useful Analogy

The clean analogy is:

- `K` is like a theorem statement or contract clause
- `V` is like the witness or proof artifact for one local instance

Do not push the analogy too literally, but it is directionally right:

- law and evidence are not the same object
- both are required for local judgment

That is exactly why the split buys us something.

## Example 1: Effect Entity

Take the patch that adds a new `@warp/effect:*` node.

Then:

- `K` may include:
  - identity uniqueness
  - lawful graph attachment
  - provenance compatibility
- `V` may include:
  - the hidden actual anchor identity
  - the hidden attachment correspondence
  - the hidden non-collision evidence

Those are not the same thing.

You can know the rules and still lack the hidden anchor evidence.
You can have the hidden anchor facts and still need the rules that interpret
them.

## Example 2: Strand Collapse

Take strand collapse into canonical provenance.

Then:

- `K` may include:
  - canonical admission law
  - provenance shape law
  - target-lane compatibility obligations
- `V` may include:
  - the hidden correspondence between the speculative slice and canonical
    attachment points
  - hidden anchor identities or prior canonical references

Again:

- `K` is the rule family
- `V` is the hidden evidence for this candidate collapse

That is not duplication.

## Consequences For Wesley

This distinction matters directly for contracts.

If Wesley eventually compiles shared contracts around these nouns, it should
not publish one undifferentiated "compatibility" field if the semantics really
contains:

- rule family
- evidence carrier

That means a later contract surface may want different publication choices:

- some obligations are authored/shared
- some evidence is host/runtime-local
- some evidence may only appear in richer receipt or debugger surfaces

So this split buys us a better publication boundary too.

## Consequences For `warp-ttd`

The debugger implication is also strong.

If a local reintegration fails, the tool should ideally be able to say both:

- which obligation failed
- what hidden evidence made it fail

Those are different explanatory layers.

Without the split, the UI will blur:

- "what the rule was"
- with
- "what hidden fact made this instance violate it"

That would be a worse debugger.

## Simpler Restatement

If the packet still feels too ornate, the simplest honest version is:

- `K` = what the seam demands
- `V` = what the seam reveals, hiddenly, about whether that demand is met

That is a good enough engineering sentence.

## Two Useful Sentences

1. **`K` is the law of seam compatibility; `V` is the hidden evidence of seam
   compatibility.**
2. **A lawful reintegration judgment needs both rule and evidence, not one
   generic compatibility blob.**

## Playback Questions

1. Does the law/evidence split make `K` and `V` feel genuinely non-redundant?
2. Does `Eval_fit(J, K, V ; C)` feel like the right next evaluator shape?
3. Does this give a better contract/debugger boundary than a single
   compatibility field would?

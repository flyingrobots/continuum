---
title: Witness Refinement And Equivalence
status: proposed
---

# Witness Refinement And Equivalence

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Now that the stack contains:

- `R_core`
- `W_core`
- `ReceiptRecord = (W_core, S_receipt)`

we can finally ask the next honest question:

> when are two witness presentations the same, and when is one a refinement of
> the other?

This is the question that turns the current noun cleanup into actual boundary
law.

## Starting Point

The earlier witness packet already asked when two witness presentations encode
the same local neighborhood.

The newer packets now give us enough structure to answer that more cleanly:

- `R_core` carries reintegration-bearing seam structure
- `W_core` carries the law-bearing local site witness
- `S_receipt` carries explanatory or operational refinement

So the next needed split is:

- refinement of the core
- refinement of the shell
- equivalence of whole witness presentations

Those are not the same relation.

## Main Claim

The main claim is:

**witness refinement and witness equivalence must be purpose-indexed and
layered.**

That means:

- core refinement is not the same as shell enrichment
- presentational differences are not the same as semantic differences
- two witnesses can be equivalent for one purpose and not for another

This is the right level of strictness.

## Three Relations, Not One

The cleanest way to keep this sane is to define three relations.

### 1. Core refinement

This compares witness cores.

Question answered:

> does one core preserve at least the lawful site structure of another?

### 2. Shell refinement

This compares receipt or operational shells around a fixed or equivalent core.

Question answered:

> does one presentation explain or annotate the same core more richly?

### 3. Purpose-indexed equivalence

This compares whole witness presentations relative to a stated purpose.

Question answered:

> for this purpose, do these two presentations support the same lawful
> judgments and local neighborhood?

That is the right decomposition.

## Core Refinement

Let:

- `W_a`
- `W_b`

be witness cores for the same stated purpose `p`.

Then the clean rule is:

**`W_a ⪯_p W_b` when every lawful site judgment supported by `W_a` for purpose
`p` is also supported by `W_b`, with no loss of site identity.**

In plain language:

- `W_b` preserves at least what `W_a` preserves for that purpose
- and possibly more

For Level 2 local optic work, that means preserving at least:

- precursor anchor
- participating lanes
- alignment/overlap structure
- footprint
- governing frame
- reintegration core
- local verdict

So refinement at the core level is about preserved lawful capacity, not just
extra fields.

## Shell Refinement

Shell refinement is different.

Let:

- `S_a`
- `S_b`

be receipt shells around equivalent or shared witness cores.

Then:

**`S_a ⪯ S_b` when `S_b` adds explanatory, operational, or presentation detail
without changing the underlying core judgments.**

Examples:

- adding candidate search space
- adding rejection reasons
- adding scheduling metadata
- adding host/runtime trace annotations
- adding debugger-friendly lowerings

That is enrichment, not a stronger law-bearing core.

## Why This Distinction Matters

Without the split, one giant “refinement” relation would blur:

- stronger lawful carrier
- richer explanation

Those are not the same thing.

If we confuse them, then:

- a bigger receipt blob might be mistaken for a stronger witness
- or a stronger witness core might be mistaken for mere explanation

That would sabotage both contracts and tooling.

## Purpose-Indexed Equivalence

Now define the real target.

Two witness presentations:

- `P_a = (W_a, S_a)`
- `P_b = (W_b, S_b)`

are **equivalent for purpose `p`** when:

1. their witness cores are mutually refining for purpose `p`
2. their shells do not alter the lawful judgments of those cores
3. they induce the same purpose-relevant local neighborhood or decision space

The compact notation is:

`P_a ≃_p P_b`

This is much better than asking whether the raw records are byte-identical or
field-identical.

## What Counts As "The Same" For Level 2

For Level 2 local optic work, the right sameness test is:

two witness presentations are equivalent when they preserve the same:

- local site identity
- participating branches
- lawful nearby alternatives
- obstruction/acceptance distinctions
- reintegration viability distinctions

up to irrelevant presentation differences.

That means:

- different shell text can still be equivalent
- different hidden residual presentations can still be equivalent
- different local IDs can still be equivalent if they preserve the same lawful
  site structure

This is the kind of equivalence we actually need.

## Why Byte Equality Is Not The Right Test

This follows directly from the optic/coend story.

The hidden residual may have different concrete presentations that still induce
the same lawful reintegration judgments.

So:

- raw representation equality is too strong
- semantic equivalence for a purpose is the right target

This is another place where deeper math buys cleaner engineering.

## The Residual Case

This packet also sharpens the previous one.

For `R_core = (J, K, V)`, two residual cores should count as equivalent for
reintegration when they preserve the same:

- seam anchors up to the relevant identity equivalence
- compatibility obligations
- hidden evidence sufficient to induce the same seam-fit judgments

That means:

- `V` can vary in presentation
- without changing the equivalence class

as long as the same lawful reintegration judgments remain available.

That is the exact kind of quotient the earlier packet was reaching for.

## The Receipt Case

For receipt shells, equivalence is looser.

Two shells can differ widely and still refine the same core:

- one shell may carry a full candidate poset
- another may carry only accepted/rejected summaries
- another may carry host-local trace annotations

As long as they refine the same `W_core`, they may be different shells over the
same lawful carrier.

That is why the shell relation should be treated separately.

## A Good Evaluator Picture

The packet is easiest to remember if we picture three evaluators:

1. `Eval_core_p(W)`
   What lawful judgments does this core support for purpose `p`?

2. `Eval_shell(W, S)`
   What extra explanation or operational support does this shell add?

3. `Eq_p((W_a,S_a), (W_b,S_b))`
   Do these whole presentations support the same purpose-relevant lawful
   judgments?

That is the practical structure behind the math.

## Consequences For Wesley

This matters directly for contract publication.

If Wesley publishes:

- one minimal core contract
- one or more richer explanatory contracts

then it needs to know which surfaces are:

- refinements of the same core
- merely alternate presentations
- genuinely stronger or weaker for a stated purpose

That is exactly what this packet provides conceptually.

Without this, Wesley would only know how to publish blobs, not law-bearing
surfaces with refinement relations.

## Consequences For `warp-ttd`

This also matters to the debugger.

If `warp-ttd` compares two hosts or two runs, it should eventually be able to
say:

- same core judgment, richer shell here
- same Level 2 neighborhood, different presentation
- not equivalent: one side lacks reintegration-bearing evidence

That is much more useful than comparing raw JSON shapes.

## Two Useful Sentences

1. **Core refinement preserves lawful capacity; shell refinement preserves the
   same core while adding explanation.**
2. **Witness equivalence should be judged by purpose-relevant lawful judgments,
   not by raw record equality.**

## Playback Questions

1. Does the split between core refinement, shell refinement, and
   purpose-indexed equivalence feel necessary rather than ornamental?
2. Does this give a better answer to “when are two witness presentations the
   same?” than earlier packets could?
3. Does this set us up cleanly to return to the repos and ask what the
   generated/shared/public surfaces should actually be?

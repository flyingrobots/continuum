---
title: Affect Boundary Versus Reintegration Boundary
status: proposed
---

# Affect Boundary Versus Reintegration Boundary

## Sponsor

- sponsor-human: James
- sponsor-agent: Codex

## Hill

Answer the open question left by the footprint packets:

> are `E` and `B` genuinely different parts of footprint, or did we just name
> the same thing twice?

This matters because if they are truly distinct, later witness and debugger
design needs to preserve both. If they are not, we should collapse them now and
stop carrying fake structure.

## Starting Point

The previous packets established:

- `footprint` is the runtime/product noun
- `F` is the formal role that a serious footprint plays
- the current working structure is:

`footprint ≈ F = (S, R, W, E, B)`

where:

- `S` = subject anchor set
- `R` = read boundary
- `W` = write boundary
- `E` = affect boundary
- `B` = reintegration boundary

The earlier packet left one unresolved question:

> are `E` and `B` truly independent coordinates of footprint?

This packet answers that question.

## Main Claim

The main claim is:

**`E` and `B` are linked but distinct.**

More precisely:

- `E` is the **affect boundary**:
  what becomes meaningfully different if this local rewrite is taken
- `B` is the **reintegration boundary**:
  where the local result must still fit back into the whole lawfully

So the better reading is:

- `E` is the **consequence cone**
- `B` is the **stitching seam**

They are not the same question.

## Prefer "Affect" Over "Effect" Here

This packet also tightens the wording.

In the active stack, `effect` already means something specific and dangerous to
overload:

- graph-level effect entities
- host effect candidates
- delivery observations

That is not what `E` is doing here.

So the preferred reading is:

- `E` = **affect boundary**

not:

- `E` = effect-emission boundary

That keeps the footprint math from colliding with the effect architecture.

## The Write Nucleus And Two Different Closures

The cleanest way to think about the relation is:

- `W` is the direct write nucleus
- `E` and `B` are two different closures generated from that nucleus

Informally:

- `E` is the closure of `W` under meaningful local consequence
- `B` is the closure of `W` under lawful reassembly into the whole

That means:

- they often begin from the same local rewrite
- they may overlap heavily
- they are not derivable from the same rule

This is the heart of the distinction.

## What `E` Asks

`E` asks:

**what becomes different if this local site is taken?**

That includes more than direct writes.

It can include:

- derived semantic changes
- propagated local consequences
- neighboring structures whose meaning changes even if they were not written
- observer-visible differences caused by the local rewrite

So `E` is outward-facing.

It expands from the local rewrite toward its meaningful local consequences.

## What `B` Asks

`B` asks:

**where must this local result still fit back into the whole?**

That is a different question.

It includes:

- attachment points to the surrounding whole
- invariants or interfaces that must still line up
- seams where the residual context must still agree
- boundaries across which lawful reintegration must be checked

So `B` is whole-relative.

It does not primarily ask what changed.
It asks what must still match.

## Why `E` Does Not Determine `B`

The first temptation is:

> if I know everything the rewrite affects, I know where reintegration must
> happen.

That is too strong.

Here is a clean counterexample from the active stack.

### Example 1: Graph Effect Entity

Suppose a writer admits one new `@warp/effect:*` node in a patch.

The direct write nucleus is small:

- add one effect node
- set a few properties

The affect boundary can be much broader:

- effect observers may now see something new
- application logic may now consider a new outbound candidate
- delivery behavior may change

So the local consequences are wider than the tiny graph write.

But the reintegration boundary stays comparatively narrow:

- the new node must stitch lawfully into graph identity and provenance
- the patch must still fit the local graph invariants
- the residual whole must still accept the new node without breaking local law

So:

- `E` spreads toward observer/application consequence
- `B` stays focused on lawful graph reassembly

Knowing the consequence cone does not tell you the exact stitching seam.

## Why `B` Does Not Determine `E`

The second temptation is:

> if I know what seams must be checked for reintegration, then I know what is
> affected.

That is also too strong.

### Example 2: Strand Collapse Into Canonical Provenance

Suppose a speculative strand is being collapsed into canonical provenance for a
single staged artifact.

The semantic affect boundary may be narrow:

- one staged path
- one focused symbol
- one admitted canonical slice

But the reintegration boundary can be broader:

- the collapse target worldline anchor
- the provenance record interface
- the admissibility seam into canonical history
- the witness needed to preserve correspondence between the strand slice and
  the admitted result

That broader reintegration seam does not mean all of it is semantically
"affected" in the same direct way. Much of it is there because lawful
reassembly must be checked there.

So:

- `B` can be broader than the semantic affect region
- `B` alone does not tell you what became meaningfully different

## The Cleaner Distinction

The cleanest language I can see now is:

1. **`E` tracks where difference propagates.**
2. **`B` tracks where fit must be checked.**

Or even shorter:

1. **`E` = consequence cone**
2. **`B` = stitching seam**

That is much better than treating both as generic "extended footprint."

## Why They Still Feel Similar

They feel similar because both are induced from the same local site.

Both start from:

- the same subject anchor set
- the same read/write nucleus
- the same bounded local problem

And both can be approximated coarsely as "some nearby region."

That is why they were easy to blur.

But once we ask more exact questions, they separate:

- consequence is not the same as reassembly
- semantic propagation is not the same as residual compatibility

## Are They Sets?

Not necessarily, at least not in the strongest reading.

For implementation or debugger approximation, both may be represented as:

- node sets
- edge sets
- symbol sets
- path sets

But in the theory they are better understood as structured boundaries.

In particular:

- `E` may require consequence structure, not just membership
- `B` may require interface / seam structure, not just membership

So we should not overread them as plain subsets of one universal space.

The set-like approximation is useful, but it is not the whole story.

## When They Can Collapse

There are simple law classes where `E` and `B` can safely collapse.

Roughly:

- the rewrite is tightly local
- consequence does not propagate beyond the local stitch points
- reintegration is checked only where consequence is already present
- there are no wider derived observer-visible differences

In those cases, one implementation may normalize them into one richer
footprint facet.

That is fine as an optimization or simplified model.

But it should be read as a **degenerate coincidence**, not as the general law.

## Consequences For Footprint

The footprint story now gets cleaner:

- `W` = the direct write nucleus
- `E` = where difference propagates
- `B` = where fit must be checked

That means a serious footprint should preserve both views somehow, even if the
runtime stores them in one normalized object.

So the right doctrine is:

**Do not collapse `affects` and `reintegration` by default.**

If an implementation collapses them, it should do so knowingly and only for a
restricted law class.

## Consequences For Witness Design

The witness does not merely need to preserve:

- what was written

It also needs enough local structure to preserve:

- what nearby alternatives would differ meaningfully
- where lawful reintegration would succeed or fail

That means the witness must support reasoning over both:

- consequence cone
- stitching seam

This is another reason `E` and `B` should not be blurred.

## Consequences For `warp-ttd`

The debugger consequence is immediate.

If the Worldlines or neighborhood view is scoped only by direct writes, it will
be too thin.

If it is scoped only by reintegration seams, it may show too much structural
attachment noise.

So the better rule is:

- use `E` to understand meaningful local alternatives
- use `B` to understand lawful reassembly constraints

That means the debugger can distinguish:

- lanes that matter because they change what the site means
- lanes that matter because they constrain how the site can be reintegrated

Those are related, but not identical forms of relevance.

## Relation To Earlier Packets

This packet refines the earlier structure without overturning it.

The updated reading is:

`footprint = (S, R, W, E, B)`

with:

- `E` understood as **affect boundary**
- `B` understood as **reintegration boundary**

and the key warning:

**Do not treat them as duplicate names for one extended region.**

## Two Useful Sentences

1. **`E` says where the local difference propagates.**
2. **`B` says where the local difference must still fit back into the world.**

## Playback Questions

1. Does this make the relation between affect and reintegration cleaner than
   the earlier generic "extended footprint" phrasing?
2. Does this justify keeping both `E` and `B` in the formal footprint story?
3. Does the "consequence cone" versus "stitching seam" split feel strong
   enough to guide later witness and debugger design?

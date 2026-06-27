---
title: Publish runtime evidence that closes a contract-family gap
status: current
---

# Publish runtime evidence that closes a contract-family gap

Use this procedure when your repo (Echo, `git-warp`, Wesley, `warp-ttd`, Graft,
or an app/tool repo) has made a compatibility claim true and you want the
[Contract Family Registry](../contract-family-registry.md) to advance a family's
status from a gap to recorded evidence.

This is a conformance task. Continuum records the boundary claim and links to
your evidence. It does not host your runtime, your tests, or your schema body —
those stay in your repo.

## Expected result

A registry row whose status advances along the vocabulary
(`authored` → `profiled` → `fixture-witnessed` → `runtime-open` →
`interop-open` resolved), with an `Evidence today` entry that points to a real,
runnable check, and an `Open cut` that honestly states what remains.

## Prerequisites

- The family is already authored under [`schemas/`](../../schemas/README.md). If
  it is not, author it there first; a row may not point at a mirror, fixture, or
  generated artifact as if it were the authored family.
- Your evidence is inspectable: a named test, fixture, witness, or workflow run
  at a specific commit — not a plan and not a prose assertion.

## Procedure

1. Identify the family's registry row and the exact claim you are advancing
   (for example, "live sibling-runtime receipt publication" rather than fixture
   vectors).
2. In your own repo, land the check that produces the evidence. Name the
   narrowest practical executable case (see the [documentation standard](../DOCUMENTATION_POLICY.md) §11): the specific test
   or workflow, not the whole suite.
3. Open a pull request against Continuum that edits only the affected registry
   row. Update `Evidence today` to reference the executable check by stable
   name, and rewrite `Open cut` to state what is still missing — or remove it
   only if nothing remains.
4. State the exact oracle in the PR: the values, keys, ordering, states, or
   transitions the check asserts. "Correct", "stable", or "valid" alone is not
   an oracle.

## Verify success

Run the documentation gate and confirm the registry still passes coverage:

```bash
node scripts/docs-lint.mjs
```

Then confirm the claim against the status vocabulary in the registry. A claim is
only as strong as its recorded evidence:

- `fixture-witnessed` requires a fixture-backed witness, not a live runtime.
- `runtime-open` resolves only when a live sibling runtime emits or consumes
  conforming values and a witness records it.
- `interop-open` resolves only when two sibling runtimes exchange and admit
  conforming values across a real boundary.

## Common mistakes

- Advancing a row to make a claim aspirationally true. Record the gap instead
  (registry "Maintenance Rule").
- Citing translated substrate evidence as a native Continuum witness. Translated
  evidence cannot claim native witnesshood; keep the distinction explicit.
- Hand-maintaining a Git SHA or line number as the primary evidence anchor.
  Prefer a stable test or schema-symbol name.

## Related reference

- [Contract Family Registry](../contract-family-registry.md)
- [Schemas](../../schemas/README.md)
- [Cross-Repo Contract Family Registry packet](../design/0029-cross-repo-contract-family-registry/README.md)

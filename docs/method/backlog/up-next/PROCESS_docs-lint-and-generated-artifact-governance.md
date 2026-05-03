---
title: Docs Lint And Generated Artifact Governance
status: proposed
---

# Docs Lint And Generated Artifact Governance

## Why

The sibling-runtime doctrine PR exposed two repo hygiene gaps:

- broad `markdownlint` is currently noisy on repo-baseline issues such as
  `MD025`, `MD013`, and `MD036`
- broad `docs/**/*.md` lint also exposes older duplicate-heading and blank-line
  baseline noise such as `MD024` and `MD012`
- generated documents such as `docs/continuum-categories.pdf` do not yet have
  an explicit source/build/policy lane

That makes routine validation harder than it should be. A failed broad lint
run should mean the current change introduced a problem, not that every agent
has to rediscover the same known baseline.

## Goal

Create one practical docs governance cut that covers:

- a markdownlint config or baseline for the repo's actual Markdown shape
- a named distinction between changed-file lint, which is currently enforced,
  and broad repo lint, which still has known baseline debt
- a documented build command for `docs/continuum-categories.tex`
- a small generated-artifact policy for when PDFs belong in repo truth

## Candidate Policy

Generated PDFs should belong in repo truth only when at least one of these is
true:

- the PDF is externally meaningful release or review material
- the source is tracked and the build command is documented
- the PDF is the artifact consumers actually inspect

Otherwise, prefer source-only documentation and generated artifacts outside the
repo.

## Done When

- `markdownlint` can run with a repo-local config and produce useful signal
- PR reports state whether `markdownlint` ran against touched files or the
  whole docs tree
- the repo explicitly accepts or suppresses the current frontmatter/H1 pattern
- the repo has a documented command for rebuilding
  `docs/continuum-categories.pdf` from `docs/continuum-categories.tex`
- generated PDFs have a short inclusion policy instead of ad hoc precedent

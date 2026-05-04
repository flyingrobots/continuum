---
title: PR Readiness And Review Workflow
status: proposed
---

# PR Readiness And Review Workflow

## Why

The sibling-runtime doctrine PR showed that the branch can be technically
clean while the review loop is still not meaningful:

- draft PRs can cause CodeRabbit to skip review
- a manual CodeRabbit trigger may be needed
- generated artifacts need source/build evidence
- merge readiness needs more than a green status check

The repo should make that workflow explicit so future agents do not confuse a
skipped review for an accepted review.

## Goal

Add a short PR readiness checklist covering:

- draft versus ready-for-review state
- whether CodeRabbit should be manually triggered or held
- generated artifact source and rebuild evidence
- minimum review count, explicitly at least one human approval or the
  CODEOWNERS-required count if higher
- status checks and lint/test evidence
- rule that merge still requires explicit user approval
- whether Markdown lint evidence covers only touched files or the full docs tree

## Suggested Checklist Shape

- [ ] PR is intentionally draft or intentionally ready for review.
- [ ] If draft, PR body says whether CodeRabbit should be manually triggered.
- [ ] If generated artifacts changed, source files and build commands are
      documented.
- [ ] Broad checks are either passing or known baseline failures and the
      narrower enforced scope are named.
- [ ] CodeRabbit has completed a real review or is intentionally deferred.
- [ ] Required human review count is satisfied: at least one human approval or
      the CODEOWNERS-required count if higher.
- [ ] Merge approval has been requested explicitly and not inferred.

## Done When

- the checklist lives in the repo's METHOD or PR process docs
- draft PR handling is explicit
- CodeRabbit skip/rate-limit states have a documented response
- generated artifact review evidence is part of the normal PR report

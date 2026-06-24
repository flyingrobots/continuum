# Changelog

## Unreleased

- Audited every documentation file against source code and recorded the result
  in `docs/method/DOCUMENTATION_AUDIT.md` (per-claim verdicts with `path#line@sha`
  citations, accuracy scores, keep/merge/trash decisions, and a signpost +
  `docs/topics/` consolidation map).
- Fixed documentation claims the audit found contradicted by source: removed the
  nonexistent `qw build`/`qw doctor` step from `GETTING_STARTED.md`; removed the
  false "Done: `docs/reference/release-targets.md`" claim from the documentation
  standard §18; corrected `AGENTS.md`/`CONTRIBUTING.md` references to reader-task
  directories that do not exist; and corrected `wesley/README.md`'s "hermetic"
  unit-test claim (the tests require `@wesley/core`).
- Reframed the design log as a frozen archive in practice: rewrote
  `docs/design/README.md` from a live-cycle workspace into an archive index,
  relabelled all 41 design files' frontmatter `status: proposed` → `archived`,
  and replaced the design-cycle mandate in `METHOD.md` and `docs/method/process.md`
  with the ADR-lite/`CHANGELOG.md` rule (closing the METHOD follow-up flagged
  earlier in this changelog).
- Updated `docs/index.md` to describe packets as a frozen historical decision
  log rather than append-only records.
- Removed `GoodIdeas.md` (old-repo salvage list whose Continuum-relevant ideas
  are already realized in current docs); captured the remaining still-live
  runtime ideas as `cool ideas` GitHub issues (#39–42) for the owning runtimes
  before deletion. Recorded the consolidation target as the policy's named
  reader-task directories (no `docs/topics/` tree).

- Adopted the reader-task Documentation Product Standard as a Continuum-specific
  hub policy (`docs/DOCUMENTATION_POLICY.md`), defining the capability taxonomy,
  hub-native page types, and the generate-don't-curate rule for cross-repo
  tables.
- Reframed the documentation system around reader-task pages instead of the
  design-packet log: packets are a frozen historical decision log, new decisions
  use ADR-lite records or a CHANGELOG line, and a per-capability coverage matrix
  governs what gets written. Flags METHOD.md's design-cycle mandate for a
  follow-up edit.
- Added `docs/index.md` (reader-goal router), `docs/catalog.yaml`
  (machine-readable catalog with cross-repo routing fields), and the first
  contract-families conformance guide under `docs/how-to/`.
- Added `scripts/docs-lint.mjs`, a dependency-free documentation gate checking
  internal links, catalog integrity, and registry/schema coverage; wired it
  into the `pre-commit` hook and a new docs/test CI workflow.
- Corrected the `docs/OVERVIEW.md` synthesis scope (was claimed `0001`-`0017`)
  and routed later coordination material through the documentation index.
- Added the Continuum Stack Project Slice Plan packet, translating Project #15
  into a goalpost-by-goalpost, repo-grouped, multi-lane slice ledger while
  preserving GitHub Project #15 and GitHub issues as the operational roadmap
  authority.
- Updated the Continuum Stack Project Slice Plan packet after Project #15 was
  repaired in place with distinct `Target: 1.0` and `Target: Launchpad` lanes.
- Added project-update guidance to the Continuum Stack Project Slice Plan
  packet, including update triggers and suggested goalpost status posts.
- Added milestone, goalpost, and slice Mermaid Gantt zoom layers to the
  Continuum Stack Project Slice Plan packet.
- Added the Continuum Stack Release Roadmap packet, recording the GP0-GP6
  release path, gate ownership, evidence requirements, and the GP1 Echo
  durability handoff while keeping live status in GitHub Project #15.
- Recorded `git-stunts/git-warp` as the git-warp implementation owner for the
  Continuum stack suffix-exchange gate.
- Added the Continuum Stack Convergence coordination packet, defining the
  cross-repository release bar, Project model, gate contracts, compatibility
  manifest, and repository ownership split for the Echo 1.0 / Continuum stack.
- Added agent-neutral Edict participation invariants for Continuum design,
  including lifecycle, bundle-subject, invocation, and authority rules.
- Fixed the runtime-boundary `readingEnvelopes` footprint to include native and
  translated evidence branches.
- Added Wesley union extraction and generated TypeScript/Zod support so
  `ContinuumEvidenceStatus` survives runtime-boundary artifact generation.
- Added `qw warpspace lock`, `verify`, `sync`, and `doctor` for the first
  pinned-Git constellation workflow, plus a `jedit`/Echo preview manifest.
- Added `qw warpspace locate` as the first TACHYON resolver surface for turning
  runtime paths into typed `warp://` locators with runtime projection metadata
  excluded from hash scope.
- Made devcontainer runtime projection require explicit
  `[runtime.default].mount` and `[runtime.default.image]` declarations instead
  of silently defaulting runtime topology, and rejected comma-bearing mount
  paths and nonscalar runtime environment values before composing generated
  devcontainer settings.
- Preserved `warpspace.lock.json` timestamps for no-change lock refreshes so
  repeated `qw install` runs do not dirty the lock on `lockedAt` alone.
- Reset Continuum into a fresh METHOD-shaped coordination spine.
- Fixed `drift-watch` single-file `--mirror-root` handling for mirror
  surface paths.
- Fixed Continuum Wesley target compilation against the current sibling Wesley
  CLI target-capability surface.
- Updated `warp init` generation handoff to use explicit Wesley output paths
  and module-owned `compile` targets instead of removed WARPspace CLI defaults.
- Moved the TTD protocol compiler implementation into the Continuum-owned
  Wesley module surface.
- Fixed PR feedback on contract sync pruning, bundle path validation, malformed
  JSON errors, generated Echo type references, and Bats JSON diagnostics.
- Tightened runtime-boundary and settlement-family contract fixtures, docs
  governance policy, and generated-artifact review evidence.
- Fixed warpspace lock resolution to validate 40-hex revisions against the
  target repository before writing locks, surfaced command-execution errors from
  `spawnSync` in `defaultRunCommand` diagnostics, and scoped `warpspace` CLI flag
  parsing to subcommand-specific flags to reject unsupported options.

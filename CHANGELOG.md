# Changelog

## Unreleased

- Added a `crate` Wesley install source to `qw init` (`apps/warp/src/init.mjs`):
  it resolves the crates.io-installed `wesley` binary from `PATH`
  (`cargo install wesley-cli`) and invokes it natively (`wesley emit …`), with a
  clear "run cargo install wesley-cli" error when it is absent. No
  `.warpspace` staging — just a resolution receipt. Covered by two new
  `warp-init` tests (resolve-and-invoke; not-installed error).
- Flipped the demo stack release manifest to that source: Wesley is now
  `wesley-cli` `0.1.0` from crates.io (native-rust runner), replacing the dead
  `@wesley/host-node` Node entrypoint. Trimmed the demo's projections to
  `typescript` (the `zod`/`echo-ir`/`warp-ttd` targets lived in the deleted
  `continuum/wesley` module and are deferred to #47). Updated the demo README,
  `apps/warp/README.md`, `GETTING_STARTED.md`, and `apps/warp/VISION.md` to
  describe `cargo install wesley-cli` instead of sibling-Node staging.
- Deleted the obsolete `continuum/wesley/` JS module (64 files). It was a
  Node-hosted Wesley extension built on the now-deleted `@wesley/core` /
  `wesley-host-node` packages; the real Wesley is a Rust crate
  (`cargo install wesley-cli`, installed at 0.1.0). Nothing in the repo imported
  it. Its capabilities (TTD compiler, zod/registry codegen, `echo`/`warp-ttd`
  targets, receipt/settlement witness) are Continuum-owned and to be
  re-platformed onto the Rust Wesley target registry — tracked on issue #47.
- Downgraded the receipt and settlement families in the contract-family registry
  from `fixture-witnessed` to `authored`: the witness suite that backed that
  status lived in `continuum/wesley/test` and was removed, so the stronger claim
  is no longer evidenced. Open cut updated to "re-establish on the Rust
  `wesley-cli` target."
- Hardened the docs gate (`scripts/docs-lint.mjs`): `catalog.yaml` `status` is now
  validated against a controlled set (`current`, `proposed`, `archived`, `draft`,
  `deprecated`), and `type: family-reference` entries must carry the policy §9
  cross-repo fields (`authored_home`, `runtime_owner`, `consumers`,
  `compatibility_status`). Closes #46.
- Fixed a stale cross-reference in the conformance how-to that pointed at an
  external "base standard §11.2"; it now links the self-contained documentation
  standard §11.

- Adopted a testing principle: tests assert software behavior — return values,
  state, and the artifacts the software produces (assert the structured
  contract) — never incidental stdout/help-text strings or prose matched as a
  string. Documentation checks stay in the `scripts/docs-lint.mjs` gate, not the
  behavior test suite. Recorded in `CONTRIBUTING.md` and `AGENTS.md`.
- Applied it to the clearest violations: the three `*help works` bats cases
  (`contract`, `drift-watch`, `witness-continuum`) asserted exact help/usage
  text and flag-name strings; reduced them to asserting `--help` exits zero
  (renamed `*help succeeds`). The behavioral tests that assert generated
  bundles/reports are unchanged — producing those artifacts is the behavior.
- Swept the rest of the test suite. In `apps/warp/test/warp-warpspace.test.mjs`
  the help/usage test asserted help-text content and echoed `Usage:` strings;
  dropped those and kept the behavioral checks (exit codes, which validation
  fired). Left intact, as legitimate behavior: generated-code and schema-symbol
  assertions (`wesley/test/continuum-compile-targets`, `observer-plan`,
  `runtime-boundary-invariants`) and the generated `toml`/lock assertions —
  producing those artifacts is what the software does.
- Second cleanup pass on the gray cases: `warp-init` now asserts the generated
  `README.md` / `.warpspace/README.md` are absent before init and present after
  (file existence as behavior) instead of matching prose; removed the
  stack-trace-absence `doesNotMatch` guards (kept exit codes, the structured
  `--json` `error.code`, and the behavioral `-q`/no-success checks); and dropped
  the redundant `assert_output "Continuum … failed"` lines in the wesley bats,
  which already `assert_failure` and `jq` the failed report.

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
- Lifted durable truth out of the frozen design log into reader-task reference
  pages: `docs/reference/ownership-map.md` (from packet 0014, refreshed with the
  settlement and runtime-boundary families) and `docs/reference/convergence.md`
  (from packets 0035/0036, with live release state linked to GitHub rather than
  copied). Repointed `docs/index.md` and `docs/catalog.yaml` at the reference
  pages and marked the source packets archived.
- Split `README_FULL.md`: moved the not-yet-authored capability tiers (T0–T6)
  and `continuum.*.v1` profiles into `docs/explanation/protocol-profiles.md`
  (status: proposed, with a no-source caveat) so the front-door narrative stops
  presenting an unbuilt protocol surface as current, and corrected its
  `warp doctor` reference to the `qw` CLI.
- Added `docs/reference/glossary.md` as the canonical shared-noun glossary
  (source-backed against the authored families) and pointed `APP_GLOSSARY.md` at
  it; added `docs/reference/qw-cli.md` as the exact `qw` command reference
  (from `apps/warp/src/cli.mjs`). De-scaffolded `docs/OVERVIEW.md`, removing the
  "synthesis of packets 0001–0018" framing and relabelling its packet links as
  design history. Registered the new pages in `docs/catalog.yaml` and linked
  them from `docs/index.md`.

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

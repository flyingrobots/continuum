# Changelog

## Unreleased

- Fixed the runtime-boundary `readingEnvelopes` footprint to include native and
  translated evidence branches.
- Added Wesley union extraction and generated TypeScript/Zod support so
  `ContinuumEvidenceStatus` survives runtime-boundary artifact generation.
- Added `warp warpspace lock`, `verify`, `sync`, and `doctor` for the first
  pinned-Git constellation workflow, plus a `jedit`/Echo preview manifest.
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

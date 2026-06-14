---
title: TACHYON Warpspace Resolution
status: proposed
---

# TACHYON Warpspace Resolution

**Cycle:** 0032-tachyon-warpspace-resolution

**Legend:** SOURCE

**Type:** protocol doctrine packet

**Sponsored human:** A Continuum maintainer or app author wants source paths,
container mounts, and causal history references to stay portable across host
machines, devcontainers, and imported histories without treating an absolute
path as truth.

**Sponsored agent:** An implementation or review agent needs one resolver
boundary so it can detect when runtime paths are about to enter canonical
history, reject them, and preserve observer-basis facts instead.

Refines:

- [0024 - Warp CLI And WARPspace TOML](../0024-warp-cli-and-warpspace-toml/README.md)
- [0030 - Continuum Spine Protocol Report](../0030-continuum-spine-protocol-report/README.md)
- [0031 - Continuum Compendium V1](../0031-continuum-compendium-v1/README.md)

## Hill

Name and bound the Warpspace resolver subsystem that keeps runtime filesystem
paths out of causal truth.

The subsystem is **TACHYON**:

```text
Typed Addressing for Causal History, Yielding Observer-basis Normalization
```

TACHYON is not a general path cleanup helper. It is the Warpspace-owned
resolution boundary that turns runtime path projections into typed,
observer-basis-aware Warpspace coordinates.

## Decision Summary

A Warpspace owns canonical coordinate naming for a source world. A devcontainer
or host shell owns only one runtime projection of that source world. Echo owns
admitted causal history and must not hash raw host/container absolute paths.
Jedit owns editor intent and calls the resolver at filesystem ingress points.
WARP DRIVE may expose Warpspace coordinates through a POSIX-shaped membrane, but
it does not own source-world identity.

In compact form:

```text
Warpspace names the world.
The observer basis says which world-view is being named.
The devcontainer mounts the world.
Jedit edits inside it.
Echo records what happened.
WARP DRIVE can make it look like files.
TACHYON detects canonical coordinates hidden behind runtime projections.
```

## Core Law

Runtime paths are not ontology.

The following paths may identify the same source-world coordinate from different
runtime projections:

```text
/Users/james/git/jim/jedit/src/main.ts
/warpspaces/jim/jedit/src/main.ts
```

Neither path is canonical causal truth. Both are local handles for a process
that needs to open files, display diagnostics, or run tools.

The durable Warpspace coordinate is shaped like:

```text
warp://jim/repo/jedit/src/main.ts
```

The basis-qualified coordinate is shaped like:

```text
warp@<basis-ref>://jim/repo/jedit/src/main.ts
```

The `<basis-ref>` is not a Git SHA. It names the observer-dependent Warpspace
basis: the causal/optic source-world basis from which the coordinate is being
observed. Git revisions may be evidence inside that basis, but a Git revision
is not the basis itself.

## Ownership

### Warpspace

Warpspace owns:

- declared source-world membership;
- canonical locator grammar;
- basis-aware path resolution;
- validation that a locator belongs to declared roots;
- the rule that raw runtime paths are excluded from canonical history hash
  scope.

### TACHYON

TACHYON is the Warpspace resolver subsystem.

It accepts:

- user or process path input;
- current working directory;
- runtime Warpspace root binding;
- active Warpspace manifest and lock;
- observer/session/basis context;
- selected closure and admission policy.

It returns:

- a typed `warp://` locator;
- an optional rendered `warp@<basis-ref>://` locator;
- the repo name and repo-relative path;
- the local runtime projection needed for file IO;
- basis/content/worldline evidence when available;
- explicit hash-scope posture for runtime projection metadata.

### Devcontainer

A devcontainer owns one mount projection such as:

```text
/Users/james/git/jim -> /warpspaces/jim
```

It may set runtime hints such as:

```text
JIM_WARPSPACE_ROOT=/warpspaces/jim
JEDIT_WESLEY_ROOT=/warpspaces/jim/wesley
ECHO_WARP_WASM_DIR=/warpspaces/jim/echo/crates/warp-wasm
```

Those values are local projection facts. They are not canonical history facts.

### Jedit

Jedit owns editor intent and filesystem/UI ingress.

When a user types:

```text
:e ../echo/crates/warp-wasm/src/lib.rs
```

Jedit supplies the resolver with editor context:

- current working directory;
- current buffer/session;
- current Warpspace binding;
- active observer basis;
- command intent.

Jedit may open the returned runtime path. Jedit must preserve only the typed
locator and basis relationship in durable causal evidence.

### Echo

Echo owns admitted causal history.

Echo may receive:

- typed Warpspace locators;
- `ContentRef`;
- `RecordRef`;
- `WorldlineId`;
- `BasisRef`;
- receipts and witness posture.

Echo must not normalize host/container paths. Echo must not admit raw absolute
paths into canonical hash scope.

### WARP DRIVE

WARP DRIVE may expose Warpspace coordinates through a POSIX-shaped membrane. It
consumes Warpspace resolution; it does not own the source constellation,
canonical locator grammar, or observer-basis identity.

## Locator Forms

`warp://` names a coordinate in a bound or named Warpspace:

```text
warp://jim/repo/jedit/src/main.ts
```

`warp@<basis-ref>://` names that coordinate as interpreted through a specific
observer basis:

```text
warp@basis:example://jim/repo/jedit/src/main.ts
```

The string form is for humans, CLIs, diagnostics, and links. Canonical hashed
records should prefer a typed structure such as:

```json
{
  "kind": "warp.locator.v1",
  "warpspace": "jim",
  "basis": "basis:example",
  "segments": ["repo", "jedit", "src", "main.ts"]
}
```

The typed form prevents URI parsing quirks, escaping ambiguity, Unicode
normalization drift, and slash handling from becoming canonical-hash bugs.

## Resolution Shape

Example input:

```json
{
  "cwd": "/warpspaces/jim/jedit",
  "runtimeRoot": "/warpspaces/jim",
  "warpspace": "jim",
  "input": "../echo/crates/warp-wasm/src/lib.rs",
  "observerBasis": "basis:example",
  "policy": {
    "allowExternal": false,
    "includeRuntimePathInHash": false
  }
}
```

Example output:

```json
{
  "kind": "warp.resolution.v1",
  "locator": {
    "kind": "warp.locator.v1",
    "warpspace": "jim",
    "segments": ["repo", "echo", "crates", "warp-wasm", "src", "lib.rs"]
  },
  "basisLocator": {
    "kind": "warp.locator.v1",
    "warpspace": "jim",
    "basis": "basis:example",
    "segments": ["repo", "echo", "crates", "warp-wasm", "src", "lib.rs"]
  },
  "display": {
    "locator": "warp://jim/repo/echo/crates/warp-wasm/src/lib.rs",
    "basisLocator": "warp@basis:example://jim/repo/echo/crates/warp-wasm/src/lib.rs"
  },
  "repo": "echo",
  "repoRelativePath": "crates/warp-wasm/src/lib.rs",
  "runtimeProjection": {
    "path": "/warpspaces/jim/echo/crates/warp-wasm/src/lib.rs",
    "hashScope": "excluded"
  },
  "basisRef": "basis:example"
}
```

## Guardrails

Canonical hash scope may contain:

- typed `warp.locator.v1` objects;
- rendered `warp://` or `warp@<basis-ref>://` locators when the string grammar
  is explicitly the canonical field;
- `ContentRef`;
- `RecordRef`;
- `WorldlineId`;
- `BasisRef`;
- repo-relative paths inside typed Warpspace locator structures.

Canonical hash scope must reject or quarantine:

- `/Users/...`;
- `/warpspaces/...`;
- `/workspaces/...`;
- `/home/...`;
- `~/...`;
- `file://...`;
- raw `$PWD`-derived strings;
- raw absolute paths from diagnostics, stack traces, editor buffers, or build
  tools.

Runtime paths may appear only in local bindings, process execution plans,
display annotations, debug evidence, and adapter-private metadata explicitly
marked outside canonical hash scope.

## Observer Dependence

Path resolution is observer-dependent. It is therefore not merely path
normalization.

The same named coordinate can be observed from different bases:

- a clean locked Warpspace;
- a dirty overlay;
- an imported history;
- a proposed strand;
- a partial closure;
- a session with different local adoption policy;
- a runtime with different authority horizon.

`warp://jim/repo/jedit/src/main.ts` is the named coordinate. The basis tells
which reading of that coordinate is in view. `warp@<basis-ref>://...` renders
that relationship when a human-facing locator needs to carry the basis.

## Test That Proves The Design

Run the same Jedit operation twice:

```text
Host projection:
  /Users/james/git/jim/jedit/src/main.ts

Container projection:
  /warpspaces/jim/jedit/src/main.ts
```

Both should resolve to:

```text
warp://jim/repo/jedit/src/main.ts
```

When joined to the same observer basis, both should produce the same
basis-qualified locator and the same canonical hash payload. The debug/local
projection metadata may differ.

If canonical hashes differ only because one run saw `/Users/james/...` and the
other saw `/warpspaces/...`, runtime projection leaked into truth.

## Follow-On Artifact

The next implementation artifact should be a `warp` resolver surface:

```text
warp warpspace locate --root /warpspaces/jim --cwd /warpspaces/jim/jedit ../echo/src/lib.rs
```

That command should print typed JSON by default under `--json`, and should use
the same resolver module that Jedit, WARP DRIVE, and Echo adapters call.

The implementation card is
[TACHYON Warpspace Resolver](../../method/backlog/up-next/SOURCE_tachyon-warpspace-resolver.md).

## Playback Questions

- Can a reviewer explain why `/warpspaces/jim/...` is not canonical just because
  the devcontainer is the official runtime projection?
- Can Jedit know where to call the resolver before writing durable history?
- Can Echo reject raw runtime paths without needing to understand host
  filesystems?
- Can WARP DRIVE consume Warpspace coordinates without owning Warpspace
  identity?
- Can the same source coordinate survive host, devcontainer, CI, and
  import/export without rewriting canonical payloads?

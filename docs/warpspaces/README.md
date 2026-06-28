# WARPspace Constellation Manifests

This directory holds small pinned-repo constellation manifests for
`qw warpspace`.

These manifests are not package-manager replacements. They name exact Git
coordinates for multi-repo integration work before every participating crate or
tool has a stable registry release.

Warpspace manifests and locks are also the intended home for source-world
coordinate identity. Runtime paths from a host shell, devcontainer, CI runner,
or WARP DRIVE mount are local projections only. Canonical history should use
typed Warpspace locators such as `warp://jim/repo/jedit/src/main.ts`, or a
basis-qualified form such as `warp@<basis-ref>://...`, never raw absolute paths
such as `/Users/...` or `/warpspaces/...`.

The resolver subsystem for this boundary is named **TACHYON**: Typed Addressing
for Causal History, Yielding Observer-basis Normalization. See
[0032 - TACHYON Warpspace Resolution](../design/0032-tachyon-warpspace-resolution/README.md).
The first CLI surface is `qw warpspace locate`, which accepts a runtime path,
current working directory, root projection, lock file, and optional basis ref,
then emits a typed locator plus runtime projection metadata marked outside hash
scope.

Runtime projections are generated local machine state. `qw runtime materialize`
writes the declared projection from `warpspace.lock.json`; `qw runtime verify`
and `qw runtime doctor` check whether files such as
`.devcontainer/devcontainer.json` still match the declared WARPspace runtime.
Those files tell a container or editor how to run the source constellation, but
they do not become canonical path identity.

Current manifests:

- [`jedit-echo-dev.toml`](./jedit-echo-dev.toml) pins the first Wesley/Echo/`jedit`/`warp-ttd`
  development constellation.

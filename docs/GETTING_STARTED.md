# Getting Started

This is the first landing path if you are new to the Continuum stack.

If you only remember one thing, remember this:

- **Continuum** defines shared contract and compatibility truth.
- **`qw`** is the user-facing WARPspace CLI.
- **Wesley** compiles shared families into usable host artifacts behind `qw`.
- **Echo** and **`git-warp`** are the runtimes.
- **`warp-ttd`** is the shared observer/debugger surface.
- **WARPspace** is your app's local workspace.

The goal is that an app team starts by creating a WARPspace, not by cloning
five repos and guessing how they fit together.

## The Intended Entry Point

The intended user entry point is a single bootstrap tool:

```bash
qw init my-app --profile demo
```

That command should:

1. Fetch or resolve a Continuum-authored stack release manifest.
2. Choose one tested set of compatible versions of:
   - Continuum
   - Wesley
   - Echo
   - `git-warp`
   - `warp-ttd`
3. Write a checked-in `warpspace.toml`.
4. Write a checked-in `warpspace.lock.json`.
5. Create the managed internal install layout under `.warpspace/`.
6. Materialize the first shared Continuum family into `contracts/continuum/`.
7. Invoke Wesley internally to generate the first TypeScript, Zod, Echo, and
   `warp-ttd` host outputs.

If you want the design behind that flow, read:

- [WARPspace Bootstrap And Stack Release Manifest](design/0023-warpspace-bootstrap-and-stack-release-manifest/README.md)
- [Warp CLI And WARPspace TOML](design/0024-warp-cli-and-warpspace-toml/README.md)
- [demo stack release manifest](releases/demo/continuum-stack-release.json)

## What A New User Should Read

Use this order:

1. [README.md](../README.md)
   Short repo purpose and stack split.
2. [docs/GETTING_STARTED.md](GETTING_STARTED.md)
   The user entry point and startup flow.
3. [apps/warp/VISION.md](../apps/warp/VISION.md)
   The product boundary for `qw`, what it already proves, and what is not
   finished yet.
4. [apps/warp/README.md](../apps/warp/README.md)
   The current Continuum-owned prototype for the user-facing CLI.
5. [docs/VISION.md](VISION.md)
   The durable ownership split across the stack.

Only go deeper after that:

- [docs/OVERVIEW.md](OVERVIEW.md) for the current conceptual synthesis
- [docs/invariants/CONTINUUM.md](invariants/CONTINUUM.md) for canonical stack
  law
- [docs/design](design/README.md) for packet-level design work

## What A New User Should Do

If the `qw` bootstrap flow exists, the getting-started path should be:

1. Install `qw`.
2. Run `qw init my-app --profile demo`.
3. Enter the new repo.
4. Run `qw build` or `qw doctor`.
5. Start writing app-local contracts and app code on top of the generated
   shared family.

The host repo they receive should already contain:

- `warpspace.toml`
- `warpspace.lock.json`
- `contracts/continuum/`
- `.warpspace/`
- generated outputs under host package/crate roots

That is the first honest "build a Continuum app" story.

## What Exists Today

Today, the intended `qw init` product flow is defined, but not yet fully
packaged as a one-command user experience.

The first constellation-style `qw install` cut exists. It reads
`warpspace.toml`, refreshes `warpspace.lock.json`, syncs declared sibling repo
checkouts, writes a devcontainer runtime projection when `[runtime.default]`
declares one, and verifies the result. Full managed toolchain installation
under `.warpspace/` is still incomplete for that install path.

The first concrete stack artifact for that flow now exists here:

- [demo stack release manifest](releases/demo/continuum-stack-release.json)

A local-first prototype now exists in Continuum:

```bash
node apps/warp/bin/warp.mjs init my-app --profile demo
```

For the current local-sibling demo profile, that command:

- stages the current-process Node runtime under `.warpspace/packages/node/`
- stages a sibling Wesley entrypoint under `.warpspace/packages/wesley/`
- then invokes Wesley through those staged toolchain paths

The closest real starting point today is:

1. Read [apps/warp/README.md](../apps/warp/README.md).
2. Run the prototype against a scratch host repo.
3. Inspect the resulting `warpspace.toml`, `warpspace.lock.json`,
   `contracts/continuum/`, and scaffolded package/crate roots.

Today the prototype still assumes active stack-development posture rather than
a released installer posture. In practice that means local development inputs
such as:

- `~/git/continuum`
- `~/git/wesley`

That is acceptable for current stack work.
It is not the final consumer entry point.

## Practical Mental Model

If you are evaluating the stack, think in this order:

1. Continuum tells me what shared things mean.
2. Wesley turns those shared things into generated artifacts.
3. Echo or `git-warp` is the runtime I actually run on.
4. `warp-ttd` observes the same shared story.
5. My app lives in a WARPspace that consumes all of that.

If you start thinking "which repo do I clone first," you are already below the
right user abstraction.

The right question is:

**How do I create or enter a WARPspace?**

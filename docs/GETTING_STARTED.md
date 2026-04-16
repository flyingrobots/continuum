# Getting Started

This is the first landing path if you are new to the Continuum stack.

If you only remember one thing, remember this:

- **Continuum** defines shared contract and compatibility truth.
- **Wesley** compiles shared families into usable host artifacts.
- **Echo** and **`git-warp`** are the runtimes.
- **`warp-ttd`** is the shared observer/debugger surface.
- **WARPspace** is your app's local workspace.

The goal is that an app team starts by creating a WARPspace, not by cloning
five repos and guessing how they fit together.

## The Intended Entry Point

The intended user entry point is a single bootstrap tool:

```bash
warpspace init my-app --profile demo
```

That command should:

1. Fetch a Continuum-authored stack release manifest.
2. Choose one tested set of compatible versions of:
   - Continuum
   - Wesley
   - Echo
   - `git-warp`
   - `warp-ttd`
3. Write a checked-in `warpspace.mjs`.
4. Write a checked-in `warpspace.lock.json`.
5. Materialize the first shared Continuum family into `contracts/continuum/`.
6. Generate the first TypeScript, Zod, Echo, and `warp-ttd` host outputs.

If you want the design behind that flow, read:

- [WARPspace Bootstrap And Stack Release Manifest](design/0023-warpspace-bootstrap-and-stack-release-manifest/README.md)

## What A New User Should Read

Use this order:

1. [README.md](../README.md)
   Short repo purpose and stack split.
2. [docs/GETTING_STARTED.md](GETTING_STARTED.md)
   The user entry point and startup flow.
3. The sibling repo `../continuum-demo`
   Its `README.md` is the current consumer proof repo entry point.
4. [docs/VISION.md](VISION.md)
   The durable ownership split across the stack.

Only go deeper after that:

- [docs/OVERVIEW.md](OVERVIEW.md) for the current conceptual synthesis
- [docs/invariants/CONTINUUM.md](invariants/CONTINUUM.md) for canonical stack
  law
- [docs/design](design/README.md) for packet-level design work

## What A New User Should Do

If the `warpspace` bootstrap flow exists, the getting-started path should be:

1. Install `warpspace`.
2. Run `warpspace init my-app --profile demo`.
3. Enter the new repo.
4. Run `warpspace generate` or `warpspace doctor`.
5. Start writing app-local contracts and app code on top of the generated
   shared family.

The host repo they receive should already contain:

- `warpspace.mjs`
- `warpspace.lock.json`
- `contracts/continuum/`
- generated outputs under host package/crate roots

That is the first honest "build a Continuum app" story.

## What Exists Today

Today, the intended `warpspace init` product flow is defined, but not yet fully
packaged as a one-command user experience.

The closest real starting point today is:

1. Open the sibling repo `../continuum-demo`.
2. Treat it as the first host-project proof for the current stack.
3. Use the committed `warpspace.mjs` there as the current example of a host
   WARPspace.
4. Materialize the first shared family by running the demo generation flow.

The current demo commands are:

```bash
pnpm run sync:continuum:neighborhood-core
pnpm run gen:typescript
pnpm run gen:zod
pnpm run gen:echo
pnpm run gen:ttd
```

Or all at once:

```bash
pnpm run gen:all
```

Today that demo still assumes active stack-development posture rather than a
released installer posture. In practice that means local sibling repos such as:

- `~/git/continuum`
- `~/git/wesley`
- `~/git/continuum-demo`

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

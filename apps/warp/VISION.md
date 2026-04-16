# Warp Vision

`warp` is the product that turns the Continuum stack into one developer-facing
thing.

The goal is simple:

- a developer installs `warp`
- a developer runs `warp init`
- a WARPspace appears
- the rest of the stack stays behind that boundary

If a developer has to ask whether they should start with Wesley, Echo,
`git-warp`, `warp-ttd`, or Continuum, the product boundary is still too blurry.

## The Product

`warp` is the user-facing CLI for creating, entering, and operating a
WARPspace.

A WARPspace is the local app workspace that:

- carries the app's authored workspace config in `warpspace.toml`
- carries the resolved stack lock in `warpspace.lock.json`
- materializes selected shared Continuum families into `contracts/continuum/`
- keeps managed internal toolchain state under `.warpspace/`
- exposes generated host-visible outputs inside the app repo

The intended user story is:

```bash
warp init my-app --profile demo
cd my-app
warp build
warp doctor
```

The user should not need to install or invoke Wesley, Echo, `git-warp`, or
`warp-ttd` directly.

## The Split

`warp` only makes sense if the stack split stays sharp.

- **Continuum** owns stack manifests, templates, compatibility truth, and the
  overall question "how does someone start a Continuum app?"
- **`warp`** owns bootstrap, workspace orchestration, lockfiles, managed
  installs, and the day-to-day app-facing command surface
- **Wesley** owns compilation and generation
- **Echo**, **`git-warp`**, and **`warp-ttd`** remain internal stack components
  from the app author's point of view

That means `warp` does not absorb compiler logic, and Wesley does not pretend
to be the installer above itself.

## The Promise

The durable product promise is:

1. One user-facing binary: `warp`
2. One checked-in workspace contract: `warpspace.toml`
3. One checked-in resolved lock: `warpspace.lock.json`
4. One ignored managed install root: `.warpspace/`
5. One Continuum-authored stack manifest that chooses a compatible tuple

From that promise, several things follow:

- the user should not manage the internal toolchain by hand
- the app repo should carry authored truth and visible generated outputs, not
  ad hoc machine-specific setup
- `warp` should install or stage the internal toolchain, then invoke Wesley
  internally
- compatibility decisions should come from Continuum manifests, not ambient
  workstation folklore

## What Exists Today

The current Continuum repo already proves the product boundary in a real way.

Today, `apps/warp` provides a working local-first prototype with:

- a repo-local `warp init` command
- a concrete demo stack manifest at
  [docs/releases/demo/continuum-stack-release.json](/Users/james/git/continuum/docs/releases/demo/continuum-stack-release.json)
- a WARPspace template under
  [apps/warp/templates/demo-web-rust](/Users/james/git/continuum/apps/warp/templates/demo-web-rust)
- authored workspace output in `warpspace.toml`
- resolved install state in `warpspace.lock.json`
- internal install layout under `.warpspace/packages`, `.warpspace/cache`, and
  `.warpspace/downloads`
- materialization of the first shared family into `contracts/continuum/`
- direct Wesley handoff through the real `warpspace.toml`
- manifest-declared package source sites, including the proof-oriented
  `local-packages` source used in tests

That means the prototype already proves:

- Continuum can own the entry point
- the authored workspace boundary can be TOML rather than executable JS
- Wesley can stay downstream as an internal compiler
- a new host repo can be scaffolded and populated from a stack manifest

## What Does Not Exist Yet

The prototype is real, but it is not the final product form.

What is not done yet:

- `warp` is not yet shipped as the final standalone native binary
- released profiles do not yet install real downloadable Node and Wesley
  artifacts
- the demo profile still uses local development posture for managed toolchain
  staging
- the broader day-to-day command set such as `warp build`, `warp doctor`, and
  `warp update` is not yet implemented
- the install story still relies on proof package sources rather than a real
  downloadable release source

So the current state is:

- the product boundary is now correct
- the release/distribution posture is not finished

That is an important distinction. The prototype should be judged as a truthful
product proof, not mistaken for the final packaging layer.

## The User Model

The mental model we want developers to have is:

1. `warp` is the thing I install and run
2. a WARPspace is the app workspace I work inside
3. Continuum chooses compatible stack truth
4. `warp` acquires and manages the internal toolchain
5. Wesley compiles the shared families under `warp`

The wrong mental model is:

1. clone a bunch of repos
2. figure out which one is the real entry point
3. install several tools separately
4. wire output paths by hand

If the second model is still required, `warp` has not finished its job.

## What Matters Next

The next honest work is not another rename or another abstraction pass.

The next work is making the managed install story match the product promise:

- move the demo profile off sibling/local-process toolchain assumptions
- install Node and Wesley from manifest-resolved package sources
- keep writing the same `warpspace.toml` and `warpspace.lock.json`
- keep Wesley internal to the user experience
- then replace proof-oriented package sources with a real downloadable source

After that, shipping the native `warp` binary becomes a distribution problem,
not a product-definition problem.

## Reading Order

If you want the shortest path through the `warp` story, use this order:

1. [apps/warp/README.md](/Users/james/git/continuum/apps/warp/README.md)
2. [docs/GETTING_STARTED.md](/Users/james/git/continuum/docs/GETTING_STARTED.md)
3. [0024 - Warp CLI And WARPspace TOML](/Users/james/git/continuum/docs/design/0024-warp-cli-and-warpspace-toml/README.md)
4. [0025 - Warp Native Distribution And Node Runtime Policy](/Users/james/git/continuum/docs/design/0025-warp-native-distribution-and-node-runtime-policy/README.md)
5. [0026 - Warp Package Sources And Local Packages Site](/Users/james/git/continuum/docs/design/0026-warp-package-sources-and-local-packages-site/README.md)

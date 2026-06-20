---
title: Continuum Stack Convergence
status: proposed
---

# Continuum Stack Convergence

**Cycle:** 0035-continuum-stack-convergence
**Legend:** SOURCE
**Type:** cross-repository coordination packet
**Sponsored human:** A stack maintainer wants one release bar for Continuum
participation across Echo, `git-warp`, Edict, `jedit`, Graft, WARP TTD, WARP
DRIVE, and Wesley without turning Continuum into a runtime or shadow owner.
**Sponsored agent:** A planning or review agent needs an inspectable hierarchy
for issues, projects, proofs, compatibility sets, and repository ownership so
it can coordinate work without copying stale roadmaps into individual repos.

Refines:

- [0030 - Continuum Spine Protocol Report](../0030-continuum-spine-protocol-report/README.md)
- [0031 - Continuum Compendium V1](../0031-continuum-compendium-v1/README.md)
- [0034 - Agent-Neutral Edict Participation](../0034-agent-neutral-edict-participation/README.md)

## Hill

Make Continuum the coordination owner for cross-repository stack convergence
while preserving local implementation ownership.

The top-level release claim is not "Echo is green." The top-level release claim
is:

```text
Continuum participation
+ networked causal suffix exchange
+ Edict artifact admission
+ native jedit operation execution
+ pinned cross-repo compatibility evidence
```

Echo is the release vehicle for Echo 1.0. Continuum is the coordination spine
that says which repo owns each contract, which evidence ends each argument, and
which compatibility set binds the stack.

## Decision

Continuum owns the cross-repository convergence map.

Continuum does not own the runtime, substrate, compiler, app, debugger,
observer, package manager, or docs site internals. It owns shared truth about
how those repos meet at protocol boundaries.

Repository ownership remains:

| Repository | Owns |
| --- | --- |
| Continuum | Cross-repo vocabulary, profiles, release bar, compatibility set shape, conformance posture, shared proof vocabulary. |
| Echo | Runtime admission, WAL/WSC durability, receipts, readings, mutation execution, Echo 1.0 release contract. |
| `git-warp` | Causal suffix substrate behavior and peer exchange implementation from the `git-warp` side. |
| Edict | Deterministic source, compiler, bundle identity, artifact schema, lawpack, and target-profile lowering. |
| `jedit` | Product operation semantics and the designated native operation proof. |
| Graft | Structural observer posture and translated-versus-native evidence boundaries. |
| WARP TTD | Debugger/trace/profile surfaces over Continuum-compatible participants. |
| WARP DRIVE | Browser/app projection surfaces over readings and intents. |
| Wesley | Contract-family compilation and generated adapter surfaces. |

No repo may mint a shadow schema, shadow vocabulary, or shadow ownership map for
shared Continuum contracts. Shared nouns need one authored home and explicit
publication boundaries.

## Release Hierarchy

Use this hierarchy for live GitHub coordination:

```text
Continuum Stack Convergence Release Bar
+-- Gate A - Continuum Protocol Spine
+-- Gate B - Echo 1.0 Release Bar
+-- Gate C - Edict Artifact Admission Contract
+-- Gate D - git-warp Suffix Exchange Profile
+-- Gate E - jedit Native Operation Proof
`-- Gate F - Cross-Repo Release Integrity
```

The Echo 1.0 Release Bar remains in Echo because Echo owns the release vehicle.
The Continuum Stack Convergence Release Bar lives in Continuum because the
stack release is a cross-repository protocol claim.

Do not add another layer above this unless a future stack release spans multiple
independent product release bars. Three operational levels are enough:

```text
Stack Release Bar
`-- Gate
    `-- Capability epic or PR-sized work item
```

## GitHub Project Model

The live Project should be Continuum-branded:

```text
Continuum Stack Convergence
```

Initial Project:
<https://github.com/users/flyingrobots/projects/15>

The existing Echo 1.0 Project may remain as the Echo release train or be nested
under the Continuum Project as a filtered view. Continuum-level work must not be
tracked by copying Echo's release contract into every repo.

Use native GitHub metadata where it already exists:

- Status
- Type
- Repository
- Milestone
- Parent issue
- Sub-issue progress
- Assignees
- Linked pull request
- Reviewers

Use custom fields only for cross-repo triage:

| Field | Values |
| --- | --- |
| Track | Continuum, Echo, Suffix Exchange, Edict, Jedit, Graft, WARP TTD, WARP DRIVE, Wesley, Docs, Release |
| Goalpost | GP0, GP1, GP2, GP3, GP4, GP5, GP6 |
| Target | 1.0, Deferred, Research |
| Risk | Low, Medium, High, Critical |
| Proof | Missing, Unit, Integration, Conformance, Network, Release |
| Slice | S, M, Needs decomposition |

Do not create a custom Repository field. Repository is native metadata.

Do not create a Blocker enum. Use native GitHub `blocked by` and `blocking`
relationships.

Do not treat Slice `Needs decomposition` as ready work.

## Project Views

Start with six views:

| View | Purpose |
| --- | --- |
| Release Bar | Stack gates grouped by parent issue and sub-issue progress. |
| Now | Board grouped by Status for current execution. |
| By Track | Table grouped by Track. |
| Dependency & Risk | Blocked work plus High/Critical risk. |
| Proof Debt | Target `1.0` issues whose Proof is not sufficient for their gate. |
| Review Queue | Linked pull requests awaiting review or merge-gate judgment. |

GitHub CLI can create projects, fields, copy projects, and mark projects as
templates. It does not currently provide a stable command for creating and
configuring Project views. Configure views in the GitHub web UI or copy from a
prepared Project seed.

## Compatibility Set

The stack release is not several green repositories. It is one demonstrated
compatibility set.

Gate F must produce a machine-readable release manifest named
`continuum-convergence.lock` or a successor with equivalent semantics. It must
pin:

- Continuum commit and profile versions.
- Echo commit and Echo release candidate version.
- `git-warp` commit and suffix-exchange protocol version.
- Edict commit, artifact schema version, and relevant bundle digests.
- `jedit` commit and designated operation set.
- Graft, WARP TTD, WARP DRIVE, and Wesley commits when they participate in the
  proof packet.
- Workflow runs, proof-packet digests, network traces, conformance reports,
  admission receipts, invocation receipts, and artifact digests.

## Gate Contracts

Every gate issue must contain:

- Contract
- Owner
- Executable check
- Required evidence
- Negative cases
- Compatibility set
- Pass rule

### Gate A - Continuum Protocol Spine

Passes when the stack has a versioned participant/profile vocabulary,
conformance posture, receipt/obstruction vocabulary, profile discovery shape,
and fixture/report format tied to exact commits.

### Gate B - Echo 1.0 Release Bar

Passes when Echo's release bar passes according to Echo's own release contract
and is linked to the Continuum compatibility set.

### Gate C - Edict Artifact Admission Contract

Passes when Edict defines deterministic bundle identity, artifact schemas,
target-profile lowering, bundle-subject binding, invocation envelope semantics,
capability/optic enforcement, and negative rejection cases.

### Gate D - git-warp Suffix Exchange Profile

Passes when Echo and `git-warp` exchange witnessed causal suffixes in both
directions over a real network boundary and deterministically handle duplicate,
reordered, stale, tampered, disconnected, and resumed exchange cases.

### Gate E - jedit Native Operation Proof

Passes when designated `jedit` operations compile through Edict, are admitted
and invoked through Echo, and the old direct execution path is removed or
provably unreachable.

### Gate F - Cross-Repo Release Integrity

Passes when the pinned compatibility set, proof packets, clean-room build,
upgrade/rollback test, package verification, docs verification, and negative
release demo all pass from exact commits.

## Prepared Project Seed

Create a prepared Project seed named:

```text
Continuum Stack Convergence Template
```

It should contain fields and views, not live release items. If GitHub permits
marking user-owned Projects as templates, mark the seed as a template. If not,
keep it as a copyable seed Project.

Initial copyable seed:
<https://github.com/users/flyingrobots/projects/16>

The live Project should be named:

```text
Continuum Stack Convergence
```

Future releases can copy the seed and then add their release bar issue tree.

GitHub currently rejects marking user-owned Projects as native templates. A
user-owned seed Project is still useful as a copy source; an organization-owned
Project is required for the native template picker.

## Initial GitHub Release Bar

Initial live hierarchy:

- [Continuum Stack Convergence Release Bar](https://github.com/flyingrobots/continuum/issues/30)
- [Gate A - Continuum Protocol Spine](https://github.com/flyingrobots/continuum/issues/31)
- [Gate B - Echo 1.0 Release Bar](https://github.com/flyingrobots/echo/issues/584)
- [Gate C - Edict Artifact Admission Contract](https://github.com/flyingrobots/edict/issues/11)
- [Gate D - git-warp Suffix Exchange Profile](https://github.com/flyingrobots/continuum/issues/33)
- [Gate E - jedit Native Operation Proof](https://github.com/flyingrobots/jedit/issues/143)
- [Gate F - Cross-Repo Release Integrity](https://github.com/flyingrobots/continuum/issues/32)

Gate D lives in Continuum until the public git-warp implementation repository is
identified or created.

## Playback Questions

1. Does the issue hierarchy make Continuum the coordination owner without
   stealing local ownership from Echo, Edict, `git-warp`, or `jedit`?
2. Can a reviewer find the binary evidence needed to close every gate without
   reading a live roadmap document in a repo?
3. Does the Project field set avoid duplicating native GitHub metadata?
4. Does the compatibility manifest prove one stack, not several independent
   green builds?
5. Are agents, apps, humans, CLIs, browsers, and fixtures still evaluated
   through the same Continuum participation boundary?

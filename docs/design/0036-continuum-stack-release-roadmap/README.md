---
title: Continuum Stack Release Roadmap
status: proposed
---

# Continuum Stack Release Roadmap

**Cycle:** 0036-continuum-stack-release-roadmap
**Legend:** SOURCE
**Type:** release roadmap packet
**Sponsored human:** A stack maintainer wants the full path to Echo 1.0 and
Continuum stack convergence written in the repo that owns cross-repository
coordination, without making a live task tracker in source control.
**Sponsored agent:** A planning or execution agent needs to know which
goalpost to pursue next, which repository owns each claim, and what evidence
will close the release argument.

Refines:

- [0035 - Continuum Stack Convergence](../0035-continuum-stack-convergence/README.md)
- [0034 - Agent-Neutral Edict Participation](../0034-agent-neutral-edict-participation/README.md)
- [0031 - Continuum Compendium V1](../0031-continuum-compendium-v1/README.md)

## Hill

Write the stable release path for the Continuum stack in Continuum, while
keeping live status in GitHub.

Continuum is the right home for this roadmap because the release is not only an
Echo release. Echo 1.0 is the product vehicle, but the release claim spans
Continuum, Echo, `git-warp`, Edict, `jedit`, and the proof surfaces that show
they are one compatible stack.

The roadmap in this packet is not a work queue. The live control surface is:

- Project: [Continuum Stack Convergence](https://github.com/users/flyingrobots/projects/15)
- Seed Project: [Continuum Stack Convergence Template](https://github.com/users/flyingrobots/projects/16)
- Release Bar: [continuum#30](https://github.com/flyingrobots/continuum/issues/30)

This packet records the release doctrine, sequencing, owners, exit evidence,
and handoff rules. Project fields, issue status, assignees, linked pull
requests, and blockers remain in GitHub.

## Release Doctrine

Echo 1.0 may ship only when all of these are true:

- Echo has attained Continuum participation status.
- Echo and `git-warp` have exchanged witnessed causal suffixes over a real
  network boundary.
- Edict works and Echo uses it natively to execute designated `jedit`
  operations.
- The stack release is backed by a pinned compatibility set and proof packets.

The shortest truthful equation is:

```text
Echo 1.0 =
  Continuum participation
  + durable Echo causal history
  + networked suffix exchange
  + Edict artifact admission
  + native jedit operation execution
  + release integrity proof
```

No individual repository can close the release alone. Green CI in several repos
is useful evidence, not the release claim.

## Authority

The GitHub Project is the live roadmap. Issues are the work. Pull requests and
proof artifacts are the evidence.

Continuum records the cross-repository contract because it owns the shared
coordination boundary:

- shared vocabulary and profile posture
- release bar and gate structure
- ownership map for cross-repo contracts
- compatibility manifest shape
- proof-packet expectations
- evidence vocabulary for pass/fail release decisions

Continuum does not own the runtime internals, app semantics, compiler
implementation, storage engine, or docs split. Those remain in the owning
repositories.

## Issue Graph

The release hierarchy is:

```text
Continuum Stack Convergence Release Bar
+-- Gate A - Continuum Protocol Spine
+-- Gate B - Echo 1.0 Release Bar
+-- Gate C - Edict Artifact Admission Contract
+-- Gate D - git-warp Suffix Exchange Profile
+-- Gate E - jedit Native Operation Proof
`-- Gate F - Cross-Repo Release Integrity
```

Canonical gate issues:

| Gate                  | Canonical issue                                                     | Owner      |
| --------------------- | ------------------------------------------------------------------- | ---------- |
| Release Bar           | [continuum#30](https://github.com/flyingrobots/continuum/issues/30) | Continuum  |
| Gate A                | [continuum#31](https://github.com/flyingrobots/continuum/issues/31) | Continuum  |
| Gate B                | [echo#584](https://github.com/flyingrobots/echo/issues/584)         | Echo       |
| Gate C                | [edict#11](https://github.com/flyingrobots/edict/issues/11)         | Edict      |
| Gate D                | [continuum#33](https://github.com/flyingrobots/continuum/issues/33) | Continuum  |
| Gate D implementation | [git-warp#663](https://github.com/git-stunts/git-warp/issues/663)   | `git-warp` |
| Gate E                | [jedit#143](https://github.com/flyingrobots/jedit/issues/143)       | `jedit`    |
| Gate F                | [continuum#32](https://github.com/flyingrobots/continuum/issues/32) | Continuum  |

Echo-owned release gate children remain under the Echo release bar. Cross-repo
implementation issues point back to the Continuum-owned gate that defines the
shared contract.

## Project Field Semantics

Project field meaning is release-stack meaning, not local packet meaning.

This matters for Echo durability. Echo's WAL/WSC issue titles contain local
roadmap labels such as `[GP3-S1]` from the Echo durability design packet. Inside
the Continuum Stack Convergence Project, those issues are stack `GP1` because
durable causal history is the first release substrate required by later suffix
exchange and recovery proofs.

Use these rules:

- `Goalpost` identifies the cross-repository release sequence.
- `Track` identifies the coordination lane, not a duplicate repository field.
- Native GitHub repository metadata remains the repository owner.
- `Target: 1.0` means the item is in the release scope firewall.
- `Proof` records the strongest linked evidence currently attached to the
  issue.
- `Slice: Needs decomposition` is not ready implementation work.

If a future Project adds a dedicated durability track, that is a field
migration only. It does not change the release ordering: Echo durability remains
stack `GP1`.

## Goalposts

### GP0 - Control Surface And Release Bar

Purpose:

- Establish one live Project for the stack.
- Retire local live roadmap documents as sources of truth.
- Create the release bar and gate issues.
- Seed reusable Project fields and views.
- Define the Echo release contract without copying it into every repository.

Owners:

- Continuum owns the cross-repo release bar.
- Echo owns its Echo 1.0 release contract.

Primary evidence:

- Project #15 contains the stack release issues.
- Project #16 is a copyable seed for future releases.
- The retired Echo-only Project is not release authority.
- Echo's release contract points to the stack Project instead of maintaining a
  live repository roadmap.

Pass rule:

The Project, release bar, gate issues, and ownership map exist; no repository
document is required to answer current issue status.

### GP1 - Echo Durability Substrate

Purpose:

- Make Echo's accepted causal history durable enough to serve as release
  substrate.
- Establish WAL commit authority before app-visible ACK.
- Rebuild projections deterministically from committed evidence.
- Preserve retained evidence and WSC export/import posture across restart.
- Prove crash, corruption, replay, stale-claim, and missing-retention cases.

Owners:

- Echo owns the runtime durability implementation.
- Continuum owns only the fact that this substrate is required before networked
  suffix exchange can be release evidence.

Primary issue family:

- [echo#521](https://github.com/flyingrobots/echo/issues/521):
  WAL/WSC Storage Relationship
- [echo#554](https://github.com/flyingrobots/echo/issues/554):
  Runtime WAL Store Adapter Boundary
- [echo#555](https://github.com/flyingrobots/echo/issues/555):
  Filesystem Runtime WAL ACK Path
- [echo#556](https://github.com/flyingrobots/echo/issues/556):
  Filesystem Runtime WAL Failure Atomicity
- [echo#557](https://github.com/flyingrobots/echo/issues/557):
  Runtime WAL Recovery CLI Contract
- [echo#558](https://github.com/flyingrobots/echo/issues/558):
  Durable Runtime WAL Gate
- [echo#559](https://github.com/flyingrobots/echo/issues/559) through
  [echo#581](https://github.com/flyingrobots/echo/issues/581) for projection,
  WSC, retention, recovery, crashpoint, and release proof slices.

Primary evidence:

- Unit and integration tests proving ACK after durable WAL commit.
- Recovery tests proving deterministic rebuild from committed transactions.
- WSC export/import fixtures over WAL-derived causal history.
- Crashpoint tests for pre-commit, post-commit, pre-publication, and restart
  behavior.
- Negative tests for corrupt evidence, incomplete evidence, stale claims, and
  missing retained material.

Pass rule:

Defined crash-point matrix passes, recovery is deterministic, duplicate replay
is idempotent, retained evidence survives restart, corrupt or incomplete
evidence is rejected deterministically, and required recovery artifacts are
emitted by CI.

### GP2 - Continuum Participation Protocol Spine

Purpose:

- Define the participant/profile vocabulary needed by Echo and peers.
- Separate participant, principal, host, agent, and role.
- Define registration, admission, invocation, receipts, obstructions, and
  conformance report posture.
- Preserve agent-neutral but evidence-sensitive authority boundaries.

Owners:

- Continuum owns the protocol spine and conformance vocabulary.
- Echo implements its participant posture under Gate B.

Primary issues:

- [continuum#31](https://github.com/flyingrobots/continuum/issues/31):
  Gate A - Continuum Protocol Spine
- [echo#585](https://github.com/flyingrobots/echo/issues/585):
  Gate A - Continuum Participant Conformance

Primary evidence:

- Versioned participant descriptor/profile vocabulary.
- Registration, admission, invocation, observation, receipt, and obstruction
  vocabulary.
- Echo participant descriptor and capability/profile posture.
- Conformance report tied to exact Continuum and Echo commits.
- Negative fixtures proving labels such as `agent`, `human`, `browser`, or
  `trusted app` do not expand authority.

Pass rule:

The conformance suite returns pass/fail, the published report references exact
commits, and every required positive and negative fixture passes.

### GP3 - Networked Suffix Exchange

Purpose:

- Prove Echo and `git-warp` can exchange witnessed causal suffixes over a real
  network boundary.
- Treat transport arrival as a proposal for admission, not as semantic history.
- Demonstrate deterministic admission or rejection for hostile and duplicate
  cases.
- Reconstruct state from received history rather than synchronizing mutable
  snapshots.

Owners:

- Continuum owns the shared suffix-exchange profile.
- Echo owns the Echo peer.
- `git-warp` owns the `git-stunts/git-warp` peer.

Primary issues:

- [continuum#33](https://github.com/flyingrobots/continuum/issues/33):
  Gate D - git-warp Suffix Exchange Profile
- [echo#591](https://github.com/flyingrobots/echo/issues/591):
  Gate B - Networked Causal Suffix Exchange
- [git-warp#663](https://github.com/git-stunts/git-warp/issues/663):
  Gate D - git-warp Suffix Exchange Implementation

Primary evidence:

- Bidirectional exchange over an actual network boundary.
- Disconnect and resume transcript.
- Duplicate, reordered, stale, tampered, and interrupted suffix cases.
- Deterministic admission or rejection receipts.
- Reconstructed-state proof from received history.
- Evidence bundle containing both peer identities and commit SHAs.

Pass rule:

Both directions succeed over the network boundary, all negative cases reject or
resume as specified, and the proof bundle pins Echo, `git-warp`, Continuum
profile, peer identities, and trace digests.

### GP4 - Edict Artifact Pipeline

Purpose:

- Make Edict the deterministic artifact and invocation system used by the
  stack.
- Define semantic and release bundle identity.
- Define bundle-subject binding, invocation envelope semantics, capability and
  optic enforcement, and rejection posture.
- Preserve the line between Edict as compiler/artifact system and Continuum as
  participant/admission protocol.

Owners:

- Edict owns compiler, artifact, identity, lawpack, and target-profile lowering
  semantics.
- Continuum owns participant registration, admission, invocation, and
  capability posture around exact artifacts.
- Echo consumes admitted artifacts for runtime execution.

Primary issues:

- [edict#11](https://github.com/flyingrobots/edict/issues/11):
  Gate C - Edict Artifact Admission Contract
- [echo#589](https://github.com/flyingrobots/echo/issues/589):
  Gate C - Native Jedit-on-Edict Execution

Primary evidence:

- Deterministic compilation fixtures.
- Versioned artifact schema.
- Semantic and release bundle-subject fixtures.
- Capability and optic enforcement fixtures.
- Malformed, unauthorized, incompatible, stale, and replay rejection cases.

Pass rule:

Edict conformance fixtures pass, artifact schema and digest evidence are linked,
and Echo can admit or reject exact artifacts using Continuum-owned authority
rules.

### GP5 - Native Jedit-On-Edict Execution

Purpose:

- Prove designated `jedit` operations execute through Edict artifacts admitted
  by Echo.
- Remove or make unreachable the legacy direct execution bypass.
- Link authored operation, Edict bundle, Echo admission, invocation envelope,
  and Echo mutation in one trace.

Owners:

- `jedit` owns the product operation set and client proof.
- Edict owns compilation and bundle identity.
- Echo owns admission, invocation, and mutation execution.

Primary issues:

- [jedit#143](https://github.com/flyingrobots/jedit/issues/143):
  Gate E - jedit Native Operation Proof
- [echo#589](https://github.com/flyingrobots/echo/issues/589):
  Gate C - Native Jedit-on-Edict Execution
- [echo#515](https://github.com/flyingrobots/echo/issues/515):
  jedit Real Echo Release Gate

Primary evidence:

- Designated `jedit` operation set.
- Edict bundles for each designated operation.
- Echo admission and invocation receipts.
- End-to-end trace from authored operation to Echo mutation.
- Negative proof that the legacy direct bypass cannot execute.

Pass rule:

All designated operations execute through Edict and Echo, the old bypass is
removed or unreachable, and the trace links authored operation, bundle,
admission, invocation, and Echo mutation.

### GP6 - Release Integrity And Compatibility Manifest

Purpose:

- Prove the stack as one pinned compatibility set.
- Package proof packets and release artifacts.
- Verify clean-room build, upgrade, rollback, docs, packages, and adversarial
  release demo.
- Prevent release from unpinned local worktrees or independently green repos.

Owners:

- Continuum owns the compatibility manifest shape and release-integrity gate.
- Each participating repository owns its pinned evidence.

Primary issues:

- [continuum#32](https://github.com/flyingrobots/continuum/issues/32):
  Gate F - Cross-Repo Release Integrity
- [echo#588](https://github.com/flyingrobots/echo/issues/588):
  Gate D - Release Integrity
- [echo#579](https://github.com/flyingrobots/echo/issues/579):
  Durability Release Test Slice
- [echo#580](https://github.com/flyingrobots/echo/issues/580):
  Documentation Truth Gate
- [echo#581](https://github.com/flyingrobots/echo/issues/581):
  Umbrella Issue Closure Audit

Primary evidence:

- `continuum-convergence.lock` or successor manifest.
- Pinned commits, versions, protocol identifiers, artifact schema versions, and
  bundle digests.
- Clean-room reproducible build evidence.
- Upgrade and rollback test evidence.
- Package and documentation verification.
- Proof packets from all gates.
- Adversarial release demo for tampered suffix, unauthorized Edict artifact,
  incompatible participant, direct `jedit` bypass, and interrupted exchange
  recovery.

Pass rule:

The compatibility manifest verifies from clean checkout state, every gate issue
is closed by evidence-bearing PRs, and the release candidate is generated only
from the pinned set.

## Release Ordering

The goalposts are ordered because later evidence depends on earlier substrate:

```text
GP0 control surface
  -> GP1 durable causal history
  -> GP2 participant protocol spine
  -> GP3 networked suffix exchange
  -> GP4 Edict artifact pipeline
  -> GP5 native jedit-on-Edict execution
  -> GP6 release proof
```

The order is not a ban on parallel work. It is an evidence dependency model.
For example, Edict can advance while Echo durability lands, but the final
native `jedit` proof cannot close until Echo can durably admit and replay the
causal history it mutates.

## Closure Rules

An issue closes only when its pass rule is satisfied and linked evidence is
inspectable.

Do not close a release issue only because:

- code merged
- a local checklist was updated
- a demo worked on one machine
- CI was green in one repository
- an agent or reviewer said the direction was right

Close release work only when the issue's executable check, proof packet,
conformance report, receipt chain, or manifest evidence answers the stated
contract.

## Immediate Handoff

The current stack handoff is to execute GP1 in Echo.

The first ready implementation slice is:

- [echo#554](https://github.com/flyingrobots/echo/issues/554):
  Runtime WAL Store Adapter Boundary

That slice should produce the runtime WAL adapter boundary and deterministic
tests that make later filesystem durability, recovery, WSC export/import,
retention, crashpoint, and release proof slices possible.

The handoff remains GitHub-native: issue status, linked pull request, checks,
review, and closure evidence live on the issue and in Project #15.

## Playback Questions

1. Does this packet tell a maintainer why the roadmap belongs in Continuum
   without turning Continuum into the owner of implementation internals?
2. Can an agent determine the next execution slice from the Project and issue
   graph without reading a live task list in a repository document?
3. Does the distinction between stack goalposts and local issue title prefixes
   prevent Project metadata from lying?
4. Is every release gate binary enough to demand executable evidence?
5. Does the roadmap still enforce that agents, apps, humans, browsers, CLIs,
   and fixtures participate through the same Continuum boundary?

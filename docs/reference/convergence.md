---
title: Continuum Stack Convergence
status: current
---

# Continuum Stack Convergence

This page is the durable reference for the cross-repository release bar:
ownership, gates, evidence, and ordering. **Live status is not here** — issues,
project columns, assignees, and PRs live in GitHub:

- Project: [Continuum Stack Convergence](https://github.com/users/flyingrobots/projects/15)
- Release Bar issue: [continuum#30](https://github.com/flyingrobots/continuum/issues/30)

The full design history is in the design log:
[0035 convergence](../design/0035-continuum-stack-convergence/README.md),
[0036 roadmap](../design/0036-continuum-stack-release-roadmap/README.md),
[0037 slice plan](../design/0037-continuum-stack-project-slice-plan/README.md),
[0030 spine protocol report](../design/0030-continuum-spine-protocol-report/README.md).

## The release claim

The stack release is **not** several green repositories. It is one demonstrated
compatibility set:

```text
Echo 1.0 =
  Continuum participation
  + durable Echo causal history
  + networked suffix exchange
  + Edict artifact admission
  + native jedit operation execution
  + release integrity proof
```

Echo is the release vehicle; Continuum is the coordination spine that says which
repo owns each contract, which evidence closes each argument, and which
compatibility set binds the stack. Green CI in one repo is evidence, not the
release.

## Repository ownership

| Repository | Owns |
| --- | --- |
| Continuum | Cross-repo vocabulary, profiles, release bar, compatibility-set shape, conformance posture, shared proof vocabulary. |
| Echo | Runtime admission, WAL/WSC durability, receipts, readings, mutation execution, the Echo 1.0 release contract. |
| `git-warp` | Causal suffix substrate behavior and peer exchange (from the `git-stunts/git-warp` side). |
| Edict | Deterministic source, compiler, bundle identity, artifact schema, lawpack, target-profile lowering. |
| `jedit` | Product operation semantics and the designated native operation proof. |
| Graft | Structural observer posture and translated-vs-native evidence boundaries. |
| WARP TTD | Debugger/trace/profile surfaces over Continuum-compatible participants. |
| WARP DRIVE | Browser/app projection surfaces over readings and intents. |
| Wesley | Contract-family compilation and generated adapter surfaces. |

No repo may mint a shadow schema, vocabulary, or ownership map for shared
Continuum contracts. See the [Shared Noun Ownership Map](ownership-map.md).

## Gates

Every gate issue states a Contract, Owner, Executable check, Required evidence,
Negative cases, Compatibility set, and Pass rule. Summary:

| Gate | Passes when | Owner | Canonical issue |
| --- | --- | --- | --- |
| A — Continuum Protocol Spine | The stack has a versioned participant/profile vocabulary, conformance posture, receipt/obstruction vocabulary, profile discovery shape, and fixture/report format tied to exact commits. | Continuum | [continuum#31](https://github.com/flyingrobots/continuum/issues/31) |
| B — Echo 1.0 Release Bar | Echo's own release bar passes and is linked to the Continuum compatibility set. | Echo | [echo#584](https://github.com/flyingrobots/echo/issues/584) |
| C — Edict Artifact Admission | Edict defines deterministic bundle identity, artifact schemas, target-profile lowering, bundle-subject binding, invocation envelope semantics, capability/optic enforcement, and negative rejection cases. | Edict | [edict#11](https://github.com/flyingrobots/edict/issues/11) |
| D — git-warp Suffix Exchange | Echo and `git-warp` exchange witnessed causal suffixes both directions over a real network boundary and deterministically handle duplicate, reordered, stale, tampered, disconnected, and resumed cases. | Continuum (profile) / `git-warp` (impl) | [continuum#33](https://github.com/flyingrobots/continuum/issues/33), [git-warp#663](https://github.com/git-stunts/git-warp/issues/663) |
| E — jedit Native Operation Proof | Designated `jedit` operations compile through Edict, are admitted and invoked through Echo, and the old direct execution path is removed or provably unreachable. | `jedit` | [jedit#143](https://github.com/flyingrobots/jedit/issues/143) |
| F — Cross-Repo Release Integrity | The pinned compatibility set, proof packets, clean-room build, upgrade/rollback test, package verification, docs verification, and negative release demo all pass from exact commits. | Continuum | [continuum#32](https://github.com/flyingrobots/continuum/issues/32) |

## Goalpost ordering

Goalposts are an evidence-dependency model, not a ban on parallel work — later
evidence depends on earlier substrate:

```text
GP0 control surface
  -> GP1 durable Echo causal history
  -> GP2 participant protocol spine
  -> GP3 networked suffix exchange
  -> GP4 Edict artifact pipeline
  -> GP5 native jedit-on-Edict execution
  -> GP6 release proof
```

Echo durability is stack `GP1` even where Echo's local issue titles label it
otherwise: durable causal history is the first substrate later suffix-exchange
and recovery proofs depend on.

## Compatibility set

Gate F must produce a machine-readable manifest (`continuum-convergence.lock`
or a successor with equivalent semantics) that pins:

- Continuum commit and profile versions.
- Echo commit and release-candidate version.
- `git-warp` commit and suffix-exchange protocol version.
- Edict commit, artifact schema version, and bundle digests.
- `jedit` commit and the designated operation set.
- Graft / WARP TTD / WARP DRIVE / Wesley commits where they participate.
- Workflow runs, proof-packet digests, network traces, conformance reports, and
  admission/invocation receipts.

The current concrete (local-sibling-proof) tuple is the
[demo stack release manifest](../releases/demo/continuum-stack-release.json).

## Closure rule

An issue closes only when its pass rule is satisfied and the linked evidence is
inspectable. Do **not** close release work merely because code merged, a local
checklist was ticked, a demo worked on one machine, CI was green in one repo, or
a reviewer agreed with the direction.

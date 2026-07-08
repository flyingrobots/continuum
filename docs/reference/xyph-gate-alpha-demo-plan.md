---
title: Xyph Gate Alpha demo plan
status: current
---

# Xyph Gate Alpha Demo Plan

Status anchor: 2026-07-08

Current campaign state:

- GP0 is complete across Continuum, Edict, Echo, and Xyph.
- GP0 milestones are closed.
- GP1 milestones are open.
- GP1 has one open anchor issue per repo.

This document is the demo spine for the Profunctor Optics / Xyph Gate Alpha
campaign. It is meant to be edited as decisions land. Chat context should flow
back into this file whenever it changes the plan.

## One Sentence

Xyph Gate Alpha proves that an AI agent or developer cannot move a protected
software change across a boundary unless the change declares its intent, passes
policy, produces deterministic evidence, and leaves a repairable audit trail.

## The Demo Promise

The first complete demo should show this:

```text
An agent-authored PR changes a protected payment workflow.
Xyph Gate computes what behavior became reachable.
The unsafe change is blocked in shadow mode first, then in enforce mode.
Workbench explains the blocked path and emits a finite repair menu.
The repaired change passes.
The ledger records the receipt, witness capsule, obligation state, and verdict.
Verify can check the capsule in a separate checkout.
```

The buyer-facing version is simpler:

```text
Give agents bounded intents, not root access.
Every blocked action comes with evidence and a lawful repair path.
Every accepted action leaves a receipt.
```

## Fixed Campaign Facts

These facts are already anchored in the Goalpost 0 GitHub issues:

| Field | Value |
| --- | --- |
| Campaign | `Xyph Gate Alpha` |
| First protected workflow | `payment_receipt_required@0` |
| First aperture | `payment_reliability@0` |
| First trace shape | `TraceRunReceiptV0` |
| First proof-plan shape | `EchoProofPlanV0` |
| First witness envelope | `WitnessCapsuleV0` |
| First diff shape | `HorizonDiffV0` |
| First obligation shape | `ObligationV0` |
| First policy question | Can `capture:success` happen without durable receipt obligation satisfaction? |
| First product mode | Shadow verdict before enforcement |

Goalpost 0 anchors:

| Repo | Issue | Responsibility |
| --- | --- | --- |
| `continuum` | https://github.com/flyingrobots/continuum/issues/77 | Evidence vocabulary anchor |
| `edict` | https://github.com/flyingrobots/edict/issues/135 | `EchoProofPlanV0` scope |
| `echo` | https://github.com/flyingrobots/echo/issues/645 | `TraceRunReceiptV0` scope |
| `xyph` | https://github.com/flyingrobots/xyph/issues/77 | Shadow Gate workflow fixture |

## Product Vocabulary For The Demo

Use only these words in the first demo unless a deeper term is unavoidable:

```text
intent
policy
aperture
admit
reject
execute
receipt
evidence
obstruction
repair
settle
```

Internal docs may keep the richer ontology. The demo must not make buyers learn
the whole ontology before they understand the value.

## Proof Honesty

The first demo is a Tier 2 / Tier 3 evidence product. It must not claim Tier 5.

| Level | Name | Demo Posture |
| --- | --- | --- |
| L0 | Agent assertion | Never enough for settlement |
| L1 | Signed receipt | Useful for smoke tests |
| L2 | History inclusion | Minimum serious target |
| L3 | Holographic support | Main near-term target |
| L4 | Native verification or challenge replay | Later hardening |
| L5 | Proof-carrying transition | Future ZK backend |

Build Level 2 and Level 3 first. Design so Level 5 can arrive later.

## Two-Lane Doctrine

The demo must distinguish the cheap lane from the settlement lane.

### Cheap Lane

The cheap lane is for scratch work:

- reading files
- searching code
- drafting patches
- running tests in a sandbox
- producing candidate plans
- exploring local fixtures

Cheap-lane actions may be logged, but they do not require full ceremony because
they cannot mutate protected state.

### Settlement Lane

The settlement lane is for changes that cross a boundary:

- merge a protected PR
- apply infrastructure
- grant access
- write production data
- change a policy
- close an obligation
- emit audit evidence

Settlement-lane actions require declared intent, policy evaluation,
deterministic evidence, and a receipt or explicit obstruction.

The demo should make this feel ergonomic: agents move fast inside the cheap lane,
but every boundary crossing is lawful, witnessed, and repairable.

## The Full End-To-End Flow

This is the target flow once all first-version pieces exist.

```text
1. Agent or developer proposes a protected change.
2. Xyph identifies the affected workflow and aperture.
3. Edict turns the proposal into a bounded intent.
4. Edict emits or references a contract bundle and Target IR artifact.
5. Edict emits `EchoProofPlanV0`.
6. Wesley-shaped canonical rules bind schema, codecs, and digests.
7. Echo validates the plan, bundle, basis, and authority posture.
8. Echo executes or simulates deterministically.
9. Echo emits `TraceRunReceiptV0` and trace rows.
10. Continuum wraps the result as `WitnessCapsuleV0`.
11. Xyph computes a base/head `HorizonDiffV0`.
12. Xyph evaluates policy.
13. Gate returns `ALLOW`, `SHADOW`, `BLOCK`, or `OVERRIDE_WITH_DEBT`.
14. If blocked, Workbench explains the obstruction.
15. Workbench emits a typed repair obligation and finite repair menu.
16. Agent or developer chooses one lawful repair path.
17. Gate reruns on the repaired change.
18. Ledger records receipts, obligations, overrides, and evidence posture.
19. Verify checks the witness capsule from outside the producing runtime.
20. The campaign graduates to the next protected workflow.
```

## First Demo Script

The first demo should be boring, concrete, and complete.

### Setup

The repository contains a protected payment workflow:

```text
payment_receipt_required@0
```

The active aperture asks:

```text
payment_reliability@0:
  Can this payment path reach capture:success without durable receipt evidence?
```

### Act 1: Unsafe Change

An agent-authored PR changes retry behavior in the payment workflow. The change
creates a reachable path:

```text
capture: success
ledger: success
receipt: missing or not durable
```

Expected Gate result:

```text
status: SHADOW
would_block: true
new_reachable_region: partial_charge_without_receipt
obligation: durable_receipt_evidence_required
evidence_posture: missing
```

### Act 2: Repair Menu

Workbench opens the blocked trace and shows:

```text
obstruction_type: receipt_obligation_unsatisfied
failed_boundary: payment_reliability@0
required_evidence: durable receipt witness
supplied_evidence: none
```

The context governor gives only finite repair choices:

```text
1. Add durable receipt write before payment settlement.
2. Add compensating obstruction that prevents capture success without receipt.
3. Mark the region as obligation debt with owner, severity, TTL, and override.
4. Abandon the change.
```

The agent must choose one of these paths. It must not broaden authority, bypass
the policy, or invent a second path outside the aperture.

### Act 3: Repaired Change

The agent chooses the first path and adds the required durable receipt step.

Expected Gate result:

```text
status: ALLOW
new_reachable_region: none_unwitnessed
obligation_state: satisfied
trace_receipt: present
witness_capsule: present
ledger_update: recorded
```

### Act 4: Verification

The evidence capsule is verified outside the producing runtime:

```text
xyph verify capsule artifacts/payment_receipt_required/head.capsule.json
```

Expected result:

```text
capsule: valid
proof_strength: L3_holographic_support
native_policy: satisfied
missing_evidence: none
open_obligations: none
```

## Repository Roles

### Continuum

Continuum owns the boundary language for exchanged evidence.

For the demo, it should define fixture vocabulary only:

- `WitnessCapsuleV0`
- `ApertureV0`
- `HorizonDiffV0`
- `ObligationV0`
- digest domains
- evidence posture fields

Continuum must not freeze a broad protocol family before the owning repos prove
the compiled artifact, invocation, witness, and settlement path.

### Edict

Edict owns the intent, target artifact, and proof-plan shape.

For the demo, it should emit or fixture:

- one bounded intent for `payment_receipt_required@0`
- one `TargetIrArtifact`
- one `EchoProofPlanV0`
- deterministic proof-plan digest
- capability footprint
- tick and structural bounds
- obstruction taxonomy version

Edict should use the existing local `proof_plan.rs` work as raw material, not as
a claim that proof planning is complete.

### Echo

Echo owns deterministic execution and trace receipts.

For the demo, it should emit or fixture:

- `TraceRunReceiptV0`
- ordered `TraceRowV0` entries
- starting and ending state roots
- operation digest
- capability footprint
- obstruction field
- retained evidence refs or explicit missing-retention posture

Echo PR #644 is useful but not blocking for Goalpost 0. WAL durability becomes a
hard dependency when the campaign claims durable replay and retained evidence.

### Xyph

Xyph owns the product loop.

For the demo, it should provide:

- workflow resolver
- aperture selector
- policy config
- Horizon Diff renderer
- shadow verdict
- enforcement verdict
- Workbench explanation
- repair menu
- ledger report
- capsule verification command

The first Xyph product surface is Gate. Workbench follows once Gate can produce
a real blocked trace. Worker follows only after Gate can constrain it.

### Wesley-Shaped Canonical Layer

The roadmap uses Wesley as the schema and canonical codec layer. If there is no
separate Wesley repo yet, the first demo can host this responsibility in Edict
fixtures and Echo validation seams.

For the demo, the canonical layer must define:

- schema digest
- codec digest
- source digest
- canonical value digest
- lifting profile digest, if legacy data is involved
- migration profile digest, if schema evolution is involved

No participant may hash an ad hoc JSON string and call it evidence.

## Goalposts

### GP0: Campaign Grounding

Purpose: stop scope drift before code expands.

Deliverables:

- campaign label exists in all repos
- GP0 milestone exists in all repos
- one anchor issue exists per repo
- first protected workflow is fixed
- first aperture is fixed
- first target trace shape is fixed
- blocking adjacent PRs are explicitly parked or promoted

Current state:

- completed in Continuum, Edict, Echo, and Xyph
- GP0 issues and milestones are closed
- first fixture: `payment_receipt_required@0`
- first aperture: `payment_reliability@0`
- first trace shape: `TraceRunReceiptV0`
- successor GP1 issues:
  - Continuum: https://github.com/flyingrobots/continuum/issues/78
  - Edict: https://github.com/flyingrobots/edict/issues/136
  - Echo: https://github.com/flyingrobots/echo/issues/646
  - Xyph: https://github.com/flyingrobots/xyph/issues/79

Definition of done:

- each GP0 issue has the final fixture vocabulary decision
- each repo knows exactly what it owns for GP1
- GP1 issues are opened

### GP1: Evidence Vocabulary Freeze

Purpose: agree on the nouns and fixture fields.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Continuum | `WitnessCapsuleV0`, `ApertureV0`, `HorizonDiffV0`, `ObligationV0` fixtures |
| Edict | `EchoProofPlanV0` fixture and digest domain |
| Echo | `TraceRunReceiptV0` and `TraceRowV0` fixture |
| Xyph | aperture and policy config that names those refs |

Demo command:

```text
xyph gate explain-fixture payment_receipt_required@0
```

Definition of done:

- one fixture id appears in all four repos
- evidence posture is explicit
- missing evidence is an obligation, not a warning string
- no runtime execution is required yet

### GP2: Fixture-Backed Gate Shadow

Purpose: make Xyph look like the product before every substrate is real.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Continuum | fixture capsule around base/head evidence refs |
| Edict | fixture proof plans for base and head |
| Echo | fixture trace receipts for base and head |
| Xyph | shadow Gate command and Horizon Diff renderer |

Demo command:

```text
xyph gate shadow fixtures/payment_receipt_required
```

Expected output:

```text
status: SHADOW
would_block: true
new_reachable_region: partial_charge_without_receipt
obligation: durable_receipt_evidence_required
```

Definition of done:

- Xyph can show what changed between base and head
- the result is deterministic from fixtures
- the output is legible to a platform engineer

### GP3: Edict To Echo Core Trace

Purpose: complete the first real vertical substrate path.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Edict | tiny source or fixture lowers to `TargetIrArtifact` and `EchoProofPlanV0` |
| Echo | accepts the artifact/plan and emits deterministic `TraceRunReceiptV0` |
| Continuum | wraps the trace as `WitnessCapsuleV0` |
| Xyph | consumes the real artifacts instead of static fixtures |

Demo command:

```text
xyph gate trace fixtures/payment_receipt_required
```

Definition of done:

- one accepted path produces a real trace receipt
- one rejected path produces a typed obstruction
- same input reproduces same evidence
- no ZK and no GitHub integration required

### GP4: Repair Menu MVP

Purpose: turn a blocked trace into a lawful next move.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Echo | obstruction fields carry enough structure for repair |
| Edict | obstruction maps back to intent fields where possible |
| Xyph | context governor compiles finite repair menu |
| Continuum | witness capsule can carry obstruction and obligation refs |

Demo command:

```text
xyph workbench repair artifacts/payment_receipt_required.blocked.json
```

Definition of done:

- agent receives typed repair obligations, not raw errors
- repair menu has finite choices
- bypass attempts remain policy failures
- repaired intent can be rerun

### GP5: Enforcing Gate MVP

Purpose: convert shadow evidence into a merge-blocking product.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Xyph | policy evaluator returns `ALLOW`, `BLOCK`, `SHADOW`, `OVERRIDE_WITH_DEBT` |
| Xyph | CLI or GitHub Action posts a PR verdict |
| Continuum | capsule carries verdict and obligation refs |
| Edict | stable command or fixture surface for proof-plan generation |
| Echo | stable command or fixture surface for trace generation |

Demo command:

```text
xyph gate check --base main --head HEAD --aperture payment_reliability@0
```

Definition of done:

- unsafe PR is blocked
- block links to evidence
- override creates explicit debt
- result is reproducible locally

### GP6: Effector Boundary MVP

Purpose: stop the demo from pretending that Echo receipts automatically prove
the outside world changed.

The demo must model external side effects as:

```text
act -> observe -> attest
```

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Echo | receipt distinguishes internal state transition from external effect claim |
| Continuum | evidence posture can say claimed, observed, confirmed, stale, or contradicted |
| Xyph | policy can require confirmation evidence before settlement |
| Edict | intent can declare required effect confirmation |

Definition of done:

- receipt does not overclaim reality
- missing confirmation becomes an obligation
- out-of-band divergence can be represented as evidence, not prose

### GP7: Ledger And Obligation Report MVP

Purpose: turn the technical demo into an audit artifact.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Xyph | local ledger index and obligation report |
| Continuum | capsule fields support obligation status and evidence posture |
| Echo | retained refs are stable enough for ledger records |
| Edict | proof-plan digest and artifact digest are listed in ledger entries |

Demo command:

```text
xyph ledger report --aperture payment_reliability@0
```

Definition of done:

- report lists proven, witnessed, assumed, and unmodeled regions
- every open obligation has owner, severity, TTL, and next action
- evidence strength does not outrun model grade

### GP8: Verify MVP

Purpose: prove evidence can cross a boundary.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Continuum | validation profile for `WitnessCapsuleV0` |
| Xyph | `xyph verify capsule <file>` |
| Echo | trace receipt digest can be checked from capsule refs |
| Edict | proof-plan digest can be checked from capsule refs |

Demo command:

```text
xyph verify capsule artifacts/payment_receipt_required/head.capsule.json
```

Definition of done:

- a separate checkout can verify the capsule
- verifier reports evidence posture and trust assumptions
- verifier can reject stale, incomplete, or mismatched evidence

### GP9: Workbench Minimum UI

Purpose: make blocked behavior visible.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Xyph | trace viewer for blocked tick, denied capability, and missing evidence |
| Xyph | export regression fixture from blocked trace |
| Echo | trace coordinates remain stable enough for UI linking |
| Edict | source or intent coordinate mapping |

Definition of done:

- developer can see why Gate blocked
- developer can export a regression fixture
- UI is useful without needing the full future product

### GP10: Worker Under Gate

Purpose: introduce autonomous repair only after Gate can constrain it.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Xyph | Worker accepts one obligation and proposes a bounded repair |
| Xyph | Worker output must pass Gate |
| Edict | generated repair intent can be checked |
| Echo | rerun proves whether the obligation closed |
| Continuum | capsule records the worker-authored path and evidence posture |

Definition of done:

- Worker cannot bypass Gate
- Gate feedback becomes Worker input
- repaired path closes or updates the obligation

### GP11: Tier 3 Holographic Support

Purpose: harden the evidence target without waiting for ZK.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Echo | state roots, local openings, causal slices, witness cores |
| Continuum | capsule profile for Level 3 evidence |
| Xyph | policy can require Level 3 for protected regions |
| Edict | proof plan names required support material |

Definition of done:

- high-value protected workflow can require L3 evidence
- verifier can distinguish L2 from L3
- support material is compact enough for practical use

### GP12: Tier 5 ZK Backend

Purpose: later proof compression, not the first product.

Repo deliverables:

| Repo | Deliverable |
| --- | --- |
| Echo | trace commitments and proof backend |
| Edict | proof-plan constraints mature enough for arithmetization |
| Continuum | capsule can carry proof refs and verifier metadata |
| Xyph | Gate verifies proofs instead of simulating traces |

Definition of done:

- proof backend replaces or compresses replay for selected workflows
- all earlier evidence posture remains honest
- Tier 5 does not rewrite the product contract

## Threat Model For The Demo

The demo must say who it defends against and who it does not yet defend
against.

| Actor | First Demo Posture |
| --- | --- |
| confused agent | defended by policy, aperture, and repair menu |
| prompt-injected agent | defended at Gate, not merely by prompt text |
| malicious agent | constrained by lack of settlement authority |
| tired human approver | UI must show compiled intent, not agent prose |
| compromised runtime host | not fully solved in GP1-GP5; requires signing-key and attestation hardening |
| malicious partner runtime | handled by native policy and evidence posture, not blind trust |
| wrong policy | represented as policy grade / lawpack debt, not magically solved |
| stale or refuted evidence | future taint and un-settlement workflow required |

Hard invariant:

```text
The menu is advice. Gate is law.
```

The agent may receive helpful context, but policy enforcement must happen at the
boundary.

## Prior Art And Reuse Bias

The demo should not pretend the world starts from zero.

Reuse or deliberately interoperate where practical:

- SCITT-shaped signed statements and transparency posture
- in-toto / SLSA / Sigstore provenance patterns
- deterministic CBOR / COSE / JCS for canonical bytes
- Cedar / OPA / Biscuit / UCAN concepts for policy and attenuated capability
- transparency-log patterns for history inclusion
- WASM/fuel concepts for deterministic bounded execution where they fit

The product claim is not that every primitive is new. The product claim is that
the primitives are assembled into an evidence-first control plane for agentic
software change.

## What Not To Build First

Do not start with:

- a ZK backend
- a universal DSL
- a beautiful dashboard without receipts
- autonomous Worker before Gate
- a generic distributed protocol freeze
- a full materialized projection system before one customer-scale bottleneck
- a huge new crate or package split before the vertical path works

Start with:

```text
one protected workflow
one aperture
one rejected path
one repaired path
one deterministic trace
one receipt
one witness capsule
one Gate verdict
one obligation report
```

## Milestone Exit Criteria

Every goalpost must produce:

- one command
- one fixture
- one evidence artifact
- one policy result
- one explicit non-goal list
- one CI check, once code exists

No milestone is complete if it only produces prose.

## The Demo Commands We Are Building Toward

```text
xyph gate explain-fixture payment_receipt_required@0
xyph gate shadow fixtures/payment_receipt_required
xyph gate trace fixtures/payment_receipt_required
xyph gate check --base main --head HEAD --aperture payment_reliability@0
xyph workbench repair artifacts/payment_receipt_required.blocked.json
xyph ledger report --aperture payment_reliability@0
xyph verify capsule artifacts/payment_receipt_required/head.capsule.json
```

## Near-Term Working Order

1. Finish GP0 by filling in the four anchor issues with final fixture decisions.
2. Open GP1 issues for the evidence vocabulary freeze.
3. Create the first cross-repo fixture id and digest domain names.
4. Add Continuum fixture vocabulary.
5. Shape Edict `EchoProofPlanV0` around the existing skeleton.
6. Shape Echo `TraceRunReceiptV0` as fixture-backed trace evidence.
7. Add Xyph shadow Gate command over fixtures.
8. Replace fixtures with the first real Edict-to-Echo trace.
9. Add repair menu output.
10. Move from shadow verdict to enforce verdict.

## Success Standard

The demo succeeds when a skeptical platform engineer can say:

```text
I see exactly what changed.
I see why the unsafe version was blocked.
I see what evidence was missing.
I see the lawful repair options.
I see the repaired trace and receipt.
I can verify the capsule.
I know what remains unproven.
```

That last line matters. The moat is evidence honesty.

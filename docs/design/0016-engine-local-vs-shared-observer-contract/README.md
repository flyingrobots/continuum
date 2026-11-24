---
title: Engine-Local Runtime vs Shared Observer Contract
status: archived
---

# Engine-Local Runtime vs Shared Observer Contract

**Cycle:** 0016-engine-local-vs-shared-observer-contract  
**Legend:** SOURCE  
**Type:** coordination cycle

## Hill

Freeze one sharper law for interoperability:

- Echo and `git-warp` do **not** need identical internal engine nouns
- Continuum tools **do** need one shared observer/debugger contract family

This packet answers the practical question:

**What must both engines publish so a Continuum tool can "just work" against
either one without switching mental models?**

## Why This Exists

The stack is converging on a dangerous ambiguity:

- some nouns belong to engine internals
- some nouns belong to the shared observer/debugger boundary
- some nouns belong to the session/control layer above both engines

If we do not separate those buckets, every integration becomes adapter folklore:

- Echo "looks like this"
- `git-warp` "looks like that"
- `warp-ttd` normalizes both by hand
- Wesley cannot tell which contracts are actually shared

That is not an interoperability story. It is a translation tax.

## Law

### 1. Internal engine nouns may differ

Echo and `git-warp` may keep different engine-local runtime nouns where their
engines genuinely differ.

Examples:

- Echo scheduler state
- Echo ingress / inbox / head eligibility
- Echo global tick and finalization details
- `git-warp` patch-chain / materialization / Git audit details

Those differences are not bugs. They are engine truth.

### 2. The observer/debugger boundary must converge

At the point where a Continuum tool, `warp-ttd`, CLI, MCP, or another shared
consumer looks in, the top-level noun families must converge.

The tool should not have to remember:

- "Echo receipts mean one thing"
- "`git-warp` receipts mean something else"
- "neighborhood only exists on one host"

The tool should instead see the same top-level categories and, only after that,
optionally drill into engine-specific shell.

### 3. Session/control nouns are distinct from engine-published nouns

Some important nouns are shared but should not be required from the engine
itself:

- `ObserverTrace`
- `SessionMode`
- `SessionSignal`

These may be published by a host/session layer or `warp-ttd` rather than by
the core engine tick boundary itself.

This packet therefore distinguishes:

- engine-local runtime nouns
- shared engine-published observer nouns
- shared session/control nouns

## The Shared Contract Buckets

### A. Shared engine-published observer nouns

These are the first families both Echo and `git-warp` should publish into.

#### 1. Lane identity family

Minimum shared meanings:

- lane identity
- worldline identity
- strand identity where applicable
- parent/base relation where applicable

This does not force identical internal storage. It forces one shared way to say
"what lane am I looking at?"

#### 2. Coordinate / frame family

Minimum shared meanings:

- observed lane/worldline coordinate
- local tick identity
- commit/boundary identity
- frame kind

Echo may keep richer global/scheduler coordinates. `git-warp` may keep
Git-native patch/materialization details. The shared contract is the
observer-facing coordinate/frame truth.

The older time-travel notes suggest one additional discipline here: the shared
observer boundary should remain explicit about the difference between:

- host time
- admitted history time
- session or control cursor position

An observer may remain live in host time while rewinding or replaying admitted
history. The shared contract should therefore avoid collapsing those axes into a
single "current time" fiction.

#### 3. Neighborhood core family

Minimum shared meanings:

- site identity
- singleton vs plural local site
- participating lane set
- participant roles

This is the debugger's real "what local wound am I inspecting?" object.

#### 4. Reintegration detail family

Minimum shared meanings:

- seam anchors
- compatibility obligations
- compatibility evidence
- local outcome / verdict

This is where merge/collapse/settlement obstruction becomes explicit.

#### 5. Receipt shell family

Minimum shared meaning:

- explanatory and runtime shell around the core site and reintegration truth

This family is shared as a category, not as one identical engine payload.
Engine-specific shell is allowed and expected below the common envelope.

The observer contract should continue to inherit the witness/shell separation
from Continuum core doctrine: a shared observer surface may receive shells, but
it must not mistake those shells for the witness core itself.

#### 6. Effect emission family

Minimum shared meanings:

- outbound effect candidate identity
- effect kind
- producing coordinate / lane

This should feel the same to a debugger whether the source is Echo or
`git-warp`.

#### 7. Delivery observation family

Minimum shared meanings:

- sink or delivery target identity
- delivery outcome
- relation to the originating effect candidate

This may still be absent on a host that does not yet publish delivery truth,
but the family itself should be shared.

### B. Shared session/control nouns

These are shared across tools, but need not be engine-published by the runtime
itself.

#### 1. Observer trace family

Minimum shared meanings:

- the observer/session encountered this site or effect
- encounter mode
- encounter shape

This is distinct from effect emission and distinct from delivery.

The older observer notes also suggest a useful product rule here: tools should
be able to preserve distinct observer surfaces intentionally, for example:

- fast state view
- provenance view
- intent/conflict view
- replay-oriented view

Those surfaces may agree on terminal state while differing in retained causal
fidelity. The shared contract should preserve room for that distinction instead
of forcing a single flattened observer story.

#### 2. Session mode / session signal family

Minimum shared meanings:

- `LIVE`
- `REPLAY`
- `DEBUG`
- entering/exiting replay
- seek / jump / reattach-live signals

These are session/control nouns. They should not be stapled onto effect or
receipt truth as fake engine facts.

## What Should Stay Engine-Local

### Echo-local examples

- `SchedulerStatus`
- `IngressTarget`
- `InboxPolicy`
- `WriterHeadKey`
- head eligibility / disposition
- `GlobalTick`
- `FinalizeReport`

### `git-warp`-local examples

- patch-chain structure
- Git commit/materialization specifics
- storage provenance elaborations
- host-specific audit shells

These may be exposed in shell or drill-down views. They should not be promoted
to the shared observer/debugger core just because they matter.

## What Should Not Be Forced Yet

`BoundaryTransitionRecord` / BTR-like packaging should **not** be the first
forced shared noun.

Why:

- it is a higher-order packaging object
- Echo and `git-warp` are still converging on smaller boundary nouns
- forcing BTR first would flatten real lower-level differences too early

The right move is to converge first on the smaller shared families above. A
larger packaged record may emerge later once those cores are stable.

## Interoperability Standard

A Continuum tool counts as interoperable across Echo and `git-warp` when:

1. it can ask the same top-level questions of both hosts
2. it receives the same top-level noun categories back
3. host-specific detail appears only as shell or drill-down
4. the tool does not need a host-specific ontology switch to reason correctly

That is the standard. Not identical internals. Identical observer contract.

## Repo Consequences

### Continuum

Continuum should own this law and use it as the promotion rule for shared
families.

### Wesley

Wesley should compile distinct family cuts rather than one giant omnibus
schema:

- lane identity
- coordinate/frame
- neighborhood core
- reintegration detail
- receipt shell
- effect emission
- delivery observation
- observer trace / session families where appropriate

### Echo

Echo should make `0007` and `0008` real and publish:

- native neighborhood-site truth
- settlement / reintegration publication

without pretending Echo-local scheduler/runtime shell is already the shared
contract.

### `git-warp`

`git-warp` should continue the witness-ladder and local-site work so it
publishes the same top-level categories without losing its runtime-local
implementation truth.

### `warp-ttd`

`warp-ttd` should consume these shared families and stop being the permanent
normalization swamp for host differences.

## Promotion Law

A noun graduates into a Continuum shared contract family only when:

1. at least two repos need the same semantics
2. those repos need the same interchange shape
3. the noun is stable enough that promoting it reduces drift rather than
   freezing confusion

Until then:

- keep it local
- name the synthesis honestly
- do not quietly present host-local shell as if it were already shared truth

## Done Looks Like

- Echo and `git-warp` keep their engine-local richness
- Continuum tools see one stable observer/debugger noun stack
- Wesley compiles shared family cuts instead of papering over drift
- `warp-ttd` can debug either engine without becoming two different products

That is the right parity target.

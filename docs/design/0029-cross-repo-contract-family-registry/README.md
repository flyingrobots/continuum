---
title: Cross-Repo Contract Family Registry
status: archived
---

# Cross-Repo Contract Family Registry

**Cycle:** 0029-cross-repo-contract-family-registry
**Legend:** SOURCE
**Type:** coordination cycle
**Sponsor human:** James
**Sponsor agent:** Codex

## Hill

Publish one small registry that makes shared contract-family ownership,
consumption, and witness posture visible across Continuum, Wesley, Echo,
`git-warp`, and `warp-ttd`.

The registry exists so maintainers can answer:

- which repo authored this family?
- which shared nouns does the family publish?
- does Wesley have a profile or witness for it?
- which sibling runtimes or tools are expected to emit or consume it?
- which claims are still gaps?

## Why This Exists

The sibling-runtime doctrine is now clearer:

- Continuum owns shared protocol, contract, admissibility, and witness language
- Wesley compiles and witnesses Continuum contract families
- Echo and `git-warp` are sibling runtime implementations
- `warp-ttd` is a debugger/operator consumer, not a shadow contract authority

But the repo still needed one practical map that separates those roles per
family.

Without that map, every discussion has to rediscover the same answers by
memory, and downstream repos can accidentally turn generated artifacts,
fixtures, or host-local mirrors into de facto canonical contracts.

## Decision

The registry lives at:

- [docs/contract-family-registry.md](../../contract-family-registry.md)

It is intentionally Markdown-first. The current need is a factual
coordination table, not a new schema, CLI, database, or generated artifact.

The registry records:

- registry key
- version
- authored home
- shared nouns
- Wesley status
- runtime status
- primary consumers
- evidence today
- open compatibility cut

## Registry Law

### 1. Authored home is not runtime truth

The authored GraphQL family says what the shared contract means. It does not
make Continuum a runtime, substrate, or implementation facade.

### 2. Wesley status is not semantic ownership

Wesley may compile, bundle, witness, and drift-watch a family. That does not
make Wesley the semantic owner of Continuum-owned families.

### 3. Runtime status needs runtime evidence

A family is not live-runtime-compatible merely because a schema exists or a
fixture passes.

Runtime compatibility requires a runtime to emit or consume conforming values
and a witness to record the claim.

### 4. Interop claims are stricter than single-runtime claims

Cross-runtime compatibility requires witnessed suffix exchange and admission
between sibling runtimes. It is not enough for two runtimes to have similar
local structs.

### 5. Missing evidence stays visible

The registry should name gaps directly. It should not hide them behind vague
phrases like "supported by the stack" unless the supporting witness exists.

## Initial Scope

The first registry slice covers the Continuum-authored family spine already on
disk:

- `receipt-family`
- `settlement-family`
- `neighborhood-core-family`
- `runtime-boundary-family`

It also expands the minimum runtime-boundary nouns because those are the next
active sibling-runtime compatibility target:

- `IntentEnvelope`
- `TickResult`
- `ObserverPlan`
- `ObservationRequest`
- `ReadingEnvelope`
- `WitnessedSuffixShell`
- `CausalSuffixBundle`
- `ImportOutcome`

## Smallest Honest Artifact

The smallest honest artifact is not a new implementation. It is the registry
itself:

- [docs/contract-family-registry.md](../../contract-family-registry.md)

That file is enough to turn "we should have a compatibility matrix" into an
inspectable repo truth. The remaining work is to make more rows move from
`authored` to `fixture-witnessed`, and eventually to live runtime evidence.

## Playback Questions

### Human

- [ ] Can I tell which repo authored each shared family?
- [ ] Can I tell whether a row is proven or only planned?
- [ ] Can I see the next missing cut without reading five repos?

### Agent

- [ ] Can I avoid creating a shadow family in Echo, `git-warp`, `warp-ttd`, or
      an app repo?
- [ ] Can I decide whether to add a Wesley profile, fixture witness, runtime
      emitter, or consumer compatibility declaration next?
- [ ] Can I report gaps without overstating compatibility?

## Non-Goals

- defining a new wire protocol
- adding a registry service or CLI
- adding implementation code to Echo, `git-warp`, `warp-ttd`, or Wesley
- claiming live runtime compatibility from schema existence alone
- making Continuum the runtime or compiler owner

## Follow-Up Cuts

The registry makes the next cuts sharper:

- add a Wesley profile for `runtime-boundary-family`
- add fixture witnesses for `runtime-boundary-family`
- add a consumer compatibility declaration shape for sibling repos
- prove one witnessed suffix exchange/admission path between Echo and
  `git-warp`
- decide whether the registry eventually needs a machine-readable companion

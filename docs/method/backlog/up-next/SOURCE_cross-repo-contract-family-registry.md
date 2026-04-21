# Cross-repo contract family registry

- Lane: `up-next`
- Legend: `SOURCE`
- Rank: `1`

## Why now

The stack now has a much clearer contract-family story, but one practical piece
is still missing: a single registry that says, for each shared family:

- authored home
- compiler/module owner
- runtime emitter
- primary consumers
- non-authoritative mirrors or projections

Without that registry, every cross-repo discussion has to re-derive the same
answers by memory:

- which repo owns the family
- whether Wesley compiles it directly or through a module
- whether Echo emits values for it
- whether `warp-ttd` or `jedit` consume it directly or through projections

## Hill

Continuum publishes one small, brutally practical registry of shared contract
families that makes ownership and consumption obvious across the stack.

## Done looks like

- one registry note or table exists in Continuum
- the registry names at least the active family spine:
  - `IntentEnvelope`
  - `TickResult`
  - `ObserverPlan`
  - `ObservationRequest`
  - `ReadingEnvelope`
  - `SuffixShell`
  - `ImportOutcome`
- the registry distinguishes authored home from runtime emitter and downstream
  consumer
- the registry helps prevent shadow-contract ownership in app/tool repos

## Repo Evidence

- `docs/design/0028-minimum-runtime-boundary-contract-family/README.md`
- `schemas/continuum-runtime-boundary-family.graphql`
- `docs/invariants/CONTINUUM.md`
- `docs/OVERVIEW.md`


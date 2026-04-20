# App Glossary

This note freezes the app-to-WARP noun map across the active Continuum stack.

It is not a paper and it is not a full ontology. It is a coordination aid for
people touching `continuum`, `echo`, `jedit`, and Wesley-generated contract
surfaces.

## Rules

- App nouns are allowed.
- App nouns must map cleanly to a WARP noun or be marked as local shorthand.
- Do not collapse authored mutation, compiled intent, admission result, and
  later observer reading into one blob.
- Do not treat cached materializations as the substrate itself.
- If a stable wire name is legacy but already public, keep the wire name and
  fix the explanatory prose around it.

## Layer Map

| Layer | What it owns |
| --- | --- |
| App/authored | product nouns, GraphQL mutations, observer specs, UI-facing readings |
| Compiled | intent envelopes, observer plans, codecs, manifests, witnesses |
| Runtime/substrate | lanes, frontiers, admission, witnesses, holograms, observer instances |

## jedit Hot Text Surface

| Surface noun | Source | WARP term | Meaning |
| --- | --- | --- | --- |
| `BufferWorldline` | `jedit/contracts/jedit/hot-text-runtime.graphql` | canonical `worldline` | Buffer-scoped canonical lane for hot text truth. This is not the generic base noun `Lane`; it is the app publishing the canonical case. |
| `RopeHead` | same | frontier head / canonical head | The rope-specific materialization anchor at one admitted frontier. |
| `Tick` | same | admitted local step | One admitted local rewrite on the buffer worldline. |
| `TickReceipt` | same | witness / receipt | The witness-bearing result of local tick admission. |
| `Checkpoint` | same | retained checkpoint anchor | App-facing retained marker at a canonical frontier. It may lower to a substrate checkpoint, but it is not identical to every replay checkpoint concept in Echo. |
| `WorldlineSnapshot` | same | observer-relative reading | A bounded reading over the canonical buffer worldline, not the worldline-in-itself. |
| `createBufferWorldline` | same | bootstrap intent | App-authored set-side operation that establishes a canonical worldline for one buffer. |
| `replaceRangeAsTick` | same | rewrite intent / set-side optic operation | App-authored text rewrite intent that is admitted as a tick if lawful. |
| `createCheckpoint` | same | checkpoint-retention intent | App-authored intent to retain a checkpoint marker at the current canonical frontier. |
| `WorldlineSnapshotObserverSpec` | `jedit/src/app/jedit-observer-spec.ts` | observer spec `(π, B, M, K, E)` | The get-side authored observer declaration. In v1 it is memoryless and canonical-head-only. |
| `WorldlineSnapshotReadingEnvelope` | `jedit/src/app/jedit-observer-runtime.ts` | reading envelope | An emitted reading plus observer-plan identity and frontier reference. |
| `HotTextBufferState` | `jedit/src/ports/hot-text-runtime.ts` | local materialization state | In-process app/runtime state for one hot-text session. Treat this as a working materialization, not shared substrate truth. |
| `JeditWorldlineSession` | `jedit/src/app/jedit-contract-runtime.ts` | app-local session bundle | App-owned bundle that keeps one worldline publication together with local state and metadata. |

## Continuum Shared Publication Families

| Surface noun | Source | WARP term | Meaning |
| --- | --- | --- | --- |
| `laneId` | `continuum/schemas/*` | `Lane` identifier | Generic coordination noun that can cover worldlines, strands, or other lane kinds as publication surfaces widen. |
| `frameIndex` | `continuum/schemas/*` | frontier-relative coordinate | Published coordinate within a lane family. |
| `NeighborhoodCore` | `continuum/schemas/continuum-neighborhood-core-family.graphql` | neighborhood reading / bounded local site publication | Shared publication of a local admitted situation around an anchor lane and frame. It is not the whole braid witness. |
| `NeighborhoodParticipant` | same | participant claim / support within a local site | One participant in the published local-site geometry. |
| `SettlementDelta` | `continuum/schemas/continuum-settlement-family.graphql` | transported suffix comparison window | Published compare/transport slice used to reason about settlement between lanes. |
| `ImportCandidate` | same | admissible imported suffix claim | A candidate remote claim that can be imported lawfully. |
| `ConflictArtifact` | same | explicit conflict / obstruction object | The published artifact for non-trivial failure to import cleanly. |
| `SettlementDecision` | same | local judgement step | One ordered judgement inside a settlement plan. |
| `SettlementPlan` | same | plan shell over plural decisions | Observer/debugger-facing planning surface for compare/import/conflict work. |
| `SettlementResult` | same | witnessed settlement outcome | Published result of settlement. It is adjacent to reintegration detail, not identical to full canonical reintegration. |

## Cross-Repo WARP Terms To Keep Straight

| Term | Correct use | Common mistake |
| --- | --- | --- |
| `Lane` | Generic temporal carrier across canonical and speculative cases. | Using `worldline` as if it names every lane kind. |
| `Worldline` | Canonically admitted lane. | Teaching every speculative or plural object as a worldline. |
| `Strand` | Speculative lane with overlay/projection semantics. | Treating it as a frozen fork or as mere UI state. |
| `Braid` | Plural composition over lanes. | Treating it as “just a merge result waiting to happen.” |
| `Witness` / `Receipt` | Evidence for why admission or publication was lawful. | Treating it as optional metadata. |
| `Reading` | Observer-relative emitted result. | Treating it as the substrate itself. |
| `ObserverSpec` | Authored get-side declaration. | Treating a query DTO as the whole observer. |
| `ObserverInstance` | Hosted runtime observer with current state. | Collapsing it into the spec or the emitted reading. |

## Stable Wire Names That Are Not Ontology

These names are already public enough that we should keep them stable where
they exist, while reading them correctly:

| Wire noun | Read it as |
| --- | --- |
| `state_root` | materialization root hash |
| `snapshot` / `WarpSnapshot` | full replacement snapshot / materialized frontier snapshot |
| `worldlineId` | canonical-lane identifier in surfaces that only publish the canonical case |

Do not build new doctrine on these names alone. They are compatibility surfaces.

## Known Drift To Clean Up

- `echo/README.md` still teaches several older state-first phrases such as
  immutable snapshots, new state, and graph-centric wording. It should
  eventually be re-authored around witnessed causal history, lawful optics, and
  observer-relative readings.
- `jedit/README.md` still contains phrases like “worldline state” and “generic
  graph truth.” The contract/runtime split is correct, but the prose should be
  tightened to match it.
- Continuum intentionally still uses `"one graph"` in a few places as marked
  historical shorthand. When used, it should always be expanded to “one shared
  causal history with compatible observer-relative readings.”

## Banned Collapses

- mutation operation =/= compiled intent envelope
- intent envelope =/= admission result
- admission result =/= later observer reading
- observer spec =/= observer instance
- checkpoint marker =/= every substrate replay checkpoint
- neighborhood publication =/= full braid witness
- settlement result =/= full reintegration detail

If a new noun cannot survive those distinctions, it is probably sludge.

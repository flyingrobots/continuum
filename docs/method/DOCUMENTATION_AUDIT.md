# Continuum Documentation Audit

Audit date: 2026-06-24 · Audited at git `2d09038` · Auditor: automated claim extraction + source verification.

## How to read this

This audit extracts the **claims** each documentation file makes, then tries to
verify each claim **against source code only** (`schemas/`, `apps/warp/`,
`wesley/`, `scripts/`, `.github/`, lock/manifest JSON) — never against another
doc. Citations use `path#line@sha`.

It is the input to a consolidation pass: collapse ~80 doc files into a few
signposts plus the policy's reader-task shelves per `docs/DOCUMENTATION_POLICY.md`.

### Verdict legend (per claim)

| Verdict | Meaning |
| --- | --- |
| ✅ verified | A source artifact backs the claim. |
| 🟡 by-design-unverifiable | True-or-false can only be judged in a sibling repo or is pure doctrine; not checkable from this repo's code. The hub legitimately owns these, but they are *assertions*, not *evidence*. |
| ⬜ aspirational | The doc itself marks this as future/intended; no source yet, and none claimed. |
| ❌ contradicted | Source contradicts the claim, or the named artifact does not exist. |

### Confidence (per claim)

How sure the verdict is: **High** (direct artifact match or direct absence),
**Medium** (inference), **Low** (ambiguous wording).

### Accuracy score (per doc)

Share of the doc's current-tense, this-repo claims that are ✅ or honestly
⬜-labelled, weighted by how load-bearing the doc is. Doctrine docs are scored
on *internal consistency with source* where they touch it, not on unverifiable
cross-repo assertions.

---

## Ground truth (what the source actually provides)

Everything below is checked against these facts.

- **Authored contract families: exactly 4**, under `schemas/`:
  - receipt family — `Receipt`, `DeliveryObservation`, `Capability`, `Witness`; registry ids 100–103 (`schemas/continuum-receipt-family.graphql#43-103@2d09038`).
  - settlement family — `SettlementRequest`…`SettlementResult`; ids 120–126; one `Mutation settleLane` (`schemas/continuum-settlement-family.graphql#27-154@2d09038`).
  - neighborhood-core family — `NeighborhoodCore`, `NeighborhoodParticipant`, `AdmissionOutcomeKind`; ids 127–128 (`schemas/continuum-neighborhood-core-family.graphql#34-66@2d09038`).
  - runtime-boundary family — `IntentEnvelope`, `TickResult`, `ObserverPlan`, `ObservationRequest`, `ReadingEnvelope`, `ContinuumEvidenceStatus` union, `WitnessedSuffixShell`, `CausalSuffixBundle`, `ImportOutcome`, … ; ids 129–145 (`schemas/continuum-runtime-boundary-family.graphql#92-330@2d09038`).
- **Shared admission outcome vocabulary** `DERIVED | PLURAL | CONFLICT | OBSTRUCTION` exists (`schemas/continuum-neighborhood-core-family.graphql#16-21@2d09038`, `schemas/continuum-runtime-boundary-family.graphql#27-32@2d09038`).
- **`translated_evidence_cannot_claim_native_witness`** is an authored invariant (`schemas/continuum-runtime-boundary-family.graphql#377-381@2d09038`).
- **CLI binary is `qw`** (`apps/warp/package.json#6-8@2d09038`). Top-level commands are exactly `init`, `install`, `warpspace` (`apps/warp/src/cli.mjs#22-36@2d09038`). `warpspace` subcommands: `lock`, `verify`, `sync`, `doctor`, `locate` (`apps/warp/src/cli.mjs#169-328@2d09038`; `apps/warp/src/warpspace.mjs#9,74,131,225,309@2d09038`).
- **There is no `qw build`, no top-level `qw doctor`, no `qw update`.** Unknown commands fall through to error (`apps/warp/src/cli.mjs#330-332@2d09038`).
- **Wesley Continuum module registers 5 commands**: `contract`, `drift-watch`, `observer-plan`, `witness`, `witness-continuum` (`wesley/continuum-cli-module.mjs#51-57@2d09038`); compile targets `warp-ttd`/`ttd` and `echo` (`wesley/continuum-cli-module.mjs#22-46@2d09038`).
- **The docs gate** checks (1) internal links resolve, (2) catalog integrity, (3) registry↔schema coverage — and explicitly nothing about content accuracy (`scripts/docs-lint.mjs#1-6,168-184@2d09038`). It passes clean today (0/0).
- **CI** runs the docs gate and `node --test apps/warp/test/**` on Node 22 & 24 (`.github/workflows/ci.yml#16-40@2d09038`). **Wesley's tests are not in CI.**
- **pre-commit** runs the docs gate (`.githooks/pre-commit#1-5@2d09038`).
- **The profile vocabulary** (`continuum.participant.hello.v1`, `continuum.observation.v1`, `continuum.history.exchange.v1`, …) and the **capability tiers T0–T6** appear **nowhere** in `schemas/`, `apps/`, or `wesley/` (grep, zero hits). They are doctrine only.
- **`docs/reference/` and `docs/explanation/` do not exist.** Only `docs/how-to/` and `docs/invariants/` of the policy's reader-task tree exist. **`docs/reference/release-targets.md` does not exist**, and there is **no packet 0038** (packets stop at 0037).
- **All 37 design packets carry `status: proposed`** in frontmatter, including the ones whose content is already implemented (schemas authored, `qw` built).

---

## Tier 1 — Load-bearing docs (full claim audit)

### `README.md` — accuracy ≈ 90% — **KEEP** (signpost)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Continuum is a shared protocol/coordination layer, not a runtime/db/storage/CRDT/daemon | 🟡 doctrine | High | Consistent with repo having only schemas+tooling, no runtime. |
| Intent → Admission → Witness → Reading model | 🟡 doctrine | High | Nouns exist in runtime-boundary family (`…#92-165@2d09038`); the narrative is doctrine. |
| Run-first: `node apps/warp/bin/warp.mjs init my-app --profile demo` | ✅ | High | `apps/warp/bin/warp.mjs` exists; `init`+`--profile` parsed (`apps/warp/src/cli.mjs#22,399@2d09038`). |
| `node --test apps/warp/test/*.test.mjs` | ✅ | High | Two test files exist; CI uses the same runner (`.github/workflows/ci.yml#40@2d09038`). |
| Echo/`git-warp` own runtime; Wesley compiles; TTD debugs; DRIVE mounts; Graft observes | 🟡 | High | Cross-repo role doctrine; not checkable here. |

Fit: clean reader-goal signpost. No corrections needed.

### `README_FULL.md` — accuracy ≈ 55% — **MERGE → trim to an explanation topic**

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Model-shift narrative, "graph is a coordinate chart" | 🟡 doctrine | High | Doctrine; internally consistent. |
| Nouns `IntentEnvelope`/`ObserverPlan`/`ObservationRequest`/`ReadingEnvelope`/`TickResult` | ✅ | High | All present (`schemas/continuum-runtime-boundary-family.graphql#92-165@2d09038`). |
| **Capability tiers T0–T6** as a Continuum facility | ❌ aspirational-unlabelled | High | No source anywhere; presented as current structure, not future. |
| **Profile vocabulary** `continuum.*.v1` (10 profiles listed) | ❌ aspirational-unlabelled | High | No source anywhere; reads as existing contracts. |
| WARP DRIVE read/write→ObservationRequest/IntentEnvelope mapping table | 🟡 | Medium | Cross-repo/future; the two nouns exist, the mapping is doctrine. |
| "teach `warp doctor` to report profile and evidence status" | ❌ | High | No `warp doctor`/`qw doctor` command (`apps/warp/src/cli.mjs#330-332@2d09038`). |
| Per-project status table (Echo T2/T3, etc.) | 🟡 | Medium | Cross-repo targets; not checkable here. |

Fit: large, mixes explanation + an *unbuilt* tier/profile spec. The durable half
(model shift, glossary, what-it-is-not) belongs in one explanation topic; the
tier/profile catalogue should be relabelled **proposed** and moved to a single
"protocol profiles (proposed)" reference, or dropped until authored.

### `docs/OVERVIEW.md` — accuracy ≈ 80% (as theory synthesis) — **MERGE → `docs/explanation/` hub**

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Synthesizes packets 0001–0018 + 0022 | 🟡 | Medium | Packets exist; "synthesis" is editorial. Note: policy §18 wants OVERVIEW's "synthesis of packets" framing *retired*. |
| Lane/Worldline/Strand/Braid ontology | 🟡 doctrine | High | No code; doctrine. `laneId` appears as a field only. |
| Settlement noun list (request/delta/plan/decision/import candidate/conflict/result) | ✅ | High | Exact match (`schemas/continuum-settlement-family.graphql#27-130@2d09038`). |
| Neighborhood core freezes `AdmissionOutcomeKind` + singleton/plural | ✅ | High | `…#16-26,47-60@2d09038`. |
| Witness ladder `W₂`, `R_core=(J,K,V)` math | 🟡 doctrine | Medium | Pure theory; no code. |
| Current proof target (Wesley→Rust/TS, Echo consumes, TTD inspects) | ⬜ | Medium | Stated as target; cross-repo. |

Fit: the best single conceptual explanation. Keep the content, drop the
"packet 0001–0018 synthesis" scaffolding framing (policy §7/§18), make it the
ontology explanation shelf.

### `docs/invariants/CONTINUUM.md` — accuracy ≈ 95% — **KEEP** (invariant page)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Inv. 12 — lawful outcomes `Derived/Plural/Conflict/Obstruction` preserved | ✅ | High | `schemas/continuum-neighborhood-core-family.graphql#16-21@2d09038`. |
| Inv. 8 — cross-runtime exchange must name source/target/coordinate/digest/outcome/residue | ✅ | High | Mirrored by `CausalSuffixBundle`/`WitnessedSuffixAdmissionOutcome` (`schemas/continuum-runtime-boundary-family.graphql#273-302@2d09038`). |
| Inv. 6 — reintegration core / witness core / receipt shell distinct | 🟡 doctrine | Medium | Theory layering; partial schema echo in receipt family. |
| Inv. 1–5, 7, 9–11, 13–15 — coordination law | 🟡 doctrine | High | Normative cross-repo rules; correctly scoped, not source-checkable here. |

Fit: this is exactly what the policy's `invariant` page type is for. Keep as-is.

### `docs/contract-family-registry.md` — accuracy ≈ 97% — **KEEP** (reference, the hub's spine)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| 4 family rows with authored homes under `schemas/` | ✅ | High | All 4 files exist; gate enforces coverage (`scripts/docs-lint.mjs#168-184@2d09038`). |
| receipt/settlement shared-noun lists | ✅ | High | Match schemas exactly. |
| neighborhood-core nouns incl. `AdmissionOutcomeKind` | ✅ | High | `…#16-60@2d09038`. |
| runtime-boundary noun list | ✅ | High | Match (`schemas/continuum-runtime-boundary-family.graphql#92-330@2d09038`). |
| Status ladder `authored→profiled→fixture-witnessed→runtime-open→interop-open` | ✅ | High | Same ladder in policy §11; statuses are conservative. |
| receipt/settlement = `fixture-witnessed`, evidence in `wesley/test/*.bats` + fixtures | 🟡 | Medium | Bats files + fixtures exist (`wesley/test/`), but **not run in CI** — the witness is real but ungated. Flag. |
| neighborhood-core / runtime-boundary = `authored` only | ✅ | High | No Wesley profile wired for them; honest gap. |

Fit: canonical, honest, gate-backed. The one improvement: note that the bats
witnesses backing `fixture-witnessed` are not CI-enforced.

### `docs/GETTING_STARTED.md` — accuracy ≈ 78% — **MERGE → warp-cli how-to/tutorial**

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| `qw` is the user-facing CLI; Wesley compiles behind it | ✅ | High | `apps/warp/package.json#6-8@2d09038`; `apps/warp/README.md#13-16@2d09038`. |
| `qw init my-app --profile demo` flow (writes toml+lock, materializes family, invokes Wesley) | ✅ | High | `apps/warp/src/cli.mjs#56-92@2d09038`; init result fields. |
| **Step "Run `qw build` or `qw doctor`"** | ❌ | High | Neither exists (`apps/warp/src/cli.mjs#330-332@2d09038`); `apps/warp/VISION.md#117-121@2d09038` itself says `qw build`/`qw doctor` are unimplemented. |
| `qw install` reads toml, refreshes lock, syncs repos, writes devcontainer, verifies | ✅ | High | `apps/warp/src/warpspace.mjs#74-…@2d09038`; `apps/warp/src/cli.mjs#101-160@2d09038`. |
| "What exists today" honesty section | ✅ | High | Matches `apps/warp/VISION.md`. |

Fix on merge: delete the `qw build`/`qw doctor` step (contradicts the code and
the warp VISION). Otherwise a strong warp-cli quickstart.

### `docs/index.md` — accuracy ≈ 92% — **KEEP** (router; update links after consolidation)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Routes to overview/registry/how-to/invariants/schemas | ✅ | High | All targets exist; gate confirms links resolve. |
| Routes "conform a repo" to ownership map = packet 0014 | 🟡 | High | Points into the *frozen* design log for current truth — the §7 anti-pattern. Should point to a lifted reference. |
| "Understand the theory… full record lives in design packets… append-only" | ❌ wording | Medium | Calls packets "append-only decision records"; policy §7 calls `docs/design/` a **frozen archive**, not append-only. Stale framing. |

### `schemas/README.md` — accuracy ≈ 98% — **KEEP** (reference)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| 4 authored families, named | ✅ | High | Exact match to directory. |
| runtime-boundary codifies import-boundary + native-vs-translated evidence | ✅ | High | `schemas/continuum-runtime-boundary-family.graphql#246-271,377-406@2d09038`. |
| Wesley compiles to Rust/TS/manifests/codecs | 🟡 | Medium | Compile targets exist (`wesley/continuum-cli-module.mjs#22-46@2d09038`); the multi-language breadth is cross-repo. |

### `apps/warp/README.md` — accuracy ≈ 97% — **KEEP** (reference, the `qw` surface)

| Claim | Verdict | Conf. | Evidence |
| --- | --- | --- | --- |
| Binary is `qw`; current commands `init`, `install`, `warpspace lock/verify/sync/doctor/locate` | ✅ | High | `apps/warp/src/cli.mjs#22-36,169-328@2d09038`; `apps/warp/package.json#6-8@2d09038`. |
| default profile `demo`; writes `warpspace.toml`/`warpspace.lock.json`; stages node+wesley under `.warpspace/` | ✅ | High | Matches init/usage (`apps/warp/src/cli.mjs#74-92,559-573@2d09038`). |
| `locate` emits typed `warp://` locator | ✅ | High | `apps/warp/src/cli.mjs#297-328@2d09038`; `apps/warp/src/locator.mjs`. |
| Repo-local invocation `node apps/warp/bin/warp.mjs --help` | ✅ | High | bin exists. |

Best-calibrated doc in the repo; honest about prototype vs product.

### `apps/warp/VISION.md` — accuracy ≈ 96% — **KEEP** (signpost/explanation for warp-cli)

Notable for explicitly labelling `qw build`/`qw doctor`/`qw update` as **not yet
implemented** (`apps/warp/VISION.md#117-121@2d09038`) — which is what makes the
GETTING_STARTED step wrong. Aspirational items are honestly flagged. Keep.

---

## Tier 2 — Other root + signpost docs

### `AGENTS.md` — accuracy ≈ 80% — **KEEP** (trim)

- ✅ Git-safety + "run docs gate before committing" (`.githooks/pre-commit@2d09038`).
- ❌ "Durable truth lives in `docs/reference/`, `docs/how-to/`, `docs/explanation/`" — **two of three dirs do not exist** (only `how-to/`). Fix to match reality or create the dirs.
- ✅ "`docs/design/` is a frozen log; record new decisions as ADR-lite/CHANGELOG line" — matches policy §7.

### `CONTRIBUTING.md` — accuracy ≈ 85% — **KEEP** (trim)

- ✅ Check commands match CI (`.github/workflows/ci.yml#25,40@2d09038`); pre-commit hook claim true.
- ❌ Same nonexistent `docs/reference/`/`docs/explanation/` reference as AGENTS.md.
- ✅ Evidence-discipline + git rules consistent with policy.

### `METHOD.md` — accuracy ≈ 60% — **MERGE/REWRITE** (method shelf)

- ❌ "design cycles: `docs/design/<NNNN-slug>/`" and "Prefer one good design packet" — **directly superseded** by policy §7 ("supersedes any METHOD.md guidance that mandates a design cycle"). This is the exact stale guidance the CHANGELOG flagged for follow-up (`CHANGELOG.md#12-13@2d09038`).
- 🟡 Backlog-lane structure matches `docs/method/backlog/` dirs.

### `docs/VISION.md` — accuracy ≈ 90% — **KEEP** (signpost)

Ownership split + "Continuum runtime" definition; all 🟡 doctrine, internally
consistent, points to invariants. No source contradictions.

### `docs/BEARING.md` — accuracy ≈ 85% — **KEEP** (signpost)

Direction-setting; "current hill" language. Doctrine, no source claims. Slightly
stale ("establishing METHOD lanes… deciding the first artifacts") given those
now exist, but acceptable for a bearing.

### `APP_GLOSSARY.md` — accuracy ≈ 88% — **MERGE → ontology reference (glossary)**

- ✅ "Continuum Shared Publication Families" table maps `NeighborhoodCore`, `SettlementDelta`, `ImportCandidate`, `ConflictArtifact`, `SettlementDecision`, `SettlementPlan`, `SettlementResult`, `laneId`, `frameIndex` to real schema symbols.
- 🟡 The `jedit` hot-text table cites `jedit/...` files in a sibling repo — coordination aid, but skirts the §2.1 hub invariant (don't host sibling runtime truth). Keep the WARP-term column; link out for the jedit-local column rather than reproducing it.
- The glossary is the policy's required `ontology` reference. Lift it into `docs/reference/glossary.md` and make it the canonical glossary.

### `GoodIdeas.md` — accuracy ≈ 40% (as current truth) — **TRASHED** (deleted; live ideas → issues #39–42)

Salvage notes referencing an *old* Continuum repo's files (`docs/DOCS-GOVERNANCE.md`,
`docs/ARCH/ARCH-0002…`, `crates/jitos-core/…`) that **do not exist here**. Its
"First Integration Targets" (invariant index, compatibility matrix, glossary) are
**already done** (`docs/invariants/CONTINUUM.md`, `docs/contract-family-registry.md`,
`APP_GLOSSARY.md`). No current-repo claims to verify. Pure historical scaffolding;
its job is finished. **Deleted** in this pass; the four still-live runtime ideas
were captured as `cool ideas` issues #39–42 first (history preserves the file).

### `CHANGELOG.md` — accuracy ≈ 98% — **KEEP**

Spot-checked against code: `qw warpspace lock/verify/sync/doctor` (#46), `locate`
(#48), devcontainer projection rules (#51-55), 40-hex revision validation (#71-74)
all match `apps/warp/src/*`. Accurate decision record. (Self-notes that METHOD.md
needs a follow-up edit — see above.)

### `docs/DOCUMENTATION_POLICY.md` — accuracy ≈ 90% — **KEEP** (the standard)

One concrete defect: §18 step 2 claims **"Done: the release-targets reference
(`docs/reference/release-targets.md`, lifted from former packet 0038)"** — the
file and `docs/reference/` **do not exist**, and there is no packet 0038. This is
a false "done" inside the standard that governs the audit. Fix the claim
(it's an aspirational/abandoned step mislabelled done).

---

## Tier 3 — Archive & process classes (class-level verdicts)

### The 37 design packets (`docs/design/0001…0037/README.md`) + `backlog-origin.md` siblings — **KEEP AS FROZEN ARCHIVE** (do not expand, do not route current truth through)

- Policy §7 already designates `docs/design/` a frozen historical log. The audit confirms the *content* is largely superseded by the live reference/invariant/registry pages.
- **Class defects:**
  1. **Every packet is `status: proposed`** despite implementation (e.g. 0024/0033 → `qw` shipped, 0022/0027/0028 → schemas authored). The status field is misleading; either bulk-relabel to `archived`/`superseded` or stop carrying a status that implies live review.
  2. **`docs/design/README.md` is `status: active`** and describes design cycles as a live process ("Design cycles live here… Each packet should define…") — contradicts the frozen-archive policy and METHOD supersession. Rewrite as an archive index.
  3. The catalog and `docs/index.md` route *current* tasks (ownership map, convergence, registry design) into packets 0014/0029/0030/0035/0036/0037 — the §7 anti-pattern. These six carry durable truth that should be **lifted** into reader-task pages (`ownership-map`, `convergence` reference), after which the packets become pure history.
- **Decision:** keep all 37 as archive; lift the 6 catalog-promoted ones; relabel statuses; demote `design/README.md` to an archive index.

### `docs/method/backlog/**` (asap, up-next, cool-ideas, bad-code, inbox; SOURCE_/PROCESS_/EVIDENCE_ notes + READMEs) — **KEEP** as method backlog (not reader-task docs)

These are internal METHOD work items, not documentation of the product. They are
out of scope for reader-task accuracy. Two contain process truth worth promoting:
`PROCESS_docs-lint-and-generated-artifact-governance.md` and
`PROCESS_pr-readiness-and-review-workflow.md` overlap with what is now in the
policy + CONTRIBUTING; reconcile or close them. Leave the rest as backlog.

### `docs/method/process.md`, `release.md`, `release-runbook.md`, `legends/PROCESS.md`, `retro/**`, `releases/**`, `warpspaces/**` — mostly **KEEP**, one stale line

- `docs/method/process.md` repeats "capture design work in `docs/design/`" — same superseded design-cycle framing as METHOD.md; trim.
- `docs/releases/demo/*` + `continuum-stack-release.json`: ✅ the frozen tuple (Echo `warp-core` 0.1.1, `git-warp` 17.0.0, Wesley 0.1.0, neighborhood-core 0.1.0) and the family `sha256 7984dbc0…` match the manifest and the cached IR artifact name; honest "local-sibling-proof" posture. Keep.
- `docs/warpspaces/README.md`: ✅ describes `qw warpspace locate`/TACHYON accurately (`apps/warp/src/cli.mjs#297-328@2d09038`). Keep.
- `wesley/README.md`: ✅ lists the 5 module commands matching `wesley/continuum-cli-module.mjs#51-57@2d09038`; honest about the sibling-Wesley bridge and that some bats cases skip. Had one ❌ now fixed: it called the unit tests hermetic, but they require `@wesley/core` (`wesley/support/wesley-deps.mjs#117@2d09038`). Keep.

---

## Cross-cutting findings (fix regardless of consolidation)

1. **Phantom reader-task dirs.** `docs/reference/` and `docs/explanation/` are referenced by the policy (§4, §18), AGENTS.md, and CONTRIBUTING.md but **do not exist**. Either create them (consolidation will) or stop citing them. The policy's §18 "Done: `docs/reference/release-targets.md`" is a false claim.
2. **`qw build` / `qw doctor` don't exist** but GETTING_STARTED tells users to run them; the warp VISION correctly lists them as unbuilt. Single source of CLI truth needed.
3. **Unbuilt protocol surface presented as real.** Capability tiers T0–T6 and the `continuum.*.v1` profile catalogue in README_FULL have zero source backing and aren't labelled proposed. Relabel or quarantine in one "proposed protocol profiles" page.
4. **Stale packet machinery.** All packets `proposed`; `design/README.md` `active`; METHOD.md + `method/process.md` still mandate design cycles — all contradict policy §7. Relabel/demote.
5. **`fixture-witnessed` evidence isn't CI-gated, and can't be cheaply.** The bats/fixtures backing receipt+settlement status live in `wesley/test/` but CI only runs `apps/warp/test` (`.github/workflows/ci.yml#40@2d09038`). The wesley README *claimed* `node --test wesley/test/*.test.mjs` is hermetic — **false**: those tests require `@wesley/core` and fail to load without a sibling Wesley checkout (`wesley/support/wesley-deps.mjs#117@2d09038`). So gating them in CI requires vendoring/installing Wesley first. The README claim has been corrected (see fixes below); the CI gap remains a real, documented constraint.

---

## Proposed consolidation (signposts + the policy's reader-task shelves)

Target shape per `docs/DOCUMENTATION_POLICY.md` §3–§8, using the **policy's own
named directories** (`docs/reference/`, `docs/how-to/`, `docs/explanation/`,
`docs/invariants/`) — capability is catalog metadata, not a directory. (An
earlier draft called these "`docs/topics/`"; that was shorthand, not a real
plan — no `docs/topics/` tree will be created.) Honest, source-backed claims
cluster into these pages; everything else becomes signpost, archive, or
deletion.

### Signposts (short, route outward — keep at current homes)
- `README.md` (repo front door) · `docs/index.md` (reader-goal router) · `docs/BEARING.md` · `docs/VISION.md` · `apps/warp/VISION.md`.

### Reader-task shelves (lift durable truth here)
| Target page | Page type | Capability | Sourced from | Primary evidence |
| --- | --- | --- | --- | --- |
| `docs/explanation/causal-history-model.md` | explanation | ontology | `OVERVIEW.md` (de-scaffolded) | schemas (admission/settlement/neighborhood nouns) |
| `docs/reference/glossary.md` | reference | ontology | `APP_GLOSSARY.md` shared-families table | `schemas/*.graphql` |
| `docs/contract-family-registry.md` (stays) | reference | contract-families | current | `schemas/*.graphql`, gate coverage |
| `docs/how-to/publish-runtime-evidence-for-a-contract-family.md` (stays) | conformance-guide | contract-families | current | gate coverage |
| `docs/reference/ownership-map.md` | ownership-map | ownership-law | **lift packet 0014** | registry rows |
| `docs/reference/convergence.md` (+ gate-records) | reference + gate-record | convergence | **lift packets 0035/0036/0037/0030**, `docs/releases/demo/*` | `continuum-stack-release.json` |
| `docs/how-to/get-started-with-qw.md` + `docs/reference/qw-cli.md` | tutorial/how-to + reference | warp-cli | `GETTING_STARTED.md` (no `qw build`/`doctor`) + `apps/warp/README.md` | `apps/warp/src/*` |
| `docs/invariants/CONTINUUM.md` (stays) | invariant | ontology | current | schemas (inv. 8, 12) |
| `METHOD.md` (rewritten, §7-aligned) | contributor | method | current | n/a |
| `docs/explanation/protocol-profiles.md` *(status: proposed)* | reference | — | tiers T0–T6 + `continuum.*.v1` profiles extracted from `README_FULL.md` | **none yet — label proposed** |

### Keep as archive (frozen, not load-bearing)
- All `docs/design/00NN/**` (relabel status; demote `design/README.md` to index).
- `docs/method/backlog/**`, `docs/method/retro/**`, `docs/method/legends/**`.

### Trash (working tree; history retains)
- `GoodIdeas.md` — **done**: deleted; the ~4 still-live runtime ideas captured as `cool ideas` issues #39–42, the rest already realized in current docs.
- `README_FULL.md` *as a single page* — split: durable model prose → `docs/explanation/`; tier/profile catalogue → `docs/explanation/protocol-profiles.md` (status: proposed) or drop.

### Net effect
~80 files → **5 signposts + the policy's reader-task shelves + 1 frozen archive tree**, with the
~50 packet/backlog files demoted out of the reader path. Every retained
reader-task page above has at least one ✅ source citation; every unverifiable
page is either an honest signpost, a clearly-scoped invariant/doctrine page, or
a `proposed`-labelled future surface.

---

## Fixes applied in this pass (content corrections only)

These were the unambiguous, source-backed corrections, plus the confirmed
deletion of `GoodIdeas.md` (its live ideas captured as issues #39–42). The rest
of the structural consolidation (creating the reader-task shelves, lifting
packets, splitting `README_FULL.md`) is held for a separate confirmed pass.

- `docs/GETTING_STARTED.md`: removed the "Run `qw build` or `qw doctor`" step (neither command exists); replaced with inspecting generated workspace + a pointer that those commands are planned.
- `docs/DOCUMENTATION_POLICY.md` §18: removed the false "Done: `docs/reference/release-targets.md` … packet 0038" claim (file, dir, and packet do not exist).
- `AGENTS.md` and `CONTRIBUTING.md`: corrected the "durable truth lives in `docs/reference/`/`docs/explanation/`" claim to name the dirs that actually exist.
- `docs/index.md`: replaced "append-only decision records" with "frozen historical decision log" (policy §7).
- `METHOD.md` and `docs/method/process.md`: replaced the design-cycle mandate with the ADR-lite/CHANGELOG rule (policy §7 supersession; closes the follow-up the CHANGELOG flagged).
- `docs/design/README.md`: rewritten from `status: active` "design cycles live here" into a frozen-archive index; `status: archived`.
- All 41 design files (37 packets + 4 backlog-origin): frontmatter `status: proposed` → `status: archived`.
- `wesley/README.md`: corrected the false "hermetic unit checks" claim (they require `@wesley/core`).

- `GoodIdeas.md`: **done** — deleted; live runtime ideas captured as `cool ideas` issues #39–42 (the rest were already realized in current docs).

### Still open (structural, needs confirmation)
- Create the policy's reader-task shelves (`docs/reference/`, `docs/explanation/`) and lift packets 0014/0029/0030/0035/0036/0037 into reference/ownership-map/convergence pages; then update `docs/index.md` and `docs/catalog.yaml` routing (today they still route current tasks into the frozen log — §7 anti-pattern).
- Split `README_FULL.md`: durable model prose → `docs/explanation/`; tiers T0–T6 + `continuum.*.v1` profiles → a single `docs/explanation/protocol-profiles.md` **labelled proposed** (or drop until authored).
- Decide whether to vendor/install `@wesley/core` in CI so the receipt/settlement `fixture-witnessed` evidence is gated.

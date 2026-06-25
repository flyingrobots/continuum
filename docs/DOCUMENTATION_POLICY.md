---
title: Continuum Documentation Standard
status: active
---

# Continuum Documentation Standard

This is the authoritative, self-contained standard for documentation in the
Continuum repository. It governs what we write, where it lives, who it serves,
and how it is checked. **MUST**, **SHOULD**, and **MAY** carry their usual
requirement strengths.

It is derived from a reusable reader-task documentation standard, but it does not
depend on that external document — everything normative is stated here.

## 1. Purpose

Documentation is a product interface. Its job is to help a particular reader
succeed at a particular task, not to prove the repo contains enough Markdown. A
healthy system helps readers do five things:

1. **Learn** the model through a guided, successful experience.
2. **Accomplish** a real task.
3. **Look up** exact facts while working.
4. **Understand** concepts, mechanisms, and design choices.
5. **Change** the implementation safely and verify the result.

These are different jobs. A page MUST have one primary job; no single page may be
forced to do all five. Template compliance is not evidence of quality.

## 2. What kind of system this is

Continuum is a **coordination hub**: a shared vocabulary, an ownership law, a set
of authored contract families, an evidence/compatibility registry, and a
cross-repository release bar. It is not a product with an end-user UI funnel.

So this repo optimizes for two readers a product-centred standard under-weights:

1. **Sibling-repo maintainers** who must conform — Echo, `git-warp`, Wesley,
   `warp-ttd`, Graft, Edict, `jedit`, WARP DRIVE, xyph. They need to know what
   their repo owes, where the authored home is, and what evidence closes a gap.
2. **Coordination and review agents** that must retrieve the smallest relevant
   authoritative page by intent, without loading the whole corpus.

### 2.1 The hub invariant

Continuum documents the **boundary** and links outward for everything below it.
"Lead with real use" MUST NOT become a license to pull sibling-repo runtime
truth into Continuum. The following are documentation failures here even when
every file passes formatting checks:

- copying a sibling repo's runtime behavior, schema body, or release contract
  into a Continuum page instead of linking to its authored home;
- copying GitHub issue, pull-request, or project state into prose instead of
  linking to the live system;
- documenting a compatibility claim more strongly than its recorded evidence
  supports (see §11);
- minting a second home for a shared noun that already has an authored home.

## 3. Core principles

- **Organize around reader intent.** The primary navigation reflects what a
  reader is trying to do (start, accomplish, look up, understand, troubleshoot,
  change), not the source-module layout.
- **Separate page types.** Tutorials, how-tos, reference, explanation, and
  contributor guides have different obligations; combining them yields a long
  page that is mediocre at every job. A page MUST embody one primary type.
- **Show the contract in use.** For Continuum the equivalent of "real commands
  and output" is a schema fragment, a conforming value, and the witness/evidence
  that closes the gap. A source-file index is not an explanation.
- **Generate what machines already know.** Inventories, schema fields,
  compatibility tables, and ownership indexes SHOULD be generated or validated
  from their authoritative source. Human prose concentrates on intent, mental
  models, workflows, important examples, failure interpretation, tradeoffs, and
  safe-change boundaries.
- **Agent-readable must not mean human-hostile.** Structured metadata and stable
  IDs (§10) coexist with useful human prose; they never replace it.
- **Evidence discipline.** A claim is only as strong as its recorded evidence; a
  gap is recorded as a gap; planned work is never evidence (§11).

## 4. Documentation architecture

Organize by capability and reader need, not one-folder-per-source-topic. The
layout:

```text
docs/
  index.md                 # reader-goal router
  catalog.yaml             # machine-readable index
  DOCUMENTATION_POLICY.md  # this standard
  reference/               # exact facts: families, profiles, tiers, vocabulary
  how-to/                  # goal-oriented + conformance guides
  explanation/             # the model and why
  invariants/              # normative rules
  contract-family-registry.md
  schemas/ (repo root)     # authored contract families (the reference source)
  design/                  # FROZEN historical decision log (see §7)
```

The directory layout is not normative; the separation of reader needs is.

## 5. Capability taxonomy

Coverage is selected per capability (§8), not imposed per page. Continuum's
capabilities:

| Capability | What it is | Primary readers |
| --- | --- | --- |
| `ontology` | Shared vocabulary and the causal-history model. | All; sibling maintainers; agents |
| `contract-families` | Authored shared schemas and the evidence registry. | Sibling maintainers; Wesley; agents |
| `ownership-law` | Who owns each shared noun's semantics/home/runtime/surface. | Sibling maintainers; agents |
| `convergence` | The cross-repo release bar, gates, and compatibility set. | Stack maintainers; release agents |
| `warp-cli` | The `warp` CLI and warpspace bootstrap. | App authors; operators |
| `method` | How work runs here. | Contributors; agents |

## 6. Page types

Reader-task types and their core obligations:

- **Tutorial** — a guided first success on a known-good path; ends with what was
  learned. Not a topic dump.
- **How-to** — titled as a goal beginning with a verb; states the result,
  prerequisites, the shortest safe route, and how to verify. Links to reference
  rather than reproducing it.
- **Reference** — exact, complete, predictable facts (names, fields, statuses,
  errors). Generated or coverage-checked where the surface is machine-readable.
- **Explanation** — forms an accurate mental model; states the question it
  resolves; distinguishes contract from implementation. Not a code tour.
- **Troubleshooting** — starts from an observable symptom, lists the fastest
  discriminating checks, maps signals to causes, gives recovery + verification.
- **Contributor** — helps a maintainer change the implementation safely:
  boundaries, invariants, edit paths, verification.

Hub-native types:

| Type | Purpose | Notes |
| --- | --- | --- |
| `family-reference` | Reference for one authored contract family. | Backed by a file under `schemas/`; carries the §9 cross-repo fields. |
| `conformance-guide` | A how-to whose result is "my repo now conforms" / "this gap is closed with evidence." | The hub's most important task type. |
| `ownership-map` | A table assigning the ownership axes of shared nouns. | Generated-or-validated where practical (§9). |
| `gate-record` | Contract, owner, executable check, and evidence for one convergence gate. | Links to live GitHub; never copies issue state. |
| `signpost` | Direction-setting orientation (`BEARING.md`, `VISION.md`). | Short; routes outward. |
| `invariant` | A normative rule the stack must not violate. | Under `docs/invariants/`. |
| `decision-record` | A short ADR-lite record, or a `CHANGELOG.md` line, for one decision. | Replaces numbered packets for new decisions (§7). |
| `design-packet` | Legacy chronological decision log under `docs/design/NNNN-slug/`. | Frozen archive; not for new docs (§7). |

A `conformance-guide` MUST be titled as a goal beginning with a verb, MUST state
the exact evidence that proves success, and MUST link to the authored home and
the relevant registry entry rather than reproducing them.

## 7. The documentation system is reader-task pages, not the packet log

Continuum's `docs/design/NNNN-slug/` packets are a **historical decision log**,
not the documentation system. They are not where a reader should Learn, Look up,
or Understand the system — that is the job of the reader-task pages. When a packet
becomes the primary way to understand Continuum, a reader has to chew dozens of
chronological documents to reconstruct current truth, which is an anti-pattern.

Rules:

- **Durable truth lives in reader-task pages**, organized by reader need, not by
  packet number. When a packet's conclusion becomes current truth, consolidate it
  into the relevant reader-task page; the packet stays as the record of the
  decision.
- **New decisions use a decision record, not a packet.** A decision record is at
  most one screen — Context, Decision, Consequences — and many decisions need
  only a `CHANGELOG.md` line plus the commit. Do not open a numbered design cycle
  for an ordinary decision.
- **`docs/design/` is frozen as an archive.** Do not synthesize it into
  reader-task pages, and do not require a reader to visit it to understand the
  product. A superseded packet is not deleted (it is real history); it is simply
  no longer load-bearing.

This standard supersedes any METHOD.md guidance that mandates a design cycle per
change for documentation purposes.

## 8. Coverage matrix

Coverage is selected per capability, and `not needed` is a valid, reasoned answer
— it is the governor that stops sprawl. Add a page type only when a real reader
job demands it; a blank cell is never a placeholder page.

| Capability | Tutorial | How-to | Reference | Explanation | Troubleshooting | Contributor |
| --- | :--: | :--: | :--: | :--: | :--: | :--: |
| `ontology` | not needed | not needed | required (glossary) | required | not needed | required |
| `contract-families` | not needed | required | required | optional | optional | required |
| `ownership-law` | not needed | not needed | required | required | not needed | required |
| `convergence` | not needed | required | required | optional | not needed | required |
| `warp-cli` | required (quickstart) | required | required | optional | recommended | optional |
| `method` | not needed | not needed | optional | required | not needed | required |

## 9. Generate, validate, do not curate by hand

Three surfaces are the most drift-prone because they are hand-maintained
cross-repo tables: the contract family registry
(`docs/contract-family-registry.md`), the shared noun ownership map, and the
convergence release bar. For these, prefer generation or validation from the
authoritative source:

- Every registry row's authored home MUST reference a file that exists under
  `schemas/`; every `schemas/*.graphql` family MUST have a registry row. This is
  coverage and is mechanically checked (§14).
- Compatibility claims MUST follow the evidence discipline in §11.
- Live GitHub state (issues, PRs, project status) is linked, never copied.

Cross-repo metadata is first-class. Contract-family catalog entries
(`type: family-reference`) and registry rows carry fields a product standard does
not need: `authored_home`, `runtime_owner`, `consumers`, and
`compatibility_status`, plus `compiler_owner` where a compiler participates.
Other entries omit these fields.

## 10. Machine-readable catalog

The repo maintains `docs/catalog.yaml`. Rules:

- page IDs MUST be unique and stable;
- `path` MUST resolve to a file that exists;
- `type` MUST be one of the page types in §6; `capability` MUST be one of §5;
- `audiences` MUST be drawn from `newcomer`, `maintainer`, `agent`,
  `contributor`, `app-author`, `stack-maintainer`;
- `related` IDs MUST resolve to other catalog entries;
- agents SHOULD route by `capability`, `audiences`, `intents`, and `type` rather
  than loading a capability's whole corpus.

The catalog is a discovery surface. It does not make weak prose useful.

## 11. Evidence and contract documentation

Formal evidence is required for the repo's compatibility claims; it is not
required for ordinary explanation.

A compatibility claim carries a status, the narrowest practical executable
evidence (a named test, fixture, witness, or workflow run), and an exact oracle
(values, keys, ordering, states, or transitions). "Correct", "stable", and
"valid" are not oracles. The registry status vocabulary is the canonical ladder:
`authored` → `profiled` → `fixture-witnessed` → `runtime-open` → `interop-open`.

- A gap MUST be recorded as a gap. Do not advance a row to make a claim
  aspirationally true.
- **Native vs translated evidence is never blurred.** Translated substrate
  evidence cannot claim a native Continuum witness.
- Planned work is not evidence. Prefer stable test or schema-symbol names over
  hand-maintained line numbers or Git SHAs.

## 12. Examples and executable truth

Examples are part of the contract. A user-facing example MUST be syntactically
valid, use supported behavior, include enough context to interpret, and show a
representative result. For Continuum, the canonical example is a schema fragment
plus a conforming value plus the witness that closes the gap.

- **Runnable** examples use supported behavior and are tested or executed when
  practical.
- **Illustrative** examples may omit setup and MUST be labeled illustrative.
- **Abridged** output MUST identify what was omitted.

Declare a language on every fenced block; present commands and expected output
separately; never fabricate output to look complete; warn before any destructive
command.

## 13. Writing and style essentials

These are editorial defaults; page-type obligations take precedence.

- Use `you` for reader actions and the component name for system actions; present
  tense; active voice when it clarifies responsibility.
- Sentence case for headings (except proper nouns and exact labels); keep heading
  levels hierarchical and meaningful in a table of contents.
- Use inline code for commands, paths, fields, literal values, and error
  identifiers; use exact casing for product labels.
- Descriptive link text that states the destination — never a bare filename or
  `here` as the entire label.
- One canonical term per concept; define unfamiliar terms at first use; use the
  glossary for shared vocabulary.
- Reserve MUST/SHOULD/MAY for normative statements like this standard, not for
  ordinary instructions.
- Avoid template voice (repeated stock phrases across pages) — it signals
  generated structure rather than editorial judgment.

## 14. Deterministic gates

`scripts/docs-lint.mjs` runs the checks this repo can determine reliably; CI
SHOULD block on them. Blocking checks:

- internal relative links in `docs/**` resolve;
- `docs/catalog.yaml` integrity: unique IDs, resolving paths, controlled `type`,
  `capability`, and `audiences`, resolving `related` IDs, and no unparsed lines;
- registry/schema coverage: every authored `schemas/*.graphql` has a registry
  row and every referenced schema file exists.

Anchor (`#fragment`) resolution is reported but **advisory**: the gate uses an
approximate slug, so a mismatch is a hint, not proof. Link resolution and the §2
hub invariant remain blocking. Other signals (page length, tone, duplication)
MAY be reported but MUST NOT block.

Run:

```bash
node scripts/docs-lint.mjs
```

## 15. Change-impact and maintenance

- **Same-change responsibility.** When observable behavior changes, the affected
  reference, examples, and contributor material MUST be current before merge. A
  contract-bearing change updates the affected docs, demonstrates they remain
  accurate, or declares no-impact with a rationale.
- **Staleness from invalidation signals**, not calendar age: owned source
  changed, public surface changed, an example stopped running, generated coverage
  changed, or an evidence anchor broke.
- **Deprecation and deletion.** Deprecated behavior is labeled with replacement
  and removal guidance; removed behavior is not presented as current. Delete
  obsolete reader-task pages rather than leaving misleading artifacts; preserve
  design history in `docs/design/` (frozen) or `CHANGELOG.md`.

## 16. Anti-patterns

- one page trying to be tutorial, reference, architecture, and troubleshooting;
- making the packet log the way to understand the product (§7);
- copying sibling-repo runtime truth or live GitHub state into Continuum (§2.1);
- a compatibility claim stronger than its recorded evidence (§11);
- public reference assembled by hand from a source that can generate it;
- a "verified" status with no defined validation result;
- agent metadata used as a substitute for readable prose;
- a bare filename or `here` as link text.

## 17. Definition of done

A page is done when its primary reader and job are clear, it meets its page
type's obligations, its facts and examples are concrete and accurate, links lead
to useful next steps, and the deterministic gates pass.

A capability's documentation is done when a newcomer can reach first success
where the matrix requires it, common goals have task guides, the exposed surface
has complete reference coverage, non-obvious concepts have explanation,
maintainers have change/verification guidance, and agents can retrieve
authoritative pages by intent without loading the whole corpus.

## 18. Adoption sequence

Do not mass-convert pages. The work is mostly **consolidation from the packet
log**, not new authoring — the durable truth already exists, scattered across the
packets.

1. Freeze `docs/design/`; stop synthesizing it into reader-task pages. Done:
   `docs/design/` is an archive index; every packet's frontmatter is `archived`.
2. Lift mis-filed reference material out of packets into reader-task pages. Done:
   the ownership-law map (`docs/reference/ownership-map.md`, from 0014) and the
   convergence reference (`docs/reference/convergence.md`, from 0035/0036).
3. Consolidate the theory packets (0001-0022) into one living "How Continuum
   works" explanation and retire `OVERVIEW.md`'s "synthesis of packets" framing.
   Done: the synthesis framing is retired; `OVERVIEW.md` is the living
   explanation and its packet links read as design history.
4. Hold each capability to the §8 coverage matrix; route new decisions to
   decision records, not packets.

`contract-families` is the lead capability. Others adopt only after the first is
observed in real use.

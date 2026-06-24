---
title: Continuum Documentation Policy
status: active
---

# Continuum Documentation Policy

This is Continuum's local documentation policy. It is the project-specific
extension required by §17 of the upstream **Documentation Product Standard —
Reader-Task Edition** (the "base standard"). It does not restate the base
standard. It records the decisions a coordination hub needs that a product repo
does not.

Where this policy and the base standard agree, the base standard governs. Where
this policy adds, narrows, or names something Continuum-specific, this policy
governs. This policy never weakens the base standard's reader-centered
principles.

Keeping the base standard outside this repo and extending it by reference is
deliberate. It is the same discipline Continuum applies to every other shared
artifact: own the boundary, link outward, do not copy whole worlds inward
(`METHOD.md` rule 4).

## 1. What kind of documentation system this is

Continuum is not a product with a UI, an end-user CLI funnel, and operators
hitting runtime failures. Continuum is a **coordination hub**: a shared
vocabulary, an ownership law, a set of authored contract families, a
compatibility-evidence registry, and a cross-repository release bar.

That changes who the documentation serves. The base standard optimizes for a
newcomer reaching first success. This repo optimizes for two readers the base
standard under-weights:

1. **Sibling-repo maintainers** who must conform — Echo, `git-warp`, Wesley,
   `warp-ttd`, Graft, Edict, `jedit`, WARP DRIVE. They need to know what their
   repo owes, where the authored home is, and what evidence closes a gap.
2. **Coordination and review agents** that must retrieve the smallest relevant
   authoritative page by intent, without loading the whole corpus or copying a
   stale roadmap into another repo.

Both readers are served by the same two base-standard principles, applied
harder here than anywhere: **generate what machines already know** (base §2.6)
and **machine-readable catalog with agent routing** (base §10, §2.7).

## 2. The hub invariant (Continuum-specific anti-pattern)

Continuum documents the **boundary** and links outward for everything below it.

The base standard's "lead with real use" (base §2.3) MUST NOT be read as a
license to pull sibling-repo runtime truth into Continuum. The following are
documentation failures here even when every file passes formatting checks, and
they extend the base standard's anti-pattern list (base §16):

- copying a sibling repo's runtime behavior, schema body, or release contract
  into a Continuum page instead of linking to its authored home;
- copying GitHub issue, pull-request, or project state into prose instead of
  linking to the live system (base §13.5);
- documenting a compatibility claim more strongly than its recorded evidence
  supports (see §6);
- minting a second home for a shared noun that already has an authored home.

## 3. Capability taxonomy

Coverage is selected per capability, not imposed per page (base §5). Continuum's
capabilities are not CLI/UI/API. They are:

| Capability | What it is | Primary readers |
| --- | --- | --- |
| `ontology` | Shared vocabulary and the causal-history model (lane, worldline, braid, footprint, witness, receipt shell, …). | All; sibling maintainers; agents |
| `contract-families` | Authored shared schemas under `schemas/` and the registry that tracks their evidence. | Sibling maintainers; Wesley; agents |
| `ownership-law` | Who owns the semantics, authored home, runtime truth, and product surface of each shared noun. | Sibling maintainers; agents |
| `convergence` | The cross-repo release bar, gates, and compatibility set. | Stack maintainers; release agents |
| `warp-cli` | The `warp` CLI and warpspace bootstrap surface. | App authors; operators |
| `method` | How work is run here (signposts, design packets, backlog lanes, retros). | Contributors; agents |

## 4. Page types

Continuum uses the base standard's page types (tutorial, how-to, reference,
explanation, troubleshooting, contributor) and adds these hub-native types:

| Page type | Purpose | Notes |
| --- | --- | --- |
| `decision-record` | A short ADR-lite record (Context / Decision / Consequences) or a single `CHANGELOG.md` line. | Replaces numbered packets for new decisions. See §5. |
| `design-packet` | Legacy chronological decision log under `docs/design/NNNN-slug/`. | Frozen archive, not for new docs. See §5. |
| `invariant` | A normative rule the stack must not violate. | Under `docs/invariants/`. |
| `ownership-map` | A table assigning the ownership axes of shared nouns. | Generated-or-validated where practical (§6). |
| `family-reference` | Reference for one authored contract family. | Backed by a file under `schemas/`. |
| `conformance-guide` | A how-to whose result is "my repo now conforms" or "this gap is now closed with evidence." | The hub's most important task type. |
| `gate-record` | The contract, owner, executable check, and evidence for one convergence gate. | Links to live GitHub; never copies issue state. |
| `signpost` | Direction-setting orientation (`BEARING.md`, `VISION.md`). | Short; routes outward. |

A `conformance-guide` MUST be titled as a goal beginning with a verb, MUST state
the exact evidence that proves success, and MUST link to the authored home and
the relevant registry entry rather than reproducing them.

## 5. The documentation system is reader-task pages, not the packet log

Continuum's `docs/design/NNNN-slug/` packets are a **historical decision log**,
not the documentation system. They record what was decided and why, in order.
They are not where a reader should Learn, Look up, or Understand the system
(base §1) — that is the job of the reader-task pages.

This **reverses an earlier stance in this policy.** Packets are valuable as
provenance and a liability when they become the primary way to understand
Continuum: a reader then has to chew dozens of chronological documents to
reconstruct current truth, which is the base §16 anti-pattern at repo scale.

The rules:

- **Durable truth lives in reader-task pages** (explanation, reference, how-to,
  contributor), organized by reader need, not by packet number. When a packet's
  conclusion becomes current truth, consolidate that truth into the relevant
  reader-task page; the packet stays as the record of the decision.
- **New decisions use a decision record, not a packet.** A decision record is at
  most one screen — Context, Decision, Consequences — and many decisions need
  only a `CHANGELOG.md` line plus the commit. Do not open a numbered design
  cycle for an ordinary decision.
- **The `docs/design/` tree is frozen as an archive.** Do not synthesize it into
  reader-task pages (for example, `docs/OVERVIEW.md` must stop billing itself as
  a synthesis of packets), and do not require a reader to visit it to understand
  the product. A superseded packet is not deleted (base §13.4; it is real
  history); it is simply no longer load-bearing.

This supersedes METHOD.md's design-cycle mandate for documentation purposes.
METHOD.md still needs a follow-up edit to drop "prefer one good design packet."

### 5.1 Coverage matrix

Coverage is selected per capability (base §5), and `not needed` is a valid,
reasoned answer — it is the governor that stops new sprawl. Add a page type only
when a real reader job demands it; a blank cell is never a placeholder page.

| Capability | Tutorial | How-to | Reference | Explanation | Troubleshooting | Contributor |
| --- | :--: | :--: | :--: | :--: | :--: | :--: |
| `ontology` | not needed | not needed | required (glossary) | required | not needed | required |
| `contract-families` | not needed | required | required | optional | optional | required |
| `ownership-law` | not needed | not needed | required | required | not needed | required |
| `convergence` | not needed | required | required | optional | not needed | required |
| `warp-cli` | required (quickstart) | required | required | optional | recommended | optional |
| `method` | not needed | not needed | optional | required | not needed | required |

## 6. Generate, validate, do not curate by hand

Three surfaces are the most drift-prone in this repo because they are
hand-maintained cross-repo tables:

- the contract family registry (`docs/contract-family-registry.md`);
- the shared noun ownership map
  (`docs/design/0014-shared-noun-ownership-map/README.md` and successors);
- the convergence release bar
  (`docs/design/0035-continuum-stack-convergence/README.md`).

For these, prefer generation or validation from the authoritative source over
hand curation (base §2.6, §13):

- Every registry row's `Authored home` MUST reference a file that exists under
  `schemas/`. Every `schemas/*.graphql` family MUST have a registry row. This is
  coverage and is mechanically checked (§8).
- Compatibility claims MUST follow the evidence discipline of base §11: a claim
  carries a status, the narrowest practical executable evidence, and an exact
  oracle; a gap is recorded as a gap; planned work is never evidence.
- Live GitHub state (issues, PRs, project status) is linked, never copied
  (base §13.5).

Cross-repo metadata is first-class here. Contract-family catalog entries
(`type: family-reference`) and registry rows carry fields the base standard does
not need: `authored_home`, `runtime_owner`, `consumers`, and
`compatibility_status`, plus `compiler_owner` where a compiler participates.
Other catalog entries omit these fields, so do not expect them on every record.

## 7. Machine-readable catalog

The repo maintains `docs/catalog.yaml` per base §10, extended with the cross-repo
fields in §6. Rules:

- page IDs MUST be unique and stable;
- `path` MUST resolve to a file that exists;
- `type` MUST be one of the page types in §4; `capability` MUST be one of §3;
- `audiences` MUST be drawn from the controlled set `newcomer`, `maintainer`,
  `agent`, `contributor`, `app-author`, `stack-maintainer`;
- `related` IDs MUST resolve to other catalog entries;
- agents SHOULD route by `capability`, `audiences`, `intents`, and `type` rather
  than loading a capability's whole corpus.

The catalog is a discovery surface. It does not make weak prose useful.

## 8. Deterministic gates

`scripts/docs-lint.mjs` runs the checks this repo can determine reliably. CI
SHOULD block on them once a workflow exists. Blocking checks:

- internal relative links in `docs/**` resolve;
- `docs/catalog.yaml` integrity: unique IDs, resolving paths, controlled `type`,
  `capability`, and `audiences`, resolving `related` IDs, and no unparsed lines;
- registry/schema coverage: every authored `schemas/*.graphql` has a registry
  row and every referenced schema file exists.

Anchor (`#fragment`) resolution is reported but **advisory**, not blocking. The
gate resolves anchors with an approximate GitHub-style slug, so a mismatch is a
hint rather than proof. This narrows base §12.2 deliberately to avoid brittle
false failures; the §2 hub invariant and link resolution remain blocking.

Other advisory signals (page length, sentence complexity, tone, duplication)
MAY be reported but MUST NOT block (base §12.3).

Run:

```bash
node scripts/docs-lint.mjs
```

## 9. Adoption sequence

Per base §18, this repo does not mass-convert pages, and per §5 the work is
mostly **consolidation from the packet log**, not new authoring — the durable
truth already exists, scattered across the packets.

1. Freeze `docs/design/` as the archive; stop synthesizing it into reader-task
   pages.
2. Lift mis-filed reference material out of packets into reader-task pages. The
   first done is the release-targets reference (`docs/reference/release-targets.md`,
   lifted from former packet 0038); the convergence (0035) and ownership-law
   (0014) reference content are the next candidates.
3. Consolidate the theory packets (0001-0022) into one living "How Continuum
   works" explanation and retire `OVERVIEW.md`'s "synthesis of packets" framing.
4. Hold each capability to the §5.1 coverage matrix; route new decisions to
   decision records, not packets.

`contract-families` remains the lead capability (highest-traffic for sibling
maintainers and agents, most exposed to drift). Other capabilities adopt only
after the first is observed in real use.

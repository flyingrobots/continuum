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
| `design-packet` | A dated decision record under `docs/design/NNNN-slug/`. | Append-only. See §5. |
| `invariant` | A normative rule the stack must not violate. | Under `docs/invariants/`. |
| `ownership-map` | A table assigning the ownership axes of shared nouns. | Generated-or-validated where practical (§6). |
| `family-reference` | Reference for one authored contract family. | Backed by a file under `schemas/`. |
| `conformance-guide` | A how-to whose result is "my repo now conforms" or "this gap is now closed with evidence." | The hub's most important task type. |
| `gate-record` | The contract, owner, executable check, and evidence for one convergence gate. | Links to live GitHub; never copies issue state. |
| `signpost` | Direction-setting orientation (`BEARING.md`, `VISION.md`). | Short; routes outward. |

A `conformance-guide` MUST be titled as a goal beginning with a verb, MUST state
the exact evidence that proves success, and MUST link to the authored home and
the registry row rather than reproducing them.

## 5. Design packets are append-only decision records

Design packets (`docs/design/NNNN-slug/`) are decision records. The base
standard's "delete obsolete pages" rule (base §13.4) explicitly exempts decision
records and versioned history, and that exemption is in force here.

- A superseded packet is NOT deleted. It records `status` and links forward to
  the packet that refines or replaces it.
- A packet's conclusions may be wrong in hindsight; the packet still stands as
  the record of what was decided and why.
- Synthesis pages (for example `docs/OVERVIEW.md`) are not packets. They are
  explanation pages and are subject to normal staleness rules (§6).

## 6. Generate, validate, do not curate by hand

Three surfaces are the most drift-prone in this repo because they are
hand-maintained cross-repo tables:

- the contract family registry (`docs/contract-family-registry.md`);
- the shared noun ownership map (`docs/design/0014-.../README.md` and successors);
- the convergence release bar (`docs/design/0035-.../README.md`).

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

Cross-repo metadata is first-class here. Catalog records and registry rows carry
fields the base standard does not need: `authored_home`, `compiler_owner`,
`runtime_owner`, `consumers`, and `compatibility_status`.

## 7. Machine-readable catalog

The repo maintains `docs/catalog.yaml` per base §10, extended with the cross-repo
fields in §6. Rules:

- page IDs MUST be unique and stable;
- `path` MUST resolve to a file that exists;
- `type` MUST be one of the page types in §4; `capability` MUST be one of §3;
- `related` IDs MUST resolve to other catalog entries;
- agents SHOULD route by `capability`, `audience`, `intents`, and `type` rather
  than loading a capability's whole corpus.

The catalog is a discovery surface. It does not make weak prose useful.

## 8. Deterministic gates

`scripts/docs-lint.mjs` runs the checks this repo can determine reliably. CI
SHOULD block on them once a workflow exists. Current checks:

- internal relative links and anchors in `docs/**` resolve;
- `docs/catalog.yaml` integrity: unique IDs, resolving paths, controlled `type`
  and `capability`, resolving `related` IDs;
- registry/schema coverage: every authored `schemas/*.graphql` has a registry
  row and every referenced schema file exists.

Advisory signals (page length, sentence complexity, tone, duplication) MAY be
reported but MUST NOT block (base §12.3).

Run:

```bash
node scripts/docs-lint.mjs
```

## 9. Adoption sequence

Per base §18, this repo does not mass-convert pages. The chosen first capability
is `contract-families`, because it is the highest-traffic surface for both
sibling maintainers and agents and the one most exposed to drift. Subsequent
capabilities adopt the policy only after the first one is observed in real use.

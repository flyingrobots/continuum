# OVERVIEW

This document is the brief synthesis of Continuum's **theory and ontology**,
covering design packets `0001` through `0018`, plus the neighborhood-core
family (`0022`). Packets `0019`-`0021` and `0023`+ are not synthesized here;
route through the links below.

It is not the place for full proofs. It is the place to remember what the
current theory says, what the important nouns mean, and how that theory cashes
out across Echo, `git-warp`, `warp-ttd`, and Wesley.

Coordination and release material introduced in later packets (`0023`+:
warpspace bootstrap, the cross-repo contract family registry, and stack
convergence) is not synthesized here. For that, route through the
[documentation index](index.md):

- contract families and their evidence: [Contract Family Registry](contract-family-registry.md);
- stack release coordination: [Continuum Stack Convergence](design/0035-continuum-stack-convergence/README.md).

For the detailed arguments, examples, and open theorem questions, read the
packets in [docs/design](design/README.md).

## 1. What Continuum Is

Continuum is the coordination spine for the active stack.

It does **not** own:

- a runtime implementation
- a storage substrate
- a shadow contract compiler
- a parallel ontology

It **does** own:

- shared vocabulary
- protocol and admissibility language
- ownership laws for cross-repo nouns
- witness and compatibility truth
- integration proof plans

That split matters. Continuum says what shared nouns mean. Echo,
`git-warp`, `warp-ttd`, and Wesley still own their local runtime, product, and
compiler truth.

## 2. Core Ontology

The base kind is **Lane**.

- A **Lane** is the basic temporal object: an ordered causal line.
- A **Worldline** is a lane with canonical or admitted status.
- A **Strand** is a lane with speculative or fork-relative status.
- A **Braid** is not just another lane. It is a compositional object over
  multiple lanes.

This means the difference between `Worldline` and `Strand` is not geometric
shape. It is admission, governance, and provenance. Both are lane-shaped. A
braid lives one level up as a plural/compositional object.

Detailed packets:

- [0001-lane-ontology-and-merge-temporality](design/0001-lane-ontology-and-merge-temporality/README.md)
- [0002-kairotic-merge-and-derived-lanes](design/0002-kairotic-merge-and-derived-lanes/README.md)

## 3. Chronos, Kairos, And Merge

Continuum uses two useful viewpoints:

- **Chronos**: one lane as a linear temporal object
- **Kairos**: the branching or plural neighborhood in which multiple lanes,
  alignments, and alternatives matter

Merge is not "outside time," but it is also not just one more ordinary step on
one line.

The clean statement is:

- merge is **Kairotic in domain**
- merge is **Chronotic in successful result**

That is why a successful merge can yield a **derived lane**, while an
unsuccessful merge should remain an explicit braid with obstruction witness
instead of pretending a single line exists.

Detailed packets:

- [0001-lane-ontology-and-merge-temporality](design/0001-lane-ontology-and-merge-temporality/README.md)
- [0002-kairotic-merge-and-derived-lanes](design/0002-kairotic-merge-and-derived-lanes/README.md)

## 4. Local Sites, Footprints, And Outcomes

Debugger and merge reasoning happens at a **local site**, not across the whole
universe at once.

The public/runtime noun for that site is **footprint**.

The math briefly used `F` as "focus boundary," but the cleaner result is:

- a sufficiently rich **footprint** is the local site-definition object

A serious footprint is richer than "things read and written." It carries:

- subject anchors
- read boundary
- write boundary
- affect boundary
- reintegration boundary

At one local site:

- **`A`** is the alignment / overlap geometry
- **`O`** is the evaluated outcome or verdict

The right relation is:

`O = Eval(A ; footprint, C, R)`

So the geometry of the site and the judgment about the site are related, but
they are not the same thing.

Detailed packets:

- [0005-alignment-structure-and-outcome](design/0005-alignment-structure-and-outcome/README.md)
- [0006-focus-boundary-structure](design/0006-focus-boundary-structure/README.md)
- [0007-footprint-as-focus-boundary](design/0007-footprint-as-focus-boundary/README.md)

## 5. Affect, Reintegration, And Optics

Two boundaries that feel similar turned out not to be the same:

- **Affect boundary**: where the local difference propagates
- **Reintegration boundary**: where the local result still has to fit back into
  the whole

Optics clarified the distinction:

- the local rewrite explains what becomes different
- the hidden residual plus reintegration explain what the whole still demands

That is why affect does not determine reintegration, and reintegration does not
determine affect.

Two good sentences from this part of the stack are:

- affect tracks what the local move makes different
- reintegration tracks what the whole still demands of that move

Detailed packets:

- [0008-affect-versus-reintegration-boundary](design/0008-affect-versus-reintegration-boundary/README.md)
- [0009-optic-clarification-of-affect-and-reintegration](design/0009-optic-clarification-of-affect-and-reintegration/README.md)

## 6. Witnesses, Neighborhoods, And Counterfactual Strength

A **braid witness** is the local counterfactual membrane around a braid site.

The important distinction is:

- a **local optic neighborhood** is the set of nearby lawful alternatives at
  that site
- a **rulial ball** is the set of nearby observer frames that can inspect or
  translate that neighborhood under some budget

They are related, but they are not the same object.

This leads to a bounded and useful notion of counterfactual strength:

- replay strength
- local optic counterfactual strength
- global Aionic strength

Continuum only claims the middle layer as a practical design target today. The
theory does **not** require pretending we can enumerate "all futures."

Detailed packets:

- [0003-braid-witness-and-local-optic-neighborhoods](design/0003-braid-witness-and-local-optic-neighborhoods/README.md)
- [0004-minimal-braid-witness-for-level-2](design/0004-minimal-braid-witness-for-level-2/README.md)

## 7. The Witness Ladder

The local Level 2 witness shape is:

`W₂ = (P, L, A, footprint, C, R, O)`

where:

- `P` = shared precursor anchor
- `L` = participating lane set
- `A` = alignment / overlap structure
- `footprint` = local site-definition object
- `C` = governing frame
- `R` = residual reintegration structure
- `O` = local outcome

The reintegration-bearing core was refined further:

`R_core = (J, K, V)`

where:

- `J` = seam anchors
- `K` = compatibility obligations
- `V` = compatibility evidence

That leads to the full witness ladder:

- `R_core` = seam-carrying reintegration core
- `W_core` = purpose-minimal local witness core
- `ReceiptRecord = (W_core, S_receipt)` = witness core plus explanatory shell

Two key consequences follow:

- witness refinement and shell refinement are not the same thing
- witness equivalence is purpose-indexed, not raw byte equality

Detailed packets:

- [0010-residual-reintegration-structure](design/0010-residual-reintegration-structure/README.md)
- [0011-witness-core-and-receipt-shell](design/0011-witness-core-and-receipt-shell/README.md)
- [0012-compatibility-obligations-versus-evidence](design/0012-compatibility-obligations-versus-evidence/README.md)
- [0013-witness-refinement-and-equivalence](design/0013-witness-refinement-and-equivalence/README.md)

## 8. What This Means For The Stack

The current ownership law is:

- **Continuum** owns semantic vocabulary and coordination truth
- **Continuum** also owns the authored home for shared cross-engine contract
  families under [schemas](../schemas/README.md) when those families are truly
  shared
- **Wesley** owns compilation, publication, schema hashes, codecs, and witness
  lanes for shared contract families
- **Echo** and **`git-warp`** are sibling Continuum runtime implementations
- **`warp-ttd`** owns observer/session/product surfaces

A Continuum runtime is any implementation that can publish, admit, observe,
export, and import witnessed causal history according to Continuum contract
families and admission laws.

The practical implication is:

- engines can keep local runtime elaborations
- Continuum tools should still see one shared observer/debugger contract family
- runtime posture terms such as hot, cold, durable, archival, low-latency,
  browser-hosted, or offline-first describe deployment profiles, not protocol
  roles

So the goal is **not** "make Echo and `git-warp` internally identical."

The goal is:

- same shared observer-facing nouns
- same contract family where semantics are shared
- engine-local detail only below that boundary

Detailed packets:

- [0014-shared-noun-ownership-map](design/0014-shared-noun-ownership-map/README.md)
- [0016-engine-local-vs-shared-observer-contract](design/0016-engine-local-vs-shared-observer-contract/README.md)

The first concrete admission/publication slice after the doctrine packet is
neighborhood core.

That family freezes:

- shared `AdmissionOutcomeKind`
- singleton-vs-plural local site truth
- shared neighborhood participant roles

while still leaving bounded-site computation engine-local.

Detailed packet:

- [0022-neighborhood-core-and-admission-outcome-family](design/0022-neighborhood-core-and-admission-outcome-family/README.md)
- authored family: [schemas/continuum-neighborhood-core-family.graphql](../schemas/continuum-neighborhood-core-family.graphql)

## 9. Settlement Is A Shared Contract Family

The next convergence step after `0016` is settlement publication.

Now that Echo has a real settlement runway, Continuum treats settlement as a
first-class shared observer/debugger family rather than an engine-local quirk.

That means Continuum tools should eventually be able to ask both Echo and
`git-warp` for the same top-level settlement categories:

- settlement request
- settlement delta
- settlement plan
- settlement decision
- import candidate
- conflict artifact
- settlement result

This does **not** force both engines to compute settlement the same way
internally. It does require them to publish the same observer-facing category
stack, with engine-specific elaboration pushed down into shell and drill-down.

Settlement sits between:

- neighborhood core
- reintegration detail
- receipt shell

It is related to all three, but it is not reducible to any of them.

Detailed packet:

- [0017-settlement-publication-and-shared-reintegration](design/0017-settlement-publication-and-shared-reintegration/README.md)
- authored family: [schemas/continuum-settlement-family.graphql](../schemas/continuum-settlement-family.graphql)

## 10. Interoperability Law

The newest clarification is:

- Echo and `git-warp` do **not** need identical internal engine nouns
- Continuum tools **do** need one shared observer/debugger contract family

So the stack now distinguishes:

- engine-local runtime nouns
- shared engine-published observer nouns
- shared session/control nouns

That is the law that keeps interoperability from collapsing into adapter
folklore.

Detailed packet:

- [0016-engine-local-vs-shared-observer-contract](design/0016-engine-local-vs-shared-observer-contract/README.md)

## 11. One Witnessed History, Multiple Sibling Runtimes

The corrected Continuum direction is not "two halves of one hot/cold machine."

The stronger claim is:

- the client should experience **one shared causal history with compatible
  observer-relative readings**
- Echo and `git-warp` are sibling runtime implementations over that history
- neither runtime owns privileged graph truth
- cross-runtime interop is witnessed suffix exchange and admission between
  peers

That means:

- graph-like and state-like values are observer-relative readings, cached
  projections, retained artifacts, or implementation-local materializations
- posture language is runtime metadata, not protocol ontology
- a shared binary carrier helps only if both engines also agree on the same
  contracts and interpretation
- Continuum must not become a runtime facade that invents semantics the
  sibling runtimes themselves do not publish

The practical invariants are:

- one shared causal history plus compatible observer-relative readings
- published-noun parity
- engine-local freedom below the boundary
- explicit cross-runtime import/export admission
- no silent translation in adapters or tools

Detailed packet:

- [0018-one-graph-two-temperatures-and-runtime-handoff](design/0018-one-graph-two-temperatures-and-runtime-handoff/README.md)

## 12. The Current Proof Target

The active integration proof target is one narrow end-to-end slice where:

- Wesley authors one GraphQL family
- Wesley generates Rust and TypeScript artifacts plus codec metadata
- Echo consumes the generated Rust side for one real graph/rewrite slice
- invalid rewrite code fails at compile time for that slice
- `warp-ttd` connects to Echo and inspects the same slice via the generated
  TypeScript side

That proof should be small, concrete, and witnessed. It is the current bridge
from theory into active repo changes.

Detailed packet:

- [0015-echo-wesley-warp-ttd-proof-plan](design/0015-echo-wesley-warp-ttd-proof-plan/README.md)

## 13. The Short Version

If you need the whole theory compressed into a few lines:

- a lane is the basic temporal object
- worldlines and strands are lane forms with different admission/governance
- braids are plural compositional objects over lanes
- merge is Kairotic search that may yield a derived lane
- footprints define local sites
- witnesses preserve local optic neighborhoods
- reintegration core, witness core, and receipt shell are different layers
- Continuum owns the meaning of shared nouns, not every runtime or schema
- the stack should converge on one shared observer/debugger contract even when
  the engines underneath it differ

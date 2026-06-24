---
title: Design Log (Frozen Archive)
status: archived
---

# Design

This directory is a **frozen historical decision log**. Packets live here as
`NNNN-slug/` records of decisions that were made; they are history, not the
documentation system.

Rules (see [docs/DOCUMENTATION_POLICY.md](../DOCUMENTATION_POLICY.md) §7):

- **Do not add new packets.** Record a new decision as a one-screen ADR-lite
  note or a `CHANGELOG.md` line.
- Durable truth lives in reader-task pages, not here. When a packet's conclusion
  is current truth, consolidate it into the relevant reader-task page; the packet
  stays as the record of the decision.
- A superseded packet is not deleted — it is simply no longer load-bearing.

Existing packets retain their original content as written; their `status:`
frontmatter reflects the historical proposal, not live review.

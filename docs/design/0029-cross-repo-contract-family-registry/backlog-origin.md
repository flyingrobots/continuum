---
title: Backlog Origin - Cross-Repo Contract Family Registry
status: active
---

# Backlog Origin

Origin discussion:

- The stack now has a clearer contract-family story, but it lacked one single
  place to say which repo authored each shared family.
- The first useful registry needed to name the active family spine:
  `IntentEnvelope`, `TickResult`, `ObserverPlan`, `ObservationRequest`,
  `ReadingEnvelope`, `WitnessedSuffixShell`, `CausalSuffixBundle`, and
  `ImportOutcome`.
- The registry needed to distinguish authored home, compiler/module owner,
  runtime emitter, downstream consumer, and non-authoritative mirrors.
- The registry also needed to make unproved compatibility claims visible as
  gaps rather than folklore.

Prompt distilled into this packet:

**Publish one small Continuum-owned registry that makes shared contract-family
ownership, consumers, witnesses, and missing compatibility cuts obvious across
the active stack.**

This is a fundamental design decision about the system's semantics. Let me break it down:

  What is policy_hashes?

  From the code comment (events.rs:109):
  /// Which policy/observer interpreted reality (for now() queries)
  pub policy_hashes: Vec<Hash>,

  From NEXT-MOVES.md, policies are things like:
  - Clock policies: How to interpret time samples (trust NTP? trust monotonic? average them?)
  - Scheduler policies: How to choose which rewrite fires next (FIFO? LIFO? random?)
  - Trust policies: Which agents/sources to believe

  Concrete Example: The "Timer Fire" Scenario

  Imagine this event sequence:

  // Input event: "User requested sleep(5s)"
  Event A: { kind: Input, payload: "sleep(5s)", parents: [genesis] }

  // Clock sample event: "Monotonic clock says 1000ms elapsed"
  Event B: { kind: Claim, payload: "monotonic=1000ms", parents: [A] }

  // Another clock sample: "NTP says 6000ms elapsed"
  Event C: { kind: Claim, payload: "ntp=6000ms", parents: [B] }

  // Decision event: "Fire the timer now"
  Event D: { kind: Decision, payload: "fire_timer", parents: [C] }

  Now, Event D depends on which clock policy was active:
  - Policy X (trust monotonic): Wait longer, timer shouldn't fire yet (only 1000ms elapsed)
  - Policy Y (trust NTP): Fire now (6000ms > 5000ms threshold)

  Current Design (Option B): policy_hashes NOT in event_id

  event_id = H(parents || kind || payload || nonce)

  What happens:
  - Event D has the same event_id regardless of whether Policy X or Policy Y was active
  - The policy_hashes field stores [hash(Policy Y)] as metadata
  - But two different observers running the same replay with different policies would generate Event D with:
    - Same event_id
    - Different policy_hashes
    - Hash collision in content-addressed store!

  Example collision:
  // Observer 1 (using Policy Y - trust NTP)
  EventD_observer1 = {
      event_id: H(parents=[C] || kind=Decision || payload="fire_timer" || nonce=42),
      policy_hashes: [hash(PolicyY)],
      // event_id = 0xABCD1234... (same)
  }

  // Observer 2 (using Policy X - trust monotonic, but somehow still fired?)
  EventD_observer2 = {
      event_id: H(parents=[C] || kind=Decision || payload="fire_timer" || nonce=42),
      policy_hashes: [hash(PolicyX)],
      // event_id = 0xABCD1234... (SAME HASH, DIFFERENT EVENT!)
  }

  Proposed Design (Option A): policy_hashes IN event_id

  event_id = H(parents || kind || payload || policy_hashes || nonce)

  What happens:
  - Event D would have different event_ids under different policies
  - No hash collision
  - The DAG explicitly represents "this decision was made under this policy"

  // Observer 1
  EventD_policyY = {
      event_id: H(...|| policy_hashes=[PolicyY] ||...),
      // event_id = 0xABCD1234...
  }

  // Observer 2
  EventD_policyX = {
      event_id: H(...|| policy_hashes=[PolicyX] ||...),
      // event_id = 0xDEADBEEF... (DIFFERENT)
  }

  Ramifications

  Option A: Include policy_hashes in event_id ✅ Content-addressing preserved

  Pros:
  - ✅ No hash collisions: Different policies → different event_ids
  - ✅ Full provenance: DAG explicitly shows which policy made each decision
  - ✅ Debuggability: "This decision came from FIFO scheduler" is in the event_id itself
  - ✅ Replay determinism: Same policy + same inputs → same event_id guaranteed

  Cons:
  - ❌ Merging complexity: How do you merge branches where Event D exists with different policies?
  Branch A: Event D with PolicyX
  Branch B: Event D with PolicyY
  Merge: ???
  - ❌ DAG bloat: Same "logical" event appears multiple times if replayed under different policies
  - ❌ Counterfactual awkwardness: "What if we used PolicyZ instead?" requires creating new events, not just reinterpreting existing ones

  Option B: Keep current (policy as metadata) ⚠️ Simpler but collision-prone

  Pros:
  - ✅ Simpler DAG: Events are policy-independent, policies are just observers
  - ✅ Easy counterfactuals: Replay same events with different policies without creating new event_ids
  - ✅ Natural separation: Events are facts, policies are interpretations

  Cons:
  - ❌ Hash collisions possible: Two observers with different policies can generate events with same event_id but different semantics
  - ❌ Content-addressing violated: The "content" includes the policy, but the hash doesn't
  - ❌ Replay non-determinism: Same event sequence + different policy → same event_ids but different state

  My Analysis

  The critical question is: Are Decision events facts or interpretations?

  1. If Decision events are FACTS ("The FIFO scheduler chose to fire this timer"):
    - Policy is part of the event's identity
    - Include policy_hashes in event_id (Option A)
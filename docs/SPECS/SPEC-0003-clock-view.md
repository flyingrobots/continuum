# SPEC-0003: Clock View - Time as Materialized View

**Status:** Approved (v2.1)
**Related:** NEXT-MOVES.md Phase 0.5.4, THEORY.md Paper II
**Estimated Effort:** 2-3 hours

---

## Problem Statement

Time cannot be a syscall in a deterministic system. Calling `Instant::now()` or `SystemTime::now()` introduces nondeterminism - replay sees different wall-clock values than original execution, breaking hash equality.

**Without this:** Replay depends on wall-clock timing, making deterministic execution impossible.
**With this:** Time becomes a pure query over event history - same events → same time belief (always).

---

## User Story

**As a** JITOS kernel developer
**I want** time represented as a materialized view over events
**So that** replay produces identical time beliefs without touching host syscalls

---

## Requirements

### Functional Requirements

#### Core Principle: Time Is a Fold, Not a Syscall

**Time in JITOS is a pure function over the event DAG.**

- **No syscalls:** `now()` never calls `libc::clock_gettime()` or equivalent
- **Deterministic:** Same event sequence + same policy → identical time belief
- **Policy-parameterized:** Different clock policies (trust NTP, trust monotonic, etc.) produce different beliefs from same observations
- **Replay-safe:** Historical queries (`now_at_cut(events, k)`) never touch host clock

#### ClockView Type

ClockView is a deterministic materialized view over clock observation events.

- `samples: Vec<ClockSampleRecord>` – append-only record of accepted clock samples
- `latest: LatestSamples` – O(1) cached "latest by source" for simple policies
- `current: Time` – cached current belief (derived deterministically from state + policy)
- `policy: ClockPolicyId` – policy selector (stable identifier)

Where:

- `ClockSampleRecord`:
  - `event_id: Hash`
  - `sample: ClockSample`

- `LatestSamples` (Phase 0.5.4):
  - `monotonic: Option<ClockSampleRecord>`
  - `ntp: Option<ClockSampleRecord>`
  - `rtc: Option<ClockSampleRecord>`
  - `peer: Option<ClockSampleRecord>`
  - **Definition:** "latest" means the most recently applied sample in canonical worldline order (not the greatest `value_ns`)

#### Time Type

Time is a belief, not a fact.

- `ns: u64`
- `uncertainty_ns: u64`
- `domain: TimeDomain` – { Monotonic, Unix, Unknown }
- `provenance: Vec<Hash>` – event IDs actually used by the policy (typically 0–2)

`Time::unknown()` MUST set `uncertainty_ns = u64::MAX`, `domain = TimeDomain::Unknown`, and empty provenance.

**Key invariant:** `ClockView::now()` returns the current belief as-of the last applied event. If no new clock observation events occur, `now()` stays constant. Time does not "flow" between events.

#### ClockSample Type

- `source: ClockSource` - where sample came from
- `value_ns: u64` - reported time value
- `uncertainty_ns: u64` - reported uncertainty

#### ClockSource Enum

- `Monotonic` - monotonic clock (safe, no jumps, no wall-time)
- `Rtc` - real-time clock (can jump backward, settable)
- `Ntp` - network time protocol sample
- `PeerClaim` - time claim from another agent

#### TimeDomain Enum

- `Monotonic` - monotonic time (relative, no wall-clock meaning)
- `Unix` - Unix epoch time (1970-01-01 00:00:00 UTC)
- `Unknown` - no time information available

#### ClockPolicyId Enum

- `TrustMonotonicLatest` - use latest monotonic sample only
- `TrustNtpLatest` - use latest NTP sample only

#### ClockError Type

Errors that can occur during clock view operations:

- `DecodingError` - canonical decoding failed for a tagged clock sample
- `CutOutOfBounds { cut: usize, len: usize }` - `now_at_cut()` called with `cut > events.len()`

**Note:** For Phase 0.5.4, semantic validation (e.g., excessive uncertainty bounds) succeeds but may log warnings. Only decode failures produce errors.

#### Event Integration

Clock observations are `EventKind::Observation` events (from SPEC-0001-events):

```rust
// Observation type identifier for clock samples (v0)
const OBS_CLOCK_SAMPLE_V0: Hash = /* ... */;

// Example clock sample event
let sample_event = EventEnvelope::new_observation(
    canonical::encode(&ClockSample {
        source: ClockSource::Ntp,
        value_ns: 1735387200_000_000_000,  // 2024-12-28 12:00:00 UTC
        uncertainty_ns: 50_000_000,         // ±50ms
    })?,
    parent_events,
    Some(OBS_CLOCK_SAMPLE_V0),  // Type tag for efficient filtering
)?;
```

**Observation Type Filtering (MUST):**
- `apply_event()` MUST only attempt to decode observations whose type tag equals `OBS_CLOCK_SAMPLE_V0`
- All other observation events (untagged or different tags) MUST be ignored with `Ok(())`
- For Phase 0.5.4: untagged clock samples are NOT supported (strict enforcement)

#### Query Interface

```rust
impl ClockView {
    /// Create new clock view with given policy
    pub fn new(policy: ClockPolicyId) -> Self;

    /// Apply one event in canonical worldline order.
    /// No syscalls, deterministic behavior only.
    pub fn apply_event(&mut self, event: &EventEnvelope) -> Result<(), ClockError>;

    /// Pure fold over a prefix of a canonical worldline.
    /// `cut` is the number of events applied (prefix length).
    /// Returns `Err(CutOutOfBounds)` if `cut > events.len()`.
    pub fn now_at_cut(
        events: &[EventEnvelope],
        cut: usize,
        policy: ClockPolicyId,
    ) -> Result<Time, ClockError>;

    /// Current belief as-of the last applied event.
    /// Returns a reference (no allocation).
    pub fn now(&self) -> &Time;
}
```

#### Policy Selection (Phase 0.5.4)

Phase 0.5.4 MUST ship **two minimal policies** to satisfy AC4:

**1) TrustMonotonicLatest**
   - If a monotonic sample exists: use latest monotonic sample
   - Domain: `TimeDomain::Monotonic`
   - Else: `Time::unknown()`

**2) TrustNtpLatest**
   - If an NTP sample exists: use latest NTP sample
   - Domain: `TimeDomain::Unix`
   - Else: `Time::unknown()`

Policy is selected by `ClockPolicyId`, and interpretation is a pure function of the view state.

This is enough to validate counterfactual branching: **same events + different policy → different time belief**.

**Future policies** (not in scope for 0.5.4):
- `TrustNtpWeighted`: Weighted average of NTP samples
- `HybridMonotonicRtc`: Monotonic for intervals, RTC for absolute time
- `ConsensusTime`: Byzantine-resistant time from peer claims

### Non-Functional Requirements

1. **Performance (Phase 0.5.4):**
   - `apply_event()` is O(1) (updates latest-by-source cache)
   - `now()` is O(1) (returns cached belief)
   - `now_at_cut()` is O(cut) (fold from zero state)

2. **Memory:** O(n) samples (compaction later)
3. **Correctness:** pure + deterministic; no I/O

---

## Acceptance Criteria

### AC1: ClockView Module Exists
- [ ] File `jitos-views/src/clock.rs` exists
- [ ] Crate `jitos-views/` created with proper Cargo.toml
- [ ] Exports `ClockView`, `Time`, `TimeDomain`, `ClockSample`, `ClockSampleRecord`, `ClockSource`, `ClockPolicyId`, `ClockError`, `LatestSamples`

### AC2: `now()` Is a Query, Not a Syscall
- [ ] `ClockView::now()` never calls system time functions
- [ ] Implementation is pure - same input → same output
- [ ] Test: verify `now()` called 1000x returns same value

### AC3: Same Events + Same Policy → Same Time Belief
- [ ] Test: replay same event sequence 100x → identical time values
- [ ] Test: two ClockView instances with same events → identical `now()`

### AC4: Different Policy → Different Time Belief
- [ ] Implement TrustMonotonicLatest AND TrustNtpLatest
- [ ] Same event sequence containing both sample types yields different beliefs under each policy
- [ ] Validates counterfactual branching (Paper II)

### AC5: Replay Never Touches Host Clock
- [ ] No imports of `std::time::{Instant, SystemTime}`
- [ ] No `libc::clock_gettime()` or platform equivalents
- [ ] Audit: grep for time syscalls returns empty

---

## Test Plan (Behavioral Black-Box)

### Test Suite Structure

```
jitos-views/
└── tests/
    ├── clock_determinism.rs   // AC2, AC3
    ├── clock_policies.rs       // AC4
    └── clock_replay_safety.rs  // AC5
```

### T1: Pure Query Behavior (AC2)

**Scenario:** `now()` is deterministic
**Given:** ClockView with 5 monotonic samples applied
**When:** Call `now()` 1000 times
**Then:** All 1000 calls return identical Time value (ns, uncertainty, provenance)

### T2: Replay Determinism (AC3)

**Scenario:** Identical event sequences produce identical time
**Given:** Event sequence with 10 clock sample events
**When:** Replay sequence 100 times in separate ClockView instances
**Then:** All 100 instances report identical `now()` values

### T3: Policy Independence (AC4)

**Scenario:** Different policies produce different beliefs from same observations
**Given:** Event sequence with both Monotonic and Ntp samples
**When:** Replay with `ClockPolicyId::TrustMonotonicLatest` vs `ClockPolicyId::TrustNtpLatest`
**Then:** Time beliefs differ (monotonic-only vs ntp-only) and domains differ (Monotonic vs Unix)

### T4: No Host Clock Dependency (AC5)

**Scenario:** Implementation never touches system clock
**Given:** ClockView implementation
**When:** Search source for time syscalls
**Then:** Zero matches for `Instant::`, `SystemTime::`, `clock_gettime`

### T5: Historical Queries (AC2)

**Scenario:** `now_at_cut()` allows querying time at any worldline position
**Given:** Event sequence of length 20
**When:** Query `now_at_cut(events, 10, policy)`
**Then:** Returns time belief as-of event 10 (not current cut)

### T6: Event Integration (AC1)

**Scenario:** ClockView correctly parses Observation events
**Given:** EventEnvelope with tagged ClockSample payload
**When:** `apply_event()` called
**Then:**
- Sample appended to `ClockView.samples`
- Corresponding field in `latest` updated
- `current` updated iff sample's source is relevant to active policy; otherwise `current` remains unchanged

### T7: Unknown State Initialization (AC1)

**Scenario:** ClockView starts with sensible defaults
**Given:** `ClockView::new(policy)`
**When:** Call `now()` before any events applied
**Then:** Returns `Time::unknown()` with `uncertainty_ns = u64::MAX` and empty provenance

---

## Implementation Notes

### Phase 0.5.4 Scope

**In scope:**
- ClockView type with two policies: TrustMonotonicLatest and TrustNtpLatest
- Time, TimeDomain, ClockSample, ClockSampleRecord, ClockSource types
- ClockPolicyId, ClockError, LatestSamples types
- Pure query interface (no I/O)
- Integration with EventEnvelope (SPEC-0001-events)
- 7 behavioral tests
- Compile-time enforcement (optional, via clippy.toml)

**Out of scope (future work):**
- ClockPolicy trait abstraction (for extensibility)
- Weighted/averaged policies (TrustNtpWeighted)
- Sample compaction/pruning
- Distributed clock synchronization
- Hybrid logical clocks (HLC)

### Dependencies

- `jitos-core` (EventEnvelope, canonical encoding, Hash types)
- `serde` (for ClockSample serialization)

### Migration Path

Current code using `std::time::Instant`:

```rust
// BEFORE (nondeterministic)
let start = Instant::now();

// AFTER (deterministic - recommended for interval timing)
let start_ns = clock_view.now().ns;

// Alternative (if uncertainty + provenance needed)
let start = clock_view.now().clone();  // allocates if provenance grows
```

**Recommendation:** Use `now().ns` for interval timing. For Phase 0.5.4, `provenance: Vec<Hash>` is heap-allocated.

**Future optimization:** Consider `SmallVec<[Hash; 2]>` or inline storage for provenance to avoid allocation on `clone()`.

This migration will happen in **Phase 2.1** (port ninelives).

### Compile-Time Enforcement (Extra Credit)

To prevent `Instant::now()` or `SystemTime::now()` from sneaking back into the codebase:

**Option 1: clippy.toml (recommended)**
```toml
disallowed-methods = [
    "std::time::Instant::now",
    "std::time::SystemTime::now",
]
```

**Option 2: CI enforcement**
```bash
# In CI pipeline
cargo clippy -- -D clippy::disallowed_methods
```

This elevates the ban from "grep-based policing" to compile-time enforcement.

---

## Success Metrics

- [ ] All 7 tests pass
- [ ] No time syscalls in implementation
- [ ] Replay golden test: 1000 iterations → identical hashes
- [ ] Documented in NEXT-MOVES.md as ✅ complete

---

## References

- **THEORY.md Paper II:** Deterministic worldlines and two-plane semantics
- **THEORY.md Paper VI:** JITOS architecture - time as view, not syscall
- **NEXT-MOVES.md Phase 0.5.4:** Original specification
- **SPEC-0001-events:** EventEnvelope integration

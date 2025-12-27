//! Event Envelope with DAG Structure (Phase 0.5.2)
//!
//! This module defines the universal event envelope for the Loom worldline DAG.
//! Events are content-addressed and form a directed acyclic graph (DAG) representing
//! the causal history of the system.

use crate::canonical;
use crate::Hash;
use serde::{Deserialize, Serialize};

/// Unique identifier for a branch in the worldline DAG.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct BranchId(pub String);

/// Unique identifier for an agent (human, AI, or system).
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct AgentId(pub String);

/// Cryptographic signature over event data.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Signature(pub Vec<u8>);

/// Merge strategy for combining branches.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum MergeStrategy {
    /// Fast-forward merge (linear history)
    FastForward,
    /// Three-way merge with conflict resolution
    ThreeWay,
    /// Custom merge logic identified by hash
    Custom(Hash),
}

/// Event classification for different types of state transitions.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EventKind {
    /// External input (user, device, network)
    Input,

    /// Kernel decision (schedule choice, timer fire)
    Decision,

    /// Untrusted assertion (clock sample, peer claim)
    Claim,

    /// Derived computation (rule application result)
    Derivation,

    /// Trust boundary crossing (signature verification, BTR anchor)
    Anchor,

    /// Branch fork
    BranchFork {
        base_event: Hash,
        delta_spec_hash: Hash,
    },

    /// Branch merge (multiple parents)
    BranchMerge { strategy: MergeStrategy },
}

/// Canonically-encoded bytes for event payloads.
///
/// This wrapper ensures all payloads are canonical CBOR.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CanonicalBytes(pub Vec<u8>);

impl CanonicalBytes {
    /// Create canonical bytes by encoding a serializable value.
    pub fn from_value<T: Serialize>(value: &T) -> Result<Self, canonical::CanonicalError> {
        let bytes = canonical::encode(value)?;
        Ok(CanonicalBytes(bytes))
    }

    /// Decode canonical bytes to a deserializable value.
    pub fn to_value<T: for<'de> Deserialize<'de>>(&self) -> Result<T, canonical::CanonicalError> {
        canonical::decode(&self.0)
    }
}

/// The universal event envelope for the Loom worldline DAG.
///
/// Events are content-addressed and cryptographically linked to form a DAG
/// representing the complete causal history of the system.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct EventEnvelope {
    /// Content-addressed ID: H(parents || kind || payload || nonce)
    pub event_id: Hash,

    /// Parent event(s) - normally 1, >1 for merge/anchor
    pub parents: Vec<Hash>,

    /// Optional branch identifier (can be derived from parents but useful for queries)
    pub branch_id: Option<BranchId>,

    /// Event classification
    pub kind: EventKind,

    /// The actual payload (MUST be canonically encoded)
    pub payload: CanonicalBytes,

    /// Who created this event
    pub agent_id: AgentId,

    /// Cryptographic signature over (event_id || payload)
    pub signature: Signature,

    /// Which policy/observer interpreted reality (for now() queries)
    pub policy_hashes: Vec<Hash>,

    /// Nonce for uniqueness (prevents duplicate event_id collisions)
    pub nonce: u64,
}

impl EventEnvelope {
    /// Compute the event_id from the envelope's components.
    ///
    /// The event_id is content-addressed: H(parents || kind || payload || nonce)
    /// This ensures deterministic, collision-resistant identification.
    pub fn compute_event_id(
        parents: &[Hash],
        kind: &EventKind,
        payload: &CanonicalBytes,
        nonce: u64,
    ) -> Result<Hash, canonical::CanonicalError> {
        // Create a deterministic structure for hashing
        #[derive(Serialize)]
        struct EventIdInput<'a> {
            parents: &'a [Hash],
            kind: &'a EventKind,
            payload: &'a [u8],
            nonce: u64,
        }

        let input = EventIdInput {
            parents,
            kind,
            payload: &payload.0,
            nonce,
        };

        // Canonical encode and hash
        let canonical_bytes = canonical::encode(&input)?;
        let hash_bytes = blake3::hash(&canonical_bytes);

        Ok(Hash(*hash_bytes.as_bytes()))
    }

    /// Create a new event with automatically computed event_id.
    pub fn new(
        parents: Vec<Hash>,
        branch_id: Option<BranchId>,
        kind: EventKind,
        payload: CanonicalBytes,
        agent_id: AgentId,
        signature: Signature,
        policy_hashes: Vec<Hash>,
        nonce: u64,
    ) -> Result<Self, canonical::CanonicalError> {
        let event_id = Self::compute_event_id(&parents, &kind, &payload, nonce)?;

        Ok(EventEnvelope {
            event_id,
            parents,
            branch_id,
            kind,
            payload,
            agent_id,
            signature,
            policy_hashes,
            nonce,
        })
    }

    /// Verify that the event_id matches the computed hash.
    pub fn verify_event_id(&self) -> Result<bool, canonical::CanonicalError> {
        let computed = Self::compute_event_id(&self.parents, &self.kind, &self.payload, self.nonce)?;
        Ok(computed == self.event_id)
    }

    /// Check if this event is a genesis event (no parents).
    pub fn is_genesis(&self) -> bool {
        self.parents.is_empty()
    }

    /// Check if this event is a merge (multiple parents).
    pub fn is_merge(&self) -> bool {
        self.parents.len() > 1
    }

    /// Check if this event is a fork.
    pub fn is_fork(&self) -> bool {
        matches!(self.kind, EventKind::BranchFork { .. })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_agent_id() -> AgentId {
        AgentId("test-agent".to_string())
    }

    fn test_signature() -> Signature {
        Signature(vec![0u8; 64])
    }

    #[test]
    fn test_genesis_event() {
        let payload = CanonicalBytes::from_value(&"genesis").unwrap();
        let event = EventEnvelope::new(
            vec![],
            None,
            EventKind::Anchor,
            payload,
            test_agent_id(),
            test_signature(),
            vec![],
            0,
        )
        .unwrap();

        assert!(event.is_genesis());
        assert!(!event.is_merge());
        assert!(!event.is_fork());
        assert!(event.verify_event_id().unwrap());
    }

    #[test]
    fn test_linear_history() {
        // Create genesis
        let genesis_payload = CanonicalBytes::from_value(&"genesis").unwrap();
        let genesis = EventEnvelope::new(
            vec![],
            None,
            EventKind::Anchor,
            genesis_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            0,
        )
        .unwrap();

        // Create child event
        let child_payload = CanonicalBytes::from_value(&"child").unwrap();
        let child = EventEnvelope::new(
            vec![genesis.event_id],
            None,
            EventKind::Input,
            child_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            1,
        )
        .unwrap();

        assert!(!child.is_genesis());
        assert!(!child.is_merge());
        assert_eq!(child.parents.len(), 1);
        assert_eq!(child.parents[0], genesis.event_id);
        assert!(child.verify_event_id().unwrap());
    }

    #[test]
    fn test_merge_event() {
        // Create two parent events
        let parent1_payload = CanonicalBytes::from_value(&"parent1").unwrap();
        let parent1 = EventEnvelope::new(
            vec![],
            Some(BranchId("branch-a".to_string())),
            EventKind::Input,
            parent1_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            0,
        )
        .unwrap();

        let parent2_payload = CanonicalBytes::from_value(&"parent2").unwrap();
        let parent2 = EventEnvelope::new(
            vec![],
            Some(BranchId("branch-b".to_string())),
            EventKind::Input,
            parent2_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            1,
        )
        .unwrap();

        // Create merge event
        let merge_payload = CanonicalBytes::from_value(&"merge").unwrap();
        let merge = EventEnvelope::new(
            vec![parent1.event_id, parent2.event_id],
            None,
            EventKind::BranchMerge {
                strategy: MergeStrategy::ThreeWay,
            },
            merge_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            2,
        )
        .unwrap();

        assert!(!merge.is_genesis());
        assert!(merge.is_merge());
        assert_eq!(merge.parents.len(), 2);
        assert!(merge.verify_event_id().unwrap());
    }

    #[test]
    fn test_fork_event() {
        // Create base event
        let base_payload = CanonicalBytes::from_value(&"base").unwrap();
        let base = EventEnvelope::new(
            vec![],
            None,
            EventKind::Input,
            base_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            0,
        )
        .unwrap();

        // Create fork event
        let delta_spec_hash = Hash([1u8; 32]);
        let fork_payload = CanonicalBytes::from_value(&"fork").unwrap();
        let fork = EventEnvelope::new(
            vec![base.event_id],
            Some(BranchId("new-branch".to_string())),
            EventKind::BranchFork {
                base_event: base.event_id,
                delta_spec_hash,
            },
            fork_payload,
            test_agent_id(),
            test_signature(),
            vec![],
            1,
        )
        .unwrap();

        assert!(!fork.is_genesis());
        assert!(!fork.is_merge());
        assert!(fork.is_fork());
        assert!(fork.verify_event_id().unwrap());
    }

    #[test]
    fn test_event_id_determinism() {
        // Create same event twice
        let payload = CanonicalBytes::from_value(&"test").unwrap();
        let parents = vec![Hash([0u8; 32])];

        let event1 = EventEnvelope::new(
            parents.clone(),
            None,
            EventKind::Input,
            payload.clone(),
            test_agent_id(),
            test_signature(),
            vec![],
            42,
        )
        .unwrap();

        let event2 = EventEnvelope::new(
            parents.clone(),
            None,
            EventKind::Input,
            payload.clone(),
            test_agent_id(),
            test_signature(),
            vec![],
            42,
        )
        .unwrap();

        // Same inputs should produce same event_id
        assert_eq!(event1.event_id, event2.event_id);
    }

    #[test]
    fn test_event_id_collision_resistance() {
        // Different nonces should produce different event_ids
        let payload = CanonicalBytes::from_value(&"test").unwrap();
        let parents = vec![Hash([0u8; 32])];

        let event1 = EventEnvelope::new(
            parents.clone(),
            None,
            EventKind::Input,
            payload.clone(),
            test_agent_id(),
            test_signature(),
            vec![],
            1,
        )
        .unwrap();

        let event2 = EventEnvelope::new(
            parents.clone(),
            None,
            EventKind::Input,
            payload.clone(),
            test_agent_id(),
            test_signature(),
            vec![],
            2,
        )
        .unwrap();

        // Different nonces must produce different event_ids
        assert_ne!(event1.event_id, event2.event_id);
    }
}

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ContinuumConstructionError,
  ContinuumObservationError,
  canonicalStringify,
  compareOccurrenceBinding,
  hashCanonicalJson,
  makeOccurredIntent,
  makeOccurrenceRef,
  matchAdmission,
  matchObservation,
  meetRevelationPosture,
  unwrapObserved,
  validateDeclaration
} from '../src/index.mjs';

const issuer = { kind: 'client', id: 'client:local' };

function appliedIntent(args) {
  return {
    kind: 'intent',
    optic: {
      domain: 'xyph.quest',
      name: 'recordComment',
      lawpack: {
        domain: 'xyph',
        name: 'xyph.quest',
        semanticDigest: hashCanonicalJson({ law: 'quest-v1' })
      }
    },
    args,
    site: { kind: 'quest-comment' },
    footprint: { kind: 'comment-footprint' },
    support: { kind: 'comment-support' },
    admission: { kind: 'comment-admission' },
    appliedDigest: hashCanonicalJson({
      kind: 'intent',
      name: 'recordComment',
      args
    })
  };
}

test('canonical JSON sorts object keys and rejects unsupported values', () => {
  assert.equal(
    canonicalStringify({ z: 1, a: { b: true, a: 'first' } }),
    '{"a":{"a":"first","b":true},"z":1}'
  );

  assert.throws(
    () => canonicalStringify({ value: undefined }),
    (error) => error instanceof ContinuumConstructionError && error.code === 'undefined-field'
  );
  assert.throws(
    () => canonicalStringify({ value: -0 }),
    (error) => error instanceof ContinuumConstructionError && error.code === 'negative-zero'
  );
  assert.throws(
    () => canonicalStringify({ value: Number.POSITIVE_INFINITY }),
    (error) => error instanceof ContinuumConstructionError && error.code === 'non-finite-number'
  );
});

test('canonical digests are stable across object insertion order', () => {
  assert.equal(
    hashCanonicalJson({ b: 2, a: 1 }),
    hashCanonicalJson({ a: 1, b: 2 })
  );
});

test('revelation posture meet is dimension-wise minimum', () => {
  assert.deepEqual(
    meetRevelationPosture(
      { value: 'clear', proof: 'witness', transport: 'shareable' },
      { value: 'redacted', proof: 'receipt', transport: 'local' },
      { value: 'clear', proof: 'public-proof', transport: 'none' }
    ),
    { value: 'redacted', proof: 'receipt', transport: 'none' }
  );

  assert.throws(
    () => meetRevelationPosture({ value: 'clear', proof: 'bogus', transport: 'local' }),
    (error) => error instanceof ContinuumConstructionError && error.code === 'unknown-proof-posture'
  );
});

test('occurrence key digest is independent from applied intent digest', () => {
  const occurrence = makeOccurrenceRef({ issuer, localId: 'client-act:1' });
  const first = makeOccurredIntent(
    appliedIntent({ questId: 'quest:1', body: 'LGTM' }),
    occurrence
  );
  const retry = makeOccurredIntent(
    appliedIntent({ questId: 'quest:1', body: 'LGTM' }),
    occurrence
  );
  const conflict = makeOccurredIntent(
    appliedIntent({ questId: 'quest:1', body: 'Actually, no' }),
    occurrence
  );
  const secondAct = makeOccurredIntent(
    appliedIntent({ questId: 'quest:1', body: 'LGTM' }),
    makeOccurrenceRef({ issuer, localId: 'client-act:2' })
  );

  assert.equal(first.occurrence.occurrenceKeyDigest, retry.occurrence.occurrenceKeyDigest);
  assert.equal(first.occurrence.occurrenceKeyDigest, conflict.occurrence.occurrenceKeyDigest);
  assert.notEqual(first.occurredDigest, conflict.occurredDigest);
  assert.equal(compareOccurrenceBinding(first, retry), 'retry');
  assert.equal(compareOccurrenceBinding(first, conflict), 'occurrence-conflict');
  assert.equal(compareOccurrenceBinding(first, secondAct), 'separate-occurrence');
});

test('string occurrences must be expanded before core occurrence construction', () => {
  assert.throws(
    () => makeOccurredIntent(appliedIntent({ body: 'LGTM' }), 'client-act:1'),
    (error) => error instanceof ContinuumConstructionError && error.code === 'missing-occurrence-issuer'
  );
});

test('unwrapObserved returns observed values and throws with outcome otherwise', () => {
  assert.equal(
    unwrapObserved({
      kind: 'observed',
      observation: {
        value: 'quest name'
      }
    }),
    'quest name'
  );

  assert.throws(
    () => unwrapObserved({
      kind: 'obstruction',
      obstruction: { reason: 'unsupported-lawpack' }
    }),
    (error) => {
      assert.ok(error instanceof ContinuumObservationError);
      assert.equal(error.outcome.kind, 'obstruction');
      return true;
    }
  );
});

test('match helpers require exhaustive handlers', () => {
  assert.equal(
    matchObservation(
      { kind: 'observed', observation: { value: 42 } },
      {
        observed: ({ observation }) => observation.value,
        plural: () => 0,
        conflict: () => 0,
        obstruction: () => 0
      }
    ),
    42
  );

  assert.equal(
    matchAdmission(
      { kind: 'accepted', result: 'ok' },
      {
        accepted: ({ result }) => result,
        plural: () => 'plural',
        conflict: () => 'conflict',
        obstruction: () => 'obstruction'
      }
    ),
    'ok'
  );

  assert.throws(
    () => matchAdmission(
      { kind: 'accepted', result: 'ok' },
      {
        accepted: ({ result }) => result
      }
    ),
    (error) => error instanceof ContinuumConstructionError && error.code === 'missing-match-handler'
  );
});

test('validateDeclaration returns typed invalid construction results', () => {
  assert.deepEqual(
    validateDeclaration(appliedIntent({ body: 'LGTM' })),
    {
      kind: 'valid',
      value: appliedIntent({ body: 'LGTM' })
    }
  );

  const invalid = validateDeclaration({ kind: 'intent', args: { body: undefined } });
  assert.equal(invalid.kind, 'invalid');
  assert.equal(invalid.errors[0].code, 'invalid-digest');
});

import { createHash } from 'node:crypto';

const VALUE_ORDER = new Map([
  ['opaque', 0],
  ['redacted', 1],
  ['clear', 2]
]);

const PROOF_ORDER = new Map([
  ['none', 0],
  ['receipt', 1],
  ['public-proof', 2],
  ['witness', 3]
]);

const TRANSPORT_ORDER = new Map([
  ['none', 0],
  ['local', 1],
  ['shareable', 2]
]);

const VALUE_BY_ORDER = ['opaque', 'redacted', 'clear'];
const PROOF_BY_ORDER = ['none', 'receipt', 'public-proof', 'witness'];
const TRANSPORT_BY_ORDER = ['none', 'local', 'shareable'];

export class ContinuumConstructionError extends TypeError {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ContinuumConstructionError';
    this.code = options.code ?? 'invalid-continuum-value';
  }
}

export class ContinuumObservationError extends Error {
  constructor(outcome) {
    super(`Observation did not produce a value: ${outcome?.kind ?? 'unknown'}`);
    this.name = 'ContinuumObservationError';
    this.outcome = outcome;
  }

  toRedactedJson() {
    return redact(this.outcome);
  }
}

export function canonicalStringify(value) {
  return JSON.stringify(toCanonicalJson(value));
}

export function hashCanonicalJson(value) {
  return `sha256:${createHash('sha256').update(canonicalStringify(value)).digest('hex')}`;
}

export function toCanonicalJson(value) {
  if (value === null) {
    return null;
  }
  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    assertCanonicalNumber(value);
    return Object.is(value, -0) ? 0 : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toCanonicalJson(item));
  }
  if (typeof value === 'object') {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      throw new ContinuumConstructionError('Canonical JSON objects must be plain objects', {
        code: 'non-plain-object'
      });
    }
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => {
        const field = value[key];
        if (field === undefined) {
          throw new ContinuumConstructionError('Canonical JSON cannot contain undefined fields', {
            code: 'undefined-field'
          });
        }
        return [key, toCanonicalJson(field)];
      })
    );
  }
  throw new ContinuumConstructionError(`Unsupported canonical JSON value: ${typeof value}`, {
    code: 'unsupported-json-value'
  });
}

export function assertCanonicalJson(value) {
  toCanonicalJson(value);
}

export function assertCanonicalNumber(value) {
  if (!Number.isFinite(value)) {
    throw new ContinuumConstructionError('Canonical JSON numbers must be finite', {
      code: 'non-finite-number'
    });
  }
  if (Object.is(value, -0)) {
    throw new ContinuumConstructionError('Canonical JSON numbers must not be negative zero', {
      code: 'negative-zero'
    });
  }
}

export function meetRevelationPosture(...postures) {
  if (postures.length === 0) {
    throw new ContinuumConstructionError('meetRevelationPosture requires at least one posture', {
      code: 'missing-posture'
    });
  }
  for (const posture of postures) {
    validateRevelationPosture(posture);
  }
  return postures.reduce((left, right) => ({
    value: meetDimension('value', left.value, right.value, VALUE_ORDER, VALUE_BY_ORDER),
    proof: meetDimension('proof', left.proof, right.proof, PROOF_ORDER, PROOF_BY_ORDER),
    transport: meetDimension(
      'transport',
      left.transport,
      right.transport,
      TRANSPORT_ORDER,
      TRANSPORT_BY_ORDER
    )
  }));
}

export function compareRevelationPosture(left, right) {
  return {
    value: compareDimension('value', left.value, right.value, VALUE_ORDER),
    proof: compareDimension('proof', left.proof, right.proof, PROOF_ORDER),
    transport: compareDimension('transport', left.transport, right.transport, TRANSPORT_ORDER)
  };
}

export function makeOccurrenceRef({ issuer, localId }) {
  if (issuer == null || typeof issuer !== 'object') {
    throw new ContinuumConstructionError('Occurrence issuer must be an object ref', {
      code: 'invalid-occurrence-issuer'
    });
  }
  if (typeof localId !== 'string' || localId.length === 0) {
    throw new ContinuumConstructionError('Occurrence localId must be a non-empty string', {
      code: 'invalid-occurrence-local-id'
    });
  }
  const occurrenceKeyDigest = hashCanonicalJson({ issuer, localId });
  return {
    issuer: toCanonicalJson(issuer),
    localId,
    occurrenceKeyDigest
  };
}

export function makeOccurredIntent(intent, occurrence) {
  assertAppliedIntent(intent);
  const occurrenceRef = typeof occurrence === 'string'
    ? undefined
    : normalizeOccurrenceRef(occurrence);
  if (occurrenceRef == null) {
    throw new ContinuumConstructionError(
      'String occurrence ids must be expanded by a configured optic family before core occurrence construction',
      { code: 'missing-occurrence-issuer' }
    );
  }
  return {
    kind: 'occurred-intent',
    intent,
    occurrence: occurrenceRef,
    occurredDigest: hashCanonicalJson({
      occurrenceKeyDigest: occurrenceRef.occurrenceKeyDigest,
      appliedDigest: intent.appliedDigest
    })
  };
}

export function compareOccurrenceBinding(left, right) {
  const leftKey = left?.occurrence?.occurrenceKeyDigest;
  const rightKey = right?.occurrence?.occurrenceKeyDigest;
  const leftApplied = left?.intent?.appliedDigest;
  const rightApplied = right?.intent?.appliedDigest;
  if (leftKey !== rightKey) {
    return 'separate-occurrence';
  }
  if (leftApplied === rightApplied) {
    return 'retry';
  }
  return 'occurrence-conflict';
}

export function unwrapObserved(outcome) {
  if (outcome?.kind === 'observed') {
    return outcome.observation.value;
  }
  throw new ContinuumObservationError(outcome);
}

export function matchObservation(outcome, handlers) {
  assertHandlers('observation', handlers, ['observed', 'plural', 'conflict', 'obstruction']);
  return handlers[outcome.kind](outcome);
}

export function matchAdmission(outcome, handlers) {
  assertHandlers('admission', handlers, ['accepted', 'plural', 'conflict', 'obstruction']);
  return handlers[outcome.kind](outcome);
}

export function redact(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redact(item));
  }
  if (typeof value !== 'object') {
    return value;
  }
  const output = {};
  for (const [key, field] of Object.entries(value)) {
    if (key === 'proof' || key === 'transport' || key === 'witnessDebt') {
      output[key] = '[redacted]';
    } else {
      output[key] = redact(field);
    }
  }
  return output;
}

export function validateDeclaration(declaration) {
  try {
    if (declaration?.kind === 'reading') {
      assertAppliedReading(declaration);
      return { kind: 'valid', value: declaration };
    }
    if (declaration?.kind === 'intent') {
      assertAppliedIntent(declaration);
      return { kind: 'valid', value: declaration };
    }
    throw new ContinuumConstructionError('Declaration kind must be reading or intent', {
      code: 'invalid-declaration-kind'
    });
  } catch (error) {
    return {
      kind: 'invalid',
      errors: [toConstructionError(error)]
    };
  }
}

function assertAppliedReading(reading) {
  if (reading?.kind !== 'reading') {
    throw new ContinuumConstructionError('Applied reading kind must be "reading"', {
      code: 'invalid-reading-kind'
    });
  }
  assertDigest(reading.appliedDigest, 'applied reading');
  assertCanonicalJson(reading.args);
}

function assertAppliedIntent(intent) {
  if (intent?.kind !== 'intent') {
    throw new ContinuumConstructionError('Applied intent kind must be "intent"', {
      code: 'invalid-intent-kind'
    });
  }
  assertDigest(intent.appliedDigest, 'applied intent');
  assertCanonicalJson(intent.args);
}

function normalizeOccurrenceRef(occurrence) {
  const ref = makeOccurrenceRef({
    issuer: occurrence.issuer,
    localId: occurrence.localId
  });
  if (
    occurrence.occurrenceKeyDigest != null &&
    occurrence.occurrenceKeyDigest !== ref.occurrenceKeyDigest
  ) {
    throw new ContinuumConstructionError('Occurrence key digest does not match issuer/localId', {
      code: 'occurrence-key-digest-mismatch'
    });
  }
  return ref;
}

function assertDigest(value, label) {
  if (typeof value !== 'string' || !value.startsWith('sha256:')) {
    throw new ContinuumConstructionError(`${label} digest must be a sha256 digest`, {
      code: 'invalid-digest'
    });
  }
}

function meetDimension(name, left, right, order, byOrder) {
  const leftRank = rankDimension(name, left, order);
  const rightRank = rankDimension(name, right, order);
  return byOrder[Math.min(leftRank, rightRank)];
}

function compareDimension(name, left, right, order) {
  return rankDimension(name, left, order) - rankDimension(name, right, order);
}

function rankDimension(name, value, order) {
  const rank = order.get(value);
  if (rank == null) {
    throw new ContinuumConstructionError(`Unknown ${name} posture value: ${value}`, {
      code: `unknown-${name}-posture`
    });
  }
  return rank;
}

function validateRevelationPosture(posture) {
  rankDimension('value', posture?.value, VALUE_ORDER);
  rankDimension('proof', posture?.proof, PROOF_ORDER);
  rankDimension('transport', posture?.transport, TRANSPORT_ORDER);
}

function assertHandlers(label, handlers, kinds) {
  if (handlers == null || typeof handlers !== 'object') {
    throw new ContinuumConstructionError(`${label} match handlers must be an object`, {
      code: 'invalid-match-handlers'
    });
  }
  for (const kind of kinds) {
    if (typeof handlers[kind] !== 'function') {
      throw new ContinuumConstructionError(`${label} match handler missing "${kind}"`, {
        code: 'missing-match-handler'
      });
    }
  }
}

function toConstructionError(error) {
  if (error instanceof ContinuumConstructionError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message
    };
  }
  return {
    name: error?.name ?? 'Error',
    code: 'unknown-construction-error',
    message: error?.message ?? String(error)
  };
}

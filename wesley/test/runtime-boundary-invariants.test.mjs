import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Kind, parse } from '../support/wesley-deps.mjs';

const BUNDLE_LINKS_INVARIANT_NAME = 'bundle_links_source_shell';

test('bundle_links_source_shell must not equate target frontier to source suffix worldline', async () => {
  const schemaContent = await readFile('schemas/continuum-runtime-boundary-family.graphql', 'utf8');
  const match = schemaContent.match(
    /name:\s*"bundle_links_source_shell"[\s\S]*?expr:\s*"([^"]+)"/u
  );

  assert.ok(match, `${BUNDLE_LINKS_INVARIANT_NAME} invariant block must be present`);
  const expression = match[1];

  assert.equal(
    expression.includes('b.targetFrontier.worldlineId == b.sourceSuffix.sourceWorldlineId'),
    false,
    `${BUNDLE_LINKS_INVARIANT_NAME} must not pin target frontier worldline to source suffix worldline`
  );

  assert.match(
    expression,
    /b\.baseFrontier\.worldlineId\s*==\s*b\.sourceSuffix\.sourceWorldlineId/,
    'bundle source frontier should remain bound to source suffix worldline'
  );
});

test('reading envelopes must distinguish native and translated evidence status', async () => {
  const schemaContent = await readFile('schemas/continuum-runtime-boundary-family.graphql', 'utf8');
  const document = parse(schemaContent, { noLocation: true });
  const definitionsByName = new Map(
    document.definitions
      .filter((definition) => definition.name?.value)
      .map((definition) => [definition.name.value, definition])
  );

  const readingEnvelope = definitionsByName.get('ReadingEnvelope');
  assert.equal(readingEnvelope?.kind, Kind.OBJECT_TYPE_DEFINITION);
  assert.equal(
    fieldTypeName(readingEnvelope, 'evidenceStatus'),
    'ContinuumEvidenceStatus',
    'ReadingEnvelope must expose explicit evidence status'
  );

  const status = definitionsByName.get('ContinuumEvidenceStatus');
  assert.equal(status?.kind, Kind.UNION_TYPE_DEFINITION);
  assert.deepEqual(
    status.types.map((type) => type.name.value).sort(),
    ['ContinuumNativeEvidence', 'TranslatedSubstrateEvidence'],
    'ContinuumEvidenceStatus must separate native witnesshood from compatibility evidence'
  );

  const nativeEvidence = definitionsByName.get('ContinuumNativeEvidence');
  assert.equal(nativeEvidence?.kind, Kind.OBJECT_TYPE_DEFINITION);
  assert.equal(fieldTypeName(nativeEvidence, 'witness'), 'WitnessedSuffixShell');

  const translatedEvidence = definitionsByName.get('TranslatedSubstrateEvidence');
  assert.equal(translatedEvidence?.kind, Kind.OBJECT_TYPE_DEFINITION);
  assert.equal(fieldTypeName(translatedEvidence, 'substrate'), 'String');
  assert.equal(fieldTypeName(translatedEvidence, 'evidenceKind'), 'String');
  assert.equal(fieldTypeName(translatedEvidence, 'evidenceDigest'), 'Hash');
  assert.equal(fieldTypeName(translatedEvidence, 'nativeContinuumWitness'), 'Boolean');

  const invariant = schemaContent.match(
    /name:\s*"translated_evidence_cannot_claim_native_witness"[\s\S]*?expr:\s*"([^"]+)"/u
  );
  assert.ok(invariant, 'translated evidence invariant must be present');
  assert.match(
    invariant[1],
    /e\.nativeContinuumWitness\s*==\s*false/u,
    'translated evidence must be unable to claim native Continuum witnesshood'
  );
});

function fieldTypeName(objectDefinition, fieldName) {
  const field = objectDefinition.fields.find((candidate) => candidate.name.value === fieldName);

  assert.ok(field, `${objectDefinition.name.value}.${fieldName} must exist`);

  return namedType(field.type).name.value;
}

function namedType(type) {
  if (type.kind === Kind.NAMED_TYPE) {
    return type;
  }

  return namedType(type.type);
}

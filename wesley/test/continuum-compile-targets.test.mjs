import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { runBundleEcho, runCompileTtd } from '../support/continuum-compile-targets.mjs';

test('Echo inspect TypeScript preserves named GraphQL enum references', async () => {
  const writes = new Map();
  const schemaContent = await readFile('schemas/continuum-receipt-family.graphql', 'utf8');

  await runBundleEcho({
    ctx: {
      crypto: {
        sha256: (value) => createHash('sha256').update(value).digest('hex'),
        sha256Bytes: (value) => createHash('sha256').update(value).digest()
      },
      clock: {
        now: () => new Date('2026-05-04T00:00:00.000Z')
      },
      fs: {
        write: async (filePath, content) => {
          writes.set(filePath, content);
        }
      }
    },
    schemaContent,
    schemaPath: 'schemas/continuum-receipt-family.graphql',
    outDir: 'out/echo'
  });

  const schemas = writes.get('out/echo/schemas.generated.ts');
  assert.match(schemas, /outcome: DeliveryOutcome;/);
  assert.match(schemas, /executionMode: ExecutionMode;/);
  assert.match(schemas, /receiptId: string;/);
});

test('Echo inspect TypeScript preserves runtime-boundary evidence status union', async () => {
  const writes = new Map();
  const schemaContent = await readFile('schemas/continuum-runtime-boundary-family.graphql', 'utf8');

  await runBundleEcho({
    ctx: {
      crypto: {
        sha256: (value) => createHash('sha256').update(value).digest('hex'),
        sha256Bytes: (value) => createHash('sha256').update(value).digest()
      },
      clock: {
        now: () => new Date('2026-05-15T00:00:00.000Z')
      },
      fs: {
        write: async (filePath, content) => {
          writes.set(filePath, content);
        }
      }
    },
    schemaContent,
    schemaPath: 'schemas/continuum-runtime-boundary-family.graphql',
    outDir: 'out/echo'
  });

  const ir = JSON.parse(writes.get('out/echo/ir.json'));
  const union = ir.types.find((type) => type.name === 'ContinuumEvidenceStatus');

  assert.deepEqual(
    union,
    {
      name: 'ContinuumEvidenceStatus',
      kind: 'UNION',
      variants: ['ContinuumNativeEvidence', 'TranslatedSubstrateEvidence']
    }
  );

  const schemas = writes.get('out/echo/schemas.generated.ts');
  assert.match(
    schemas,
    /export type ContinuumEvidenceStatus = ContinuumNativeEvidence \| TranslatedSubstrateEvidence;/
  );
  assert.match(schemas, /evidenceStatus: ContinuumEvidenceStatus;/);
});

test('TTD TypeScript generation preserves runtime-boundary evidence status union', async () => {
  const writes = new Map();
  const schemaContent = await readFile('schemas/continuum-runtime-boundary-family.graphql', 'utf8');

  await runCompileTtd({
    ctx: {
      crypto: {
        sha256: (value) => createHash('sha256').update(value).digest('hex'),
        sha256Bytes: (value) => createHash('sha256').update(value).digest()
      },
      clock: {
        now: () => new Date('2026-05-15T00:00:00.000Z')
      },
      fs: {
        write: async (filePath, content) => {
          writes.set(filePath, content);
        }
      }
    },
    schemaContent,
    schemaPath: 'schemas/continuum-runtime-boundary-family.graphql',
    outDir: 'out/ttd',
    emitTargets: ['typescript']
  });

  const types = writes.get('out/ttd/typescript/types.ts');
  assert.match(
    types,
    /export type ContinuumEvidenceStatus = ContinuumNativeEvidence \| TranslatedSubstrateEvidence;/
  );
  assert.match(types, /evidenceStatus: ContinuumEvidenceStatus;/);

  const zod = writes.get('out/ttd/typescript/zod.ts');
  assert.match(
    zod,
    /export const ContinuumEvidenceStatusSchema = z\.union\(\[z\.lazy\(\(\) => ContinuumNativeEvidenceSchema\), z\.lazy\(\(\) => TranslatedSubstrateEvidenceSchema\)\]\);/
  );
});

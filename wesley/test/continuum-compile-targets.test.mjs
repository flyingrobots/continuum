import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { runBundleEcho } from '../support/continuum-compile-targets.mjs';

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

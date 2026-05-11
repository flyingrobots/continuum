import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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

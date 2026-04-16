import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile
} from 'node:fs/promises';

import { initWarp } from '../src/init.mjs';

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

test('initWarp scaffolds the template, materializes families, and writes warpspace.toml', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.join(templateFiles, 'packages', 'demo-web', 'src'), { recursive: true });
    await mkdir(path.join(templateFiles, 'crates', 'demo-contracts', 'src'), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeFile(
      templatePath,
      JSON.stringify({
        kind: 'warpspace.template.v1',
        id: 'demo-web-rust-v1',
        directories: [
          '.warpspace/packages',
          '.warpspace/cache',
          '.warpspace/downloads',
          'contracts/continuum',
          'packages/demo-web/src',
          'crates/demo-contracts/src'
        ],
        copyFilesFrom: 'files'
      }, null, 2) + '\n',
      'utf8'
    );
    await writeFile(path.join(templateFiles, '.gitignore'), '.warpspace/\n', 'utf8');
    await writeFile(path.join(templateFiles, 'README.md'), '# __PROJECT_NAME__\n', 'utf8');
    await writeFile(path.join(templateFiles, 'package.json'), '{ "name": "__PROJECT_NAME__" }\n', 'utf8');
    await writeFile(path.join(templateFiles, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n', 'utf8');
    await writeFile(path.join(templateFiles, 'Cargo.toml'), '[workspace]\n', 'utf8');
    await writeFile(path.join(templateFiles, 'packages', 'demo-web', 'package.json'), '{ "name": "__PROJECT_NAME__-web" }\n', 'utf8');
    await writeFile(path.join(templateFiles, 'packages', 'demo-web', 'src', 'index.ts'), 'export const ok = true;\n', 'utf8');
    await writeFile(path.join(templateFiles, 'crates', 'demo-contracts', 'Cargo.toml'), '[package]\nname = "demo-contracts"\nversion = "0.1.0"\n', 'utf8');
    await writeFile(path.join(templateFiles, 'crates', 'demo-contracts', 'src', 'lib.rs'), 'pub const OK: bool = true;\n', 'utf8');

    await writeFile(
      manifestPath,
      JSON.stringify({
        kind: 'continuum.stack-release.v1',
        profile: 'demo',
        releaseId: 'demo-test',
        families: [
          {
            id: 'continuum-neighborhood-core-family',
            version: '0.1.0',
            sourcePath: 'schemas/continuum-neighborhood-core-family.graphql',
            sha256: sha256(schemaContent),
            materializeTo: 'contracts/continuum/continuum-neighborhood-core-family.graphql',
            defaultProjections: ['typescript', 'zod']
          }
        ],
        toolchain: {
          wesley: {
            package: '@wesley/host-node',
            version: '0.1.0'
          }
        },
        runtimes: {
          echo: {
            participation: 'active'
          },
          'git-warp': {
            participation: 'pinned-not-materialized'
          },
          'warp-ttd': {
            participation: 'active'
          }
        },
        bootstrap: {
          tool: 'warp',
          command: 'warp init my-app --profile demo',
          template: {
            id: 'demo-web-rust-v1',
            artifactPath: 'apps/warp/templates/demo-web-rust/template.json'
          },
          contractsRoot: 'contracts/continuum',
          installLayout: {
            root: '.warpspace',
            packages: '.warpspace/packages',
            cache: '.warpspace/cache',
            downloads: '.warpspace/downloads'
          },
          defaultOutputs: {
            typescript: 'packages/demo-web/src/generated/continuum/neighborhood-core',
            zod: 'packages/demo-web/src/generated/continuum/neighborhood-core/zod'
          }
        }
      }, null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      generate: false,
      now: () => new Date('2026-04-15T21:35:00.000Z')
    });

    assert.equal(result.generated, 'skipped-by-flag');

    const config = await readFile(path.join(projectDir, 'warpspace.toml'), 'utf8');
    assert.match(config, /profile = "demo"/);
    assert.match(config, /template = "demo-web-rust-v1"/);

    const lock = JSON.parse(await readFile(path.join(projectDir, 'warpspace.lock.json'), 'utf8'));
    assert.equal(lock.kind, 'warpspace.lock.v2');
    assert.equal(lock.bootstrap.tool, 'warp');

    const materialized = await readFile(
      path.join(projectDir, 'contracts', 'continuum', 'continuum-neighborhood-core-family.graphql'),
      'utf8'
    );
    assert.equal(materialized, schemaContent);

    const readme = await readFile(path.join(projectDir, 'README.md'), 'utf8');
    assert.match(readme, /# app/);

    const internalReadme = await readFile(path.join(projectDir, '.warpspace', 'README.md'), 'utf8');
    assert.match(internalReadme, /Managed WARPspace State/);

    const wesleyBridge = await readFile(path.join(projectDir, '.warpspace.wesley.mjs'), 'utf8');
    assert.match(wesleyBridge, /wesley\.warpspace\.v1/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp can hand off generation to Wesley when a binary is configured', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const invocations = [];

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.join(templateFiles, 'packages', 'demo-web', 'src'), { recursive: true });
    await mkdir(path.join(templateFiles, 'crates', 'demo-contracts', 'src'), { recursive: true });

    await writeFile(schemaPath, 'type Query { ok: Boolean! }\n', 'utf8');
    await writeFile(
      templatePath,
      JSON.stringify({
        kind: 'warpspace.template.v1',
        id: 'demo-web-rust-v1',
        directories: ['contracts/continuum'],
        copyFilesFrom: 'files'
      }, null, 2) + '\n',
      'utf8'
    );
    await writeFile(path.join(templateFiles, 'README.md'), '# __PROJECT_NAME__\n', 'utf8');
    await writeFile(path.join(templateFiles, 'package.json'), '{ "name": "__PROJECT_NAME__" }\n', 'utf8');
    await writeFile(path.join(templateFiles, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n', 'utf8');
    await writeFile(path.join(templateFiles, 'Cargo.toml'), '[workspace]\n', 'utf8');

    await writeFile(
      manifestPath,
      JSON.stringify({
        kind: 'continuum.stack-release.v1',
        profile: 'demo',
        releaseId: 'demo-test',
        families: [
          {
            id: 'continuum-neighborhood-core-family',
            version: '0.1.0',
            sourcePath: 'schemas/continuum-neighborhood-core-family.graphql',
            materializeTo: 'contracts/continuum/continuum-neighborhood-core-family.graphql',
            defaultProjections: ['typescript', 'zod', 'echo-ir', 'warp-ttd']
          }
        ],
        bootstrap: {
          tool: 'warp',
          command: 'warp init my-app --profile demo',
          template: {
            id: 'demo-web-rust-v1',
            artifactPath: 'apps/warp/templates/demo-web-rust/template.json'
          },
          contractsRoot: 'contracts/continuum',
          defaultOutputs: {
            typescript: 'packages/demo-web/src/generated/continuum/neighborhood-core',
            zod: 'packages/demo-web/src/generated/continuum/neighborhood-core/zod',
            'echo-ir': 'crates/demo-contracts/src/generated/echo/neighborhood-core',
            'warp-ttd': 'packages/demo-web/src/generated/warp-ttd/neighborhood-core'
          }
        }
      }, null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      wesleyBin: '/tmp/wesley.mjs',
      runCommand: async ({ command, args, cwd }) => {
        invocations.push({ command, args, cwd });
        return {
          status: 0,
          stdout: '',
          stderr: ''
        };
      }
    });

    assert.equal(result.generated, 'completed');
    assert.equal(invocations.length, 4);
    assert.ok(invocations.every(call => call.args.includes('--warpspace')));
    assert.deepEqual(
      invocations.map(call => call.args.slice(0, 2)),
      [
        ['/tmp/wesley.mjs', 'typescript'],
        ['/tmp/wesley.mjs', 'zod'],
        ['/tmp/wesley.mjs', 'bundle-echo'],
        ['/tmp/wesley.mjs', 'compile-ttd']
      ]
    );
    assert.ok(invocations.every(call => call.command === 'node'));
    assert.ok(invocations.every(call => call.cwd === projectDir));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { access, chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { initWarp } from '../src/init.mjs';

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function writeTemplateFixture({ templatePath, templateFiles }) {
  await mkdir(path.join(templateFiles, 'packages', 'demo-web', 'src'), { recursive: true });
  await mkdir(path.join(templateFiles, 'crates', 'demo-contracts', 'src'), { recursive: true });

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
}

function buildBaseManifest({
  schemaContent,
  projections = ['typescript', 'zod'],
  packageSources = undefined,
  nodeToolchain,
  wesleyToolchain = {},
  wesleyInstall
}) {
  const manifest = {
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
        defaultProjections: projections
      }
    ],
    toolchain: {
      node: nodeToolchain,
      wesley: {
        package: '@wesley/host-node',
        version: '0.1.0',
        ...wesleyToolchain,
        install: wesleyInstall
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
      tool: 'qw',
      command: 'qw init my-app --profile demo',
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
        zod: 'packages/demo-web/src/generated/continuum/neighborhood-core/zod',
        'echo-ir': 'crates/demo-contracts/src/generated/echo/neighborhood-core',
        'warp-ttd': 'packages/demo-web/src/generated/warp-ttd/neighborhood-core'
      }
    }
  };

  if (packageSources != null) {
    manifest.packageSources = packageSources;
  }

  return manifest;
}

test('initWarp scaffolds the template, materializes families, and writes warpspace.toml', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const wesleyRoot = path.join(tempDir, 'wesley');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const wesleyEntrypoint = path.join(wesleyRoot, 'packages', 'wesley-host-node', 'bin', 'wesley.mjs');
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.dirname(wesleyEntrypoint), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeFile(wesleyEntrypoint, 'export const ok = true;\n', 'utf8');
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        nodeToolchain: {
          runtime: 'node',
          source: 'system',
          versionRange: '>=22.0.0',
          managedPath: '.warpspace/packages/node/current/bin/node'
        },
        wesleyInstall: {
          source: 'local-sibling-entrypoint',
          path: '../wesley/packages/wesley-host-node/bin/wesley.mjs',
          managedPath: '.warpspace/packages/wesley/current/bin/wesley.mjs'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const readmePath = path.join(projectDir, 'README.md');
    const internalReadmePath = path.join(projectDir, '.warpspace', 'README.md');
    await assert.rejects(access(readmePath));
    await assert.rejects(access(internalReadmePath));

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
    assert.match(config, /node_source = "system"/);

    const lock = JSON.parse(await readFile(path.join(projectDir, 'warpspace.lock.json'), 'utf8'));
    assert.equal(lock.kind, 'warpspace.lock.v2');
    assert.equal(lock.bootstrap.tool, 'qw');
    assert.equal(lock.toolchain.node.source, 'system');
    assert.equal(lock.toolchain.wesley.source, 'local-sibling-entrypoint');

    const materialized = await readFile(
      path.join(projectDir, 'contracts', 'continuum', 'continuum-neighborhood-core-family.graphql'),
      'utf8'
    );
    assert.equal(materialized, schemaContent);

    await assert.doesNotReject(access(readmePath));
    await assert.doesNotReject(access(internalReadmePath));
    assert.equal(lock.engineLocal, undefined);
    assert.equal(lock.bootstrap.wesleyWarpspaceBridgePath, undefined);

    const stagedNodeReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'node', 'current', 'bin', 'install-receipt.json'), 'utf8')
    );
    assert.equal(stagedNodeReceipt.tool, 'node');

    const stagedWesleyReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'install-receipt.json'), 'utf8')
    );
    assert.equal(stagedWesleyReceipt.tool, 'wesley');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp can hand off generation through staged node and Wesley toolchain paths', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const wesleyRoot = path.join(tempDir, 'wesley');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const wesleyEntrypoint = path.join(wesleyRoot, 'packages', 'wesley-host-node', 'bin', 'wesley.mjs');
  const invocations = [];
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.dirname(wesleyEntrypoint), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeFile(wesleyEntrypoint, 'export const ok = true;\n', 'utf8');
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript', 'zod', 'echo-ir', 'warp-ttd'],
        nodeToolchain: {
          runtime: 'node',
          source: 'system',
          versionRange: '>=22.0.0',
          managedPath: '.warpspace/packages/node/current/bin/node'
        },
        wesleyInstall: {
          source: 'local-sibling-entrypoint',
          path: '../wesley/packages/wesley-host-node/bin/wesley.mjs',
          managedPath: '.warpspace/packages/wesley/current/bin/wesley.mjs'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      runCommand: async ({ command, args, cwd, env }) => {
        invocations.push({ command, args, cwd, env });
        return {
          status: 0,
          stdout: '',
          stderr: ''
        };
      }
    });

    assert.equal(result.generated, 'completed');
    assert.equal(invocations.length, 4);
    assert.ok(invocations.every(call => !call.args.includes('--warpspace')));
    assert.ok(invocations.every(call => call.command.endsWith(path.join('.warpspace', 'packages', 'node', 'current', 'bin', 'node'))));
    assert.deepEqual(
      invocations.map(call => call.args.slice(0, 2)),
      [
        [
          path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley.mjs'),
          'typescript'
        ],
        [
          path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley.mjs'),
          'zod'
        ],
        [
          path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley.mjs'),
          'compile'
        ],
        [
          path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley.mjs'),
          'compile'
        ]
      ]
    );
    assert.equal(invocations[0].args.at(-3), '--out-file');
    assert.equal(
      invocations[0].args.at(-2),
      'packages/demo-web/src/generated/continuum/neighborhood-core/types.generated.ts'
    );
    assert.equal(invocations[1].args.at(-3), '--out-file');
    assert.equal(
      invocations[1].args.at(-2),
      'packages/demo-web/src/generated/continuum/neighborhood-core/zod/zod.generated.ts'
    );
    assert.deepEqual(
      invocations[2].args.slice(2),
      [
        '--schema',
        'contracts/continuum/continuum-neighborhood-core-family.graphql',
        '--target',
        'echo',
        '--out-dir',
        'crates/demo-contracts/src/generated/echo/neighborhood-core',
        '--json'
      ]
    );
    assert.deepEqual(
      invocations[3].args.slice(2),
      [
        '--schema',
        'contracts/continuum/continuum-neighborhood-core-family.graphql',
        '--target',
        'warp-ttd',
        '--out-dir',
        'packages/demo-web/src/generated/warp-ttd/neighborhood-core',
        '--json'
      ]
    );
    assert.equal(invocations[0].env, undefined);
    assert.equal(invocations[1].env, undefined);
    assert.deepEqual(invocations[2].env, {
      WESLEY_MODULES: path.join(authorityRoot, 'wesley', 'continuum-cli-module.mjs')
    });
    assert.deepEqual(invocations[3].env, {
      WESLEY_MODULES: path.join(authorityRoot, 'wesley', 'continuum-cli-module.mjs')
    });
    assert.ok(invocations.every(call => call.cwd === projectDir));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp can stage and invoke a native Rust Wesley binary', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const wesleyRoot = path.join(tempDir, 'wesley');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const wesleyBinary = path.join(wesleyRoot, 'target', 'debug', 'wesley');
  const invocations = [];
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.dirname(wesleyBinary), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeFile(wesleyBinary, '#!/bin/sh\nexit 0\n', 'utf8');
    await chmod(wesleyBinary, 0o755);
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript'],
        nodeToolchain: {
          runtime: 'node',
          source: 'system',
          versionRange: '>=22.0.0',
          managedPath: '.warpspace/packages/node/current/bin/node'
        },
        wesleyToolchain: {
          package: 'wesley-cli',
          commandSet: 'native-rust'
        },
        wesleyInstall: {
          source: 'local-sibling-binary',
          path: '../wesley/target/debug/wesley',
          managedPath: '.warpspace/packages/wesley/current/bin/wesley'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      runCommand: async ({ command, args, cwd, env }) => {
        invocations.push({ command, args, cwd, env });
        return {
          status: 0,
          stdout: '',
          stderr: ''
        };
      }
    });

    assert.equal(result.generated, 'completed');
    assert.equal(result.toolchain.node, null);
    assert.equal(result.toolchain.wesley.source, 'local-sibling-binary');
    assert.equal(result.toolchain.wesley.runner, 'native-binary');
    assert.equal(result.toolchain.wesley.commandSet, 'native-rust');
    assert.equal(invocations.length, 1);
    assert.equal(
      invocations[0].command,
      path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley')
    );
    assert.deepEqual(invocations[0].args, [
      'emit',
      'typescript',
      '--schema',
      'contracts/continuum/continuum-neighborhood-core-family.graphql',
      '--out',
      'packages/demo-web/src/generated/continuum/neighborhood-core/types.generated.ts'
    ]);
    assert.equal(invocations[0].env, undefined);
    assert.equal(invocations[0].cwd, projectDir);

    const config = await readFile(path.join(projectDir, 'warpspace.toml'), 'utf8');
    assert.match(config, /wesley_runner = "native-binary"/);
    assert.match(config, /wesley_command_set = "native-rust"/);

    const stagedWesleyReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'install-receipt.json'), 'utf8')
    );
    assert.equal(stagedWesleyReceipt.runner, 'native-binary');
    assert.equal(stagedWesleyReceipt.commandSet, 'native-rust');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp can install node and Wesley from a local-packages source site', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const projectDir = path.join(tempDir, 'app');
  const localPackagesRoot = path.join(authorityRoot, 'test-fixtures', 'local-packages');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const invocations = [];
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeLocalPackageSource({
      localPackagesRoot,
      packageName: 'node',
      version: '25.9.0',
      variant: 'host',
      entrypoint: 'bin/node',
      files: {
        'bin/node': '#!/bin/sh\nexit 0\n'
      }
    });
    await writeLocalPackageSource({
      localPackagesRoot,
      packageName: 'wesley-host-node',
      version: '0.1.0',
      variant: 'universal',
      entrypoint: 'bin/wesley.mjs',
      files: {
        'bin/wesley.mjs': 'export const ok = true;\n'
      }
    });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript', 'zod', 'echo-ir', 'warp-ttd'],
        packageSources: {
          testLocalPackages: {
            kind: 'local-packages',
            rootPath: 'test-fixtures/local-packages'
          }
        },
        nodeToolchain: {
          runtime: 'node',
          source: 'package-source',
          versionRange: '>=22.0.0',
          package: 'node',
          version: '25.9.0',
          variant: 'host',
          sourceSite: 'testLocalPackages',
          managedPath: '.warpspace/packages/node/current'
        },
        wesleyInstall: {
          source: 'package-source',
          sourceSite: 'testLocalPackages',
          package: 'wesley-host-node',
          version: '0.1.0',
          variant: 'universal',
          managedPath: '.warpspace/packages/wesley/current'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      runCommand: async ({ command, args, cwd, env }) => {
        invocations.push({ command, args, cwd, env });
        return {
          status: 0,
          stdout: '',
          stderr: ''
        };
      }
    });

    assert.equal(result.generated, 'completed');
    assert.equal(result.toolchain.node.source, 'package-source');
    assert.equal(result.toolchain.wesley.source, 'package-source');
    assert.equal(invocations.length, 4);
    assert.ok(invocations.every(call => call.command === path.join(projectDir, '.warpspace', 'packages', 'node', 'current', 'bin', 'node')));
    assert.deepEqual(
      invocations.map(call => call.args[0]),
      Array(4).fill(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley.mjs'))
    );
    assert.ok(invocations.every(call => !call.args.includes('--warpspace')));
    assert.deepEqual(invocations.slice(2).map(call => call.args[1]), ['compile', 'compile']);
    assert.deepEqual(invocations.slice(2).map(call => call.args[4]), ['--target', '--target']);
    assert.deepEqual(invocations.slice(2).map(call => call.args[5]), ['echo', 'warp-ttd']);

    const nodeReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'node', 'current', 'install-receipt.json'), 'utf8')
    );
    assert.equal(nodeReceipt.sourceSite, 'testLocalPackages');
    assert.equal(nodeReceipt.package, 'node');

    const wesleyReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'install-receipt.json'), 'utf8')
    );
    assert.equal(wesleyReceipt.sourceSite, 'testLocalPackages');
    assert.equal(wesleyReceipt.package, 'wesley-host-node');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp can install and invoke native Rust Wesley from a package source', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const projectDir = path.join(tempDir, 'app');
  const localPackagesRoot = path.join(authorityRoot, 'test-fixtures', 'local-packages');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const invocations = [];
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });

    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeLocalPackageSource({
      localPackagesRoot,
      packageName: 'node',
      version: '25.9.0',
      variant: 'host',
      entrypoint: 'bin/node',
      files: {
        'bin/node': '#!/bin/sh\nexit 0\n'
      }
    });
    await writeLocalPackageSource({
      localPackagesRoot,
      packageName: 'wesley-cli',
      version: '0.1.0',
      variant: 'host',
      entrypoint: 'bin/wesley',
      files: {
        'bin/wesley': '#!/bin/sh\nexit 0\n'
      }
    });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript'],
        packageSources: {
          testLocalPackages: {
            kind: 'local-packages',
            rootPath: 'test-fixtures/local-packages'
          }
        },
        nodeToolchain: {
          runtime: 'node',
          source: 'package-source',
          versionRange: '>=22.0.0',
          package: 'node',
          version: '25.9.0',
          variant: 'host',
          sourceSite: 'testLocalPackages',
          managedPath: '.warpspace/packages/node/current'
        },
        wesleyToolchain: {
          package: 'wesley-cli',
          commandSet: 'native-rust'
        },
        wesleyInstall: {
          source: 'package-source',
          runner: 'native-binary',
          sourceSite: 'testLocalPackages',
          package: 'wesley-cli',
          version: '0.1.0',
          variant: 'host',
          managedPath: '.warpspace/packages/wesley/current'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      runCommand: async ({ command, args, cwd, env }) => {
        invocations.push({ command, args, cwd, env });
        return {
          status: 0,
          stdout: '',
          stderr: ''
        };
      }
    });

    assert.equal(result.toolchain.wesley.source, 'package-source');
    assert.equal(result.toolchain.node, null);
    assert.equal(result.toolchain.wesley.runner, 'native-binary');
    assert.equal(result.toolchain.wesley.commandSet, 'native-rust');
    assert.equal(invocations.length, 1);
    assert.equal(
      invocations[0].command,
      path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley')
    );
    assert.deepEqual(invocations[0].args, [
      'emit',
      'typescript',
      '--schema',
      'contracts/continuum/continuum-neighborhood-core-family.graphql',
      '--out',
      'packages/demo-web/src/generated/continuum/neighborhood-core/types.generated.ts'
    ]);

    const wesleyReceipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'install-receipt.json'), 'utf8')
    );
    assert.equal(wesleyReceipt.package, 'wesley-cli');
    assert.equal(wesleyReceipt.runner, 'native-binary');
    assert.equal(wesleyReceipt.commandSet, 'native-rust');

    const config = await readFile(path.join(projectDir, 'warpspace.toml'), 'utf8');
    assert.match(config, /wesley_runner = "native-binary"/);
    assert.match(config, /wesley_command_set = "native-rust"/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

async function writeLocalPackageSource({
  localPackagesRoot,
  packageName,
  version,
  variant,
  entrypoint,
  files
}) {
  const packageRoot = path.join(localPackagesRoot, packageName, version);
  const payloadRoot = path.join(packageRoot, 'payload');
  await mkdir(payloadRoot, { recursive: true });

  for (const [relativePath, content] of Object.entries(files)) {
    const targetPath = path.join(payloadRoot, relativePath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content, 'utf8');
    if (relativePath.endsWith('/node') || relativePath.endsWith('/wesley') || relativePath.endsWith('.sh')) {
      await chmod(targetPath, 0o755);
    }
  }

  await writeFile(
    path.join(packageRoot, 'manifest.json'),
    JSON.stringify({
      kind: 'warp.package.v1',
      package: packageName,
      version,
      variants: {
        [variant]: {
          path: 'payload',
          entrypoint
        }
      }
    }, null, 2) + '\n',
    'utf8'
  );
}

test('initWarp resolves a crates.io-installed Wesley (crate source) and invokes it natively', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warp-init-'));
  const authorityRoot = path.join(tempDir, 'continuum');
  const projectDir = path.join(tempDir, 'app');
  const schemaPath = path.join(authorityRoot, 'schemas', 'continuum-neighborhood-core-family.graphql');
  const manifestPath = path.join(authorityRoot, 'docs', 'releases', 'demo', 'continuum-stack-release.json');
  const templatePath = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'template.json');
  const templateFiles = path.join(authorityRoot, 'apps', 'warp', 'templates', 'demo-web-rust', 'files');
  const resolvedWesley = path.join(tempDir, 'cargo-bin', 'wesley');
  const invocations = [];
  const resolveCalls = [];
  const schemaContent = 'type Query { ok: Boolean! }\n';

  try {
    await mkdir(path.join(authorityRoot, '.git'), { recursive: true });
    await mkdir(path.dirname(schemaPath), { recursive: true });
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await mkdir(path.dirname(resolvedWesley), { recursive: true });
    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeFile(resolvedWesley, '#!/bin/sh\nexit 0\n', 'utf8');
    await chmod(resolvedWesley, 0o755);
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript'],
        nodeToolchain: {
          runtime: 'node',
          source: 'system',
          versionRange: '>=22.0.0',
          managedPath: '.warpspace/packages/node/current/bin/node'
        },
        wesleyToolchain: {
          package: 'wesley-cli',
          runner: 'native-binary',
          commandSet: 'native-rust'
        },
        wesleyInstall: {
          source: 'crate',
          crate: 'wesley-cli',
          bin: 'wesley'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    const result = await initWarp({
      projectDir,
      manifestPath,
      resolveBinary: async (name) => {
        resolveCalls.push(name);
        return name === 'wesley' ? resolvedWesley : null;
      },
      runCommand: async ({ command, args, cwd, env }) => {
        invocations.push({ command, args, cwd, env });
        return { status: 0, stdout: '', stderr: '' };
      }
    });

    assert.equal(result.generated, 'completed');
    assert.equal(result.toolchain.node, null);
    assert.equal(result.toolchain.wesley.source, 'crate');
    assert.equal(result.toolchain.wesley.runner, 'native-binary');
    assert.equal(result.toolchain.wesley.commandSet, 'native-rust');
    assert.deepEqual(resolveCalls, ['wesley']);

    assert.equal(invocations.length, 1);
    assert.equal(invocations[0].command, resolvedWesley);
    assert.deepEqual(invocations[0].args, [
      'emit',
      'typescript',
      '--schema',
      'contracts/continuum/continuum-neighborhood-core-family.graphql',
      '--out',
      'packages/demo-web/src/generated/continuum/neighborhood-core/types.generated.ts'
    ]);

    const receipt = JSON.parse(
      await readFile(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'install-receipt.json'), 'utf8')
    );
    assert.equal(receipt.source, 'crate');
    assert.equal(receipt.resolvedPath, resolvedWesley);
    assert.equal(receipt.runner, 'native-binary');

    // crate source resolves an existing binary; it does not stage a copy under .warpspace
    await assert.rejects(access(path.join(projectDir, '.warpspace', 'packages', 'wesley', 'current', 'bin', 'wesley')));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('initWarp crate source errors with cargo guidance when Wesley is not installed', async () => {
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
    await writeFile(schemaPath, schemaContent, 'utf8');
    await writeTemplateFixture({ templatePath, templateFiles });
    await writeFile(
      manifestPath,
      JSON.stringify(buildBaseManifest({
        schemaContent,
        projections: ['typescript'],
        nodeToolchain: {
          runtime: 'node',
          source: 'system',
          versionRange: '>=22.0.0',
          managedPath: '.warpspace/packages/node/current/bin/node'
        },
        wesleyToolchain: {
          package: 'wesley-cli',
          runner: 'native-binary',
          commandSet: 'native-rust'
        },
        wesleyInstall: {
          source: 'crate',
          crate: 'wesley-cli',
          bin: 'wesley'
        }
      }), null, 2) + '\n',
      'utf8'
    );

    await assert.rejects(
      initWarp({
        projectDir,
        manifestPath,
        resolveBinary: async () => null,
        runCommand: async () => ({ status: 0, stdout: '', stderr: '' })
      }),
      /cargo install wesley-cli/
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

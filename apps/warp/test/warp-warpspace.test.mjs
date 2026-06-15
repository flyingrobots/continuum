import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { main } from '../src/cli.mjs';
import {
  installWarpspace,
  lockWarpspace,
  syncWarpspace,
  verifyWarpspace,
  defaultRunCommand
} from '../src/warpspace.mjs';

test('warpspace lock resolves repo refs, syncs checkouts, and verifies clean heads', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const syncRoot = path.join(tempDir, 'sync');
  const manifestPath = path.join(tempDir, 'jedit-echo.toml');
  const lockPath = path.join(tempDir, 'jedit-echo.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });
    const jedit = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'jedit'),
      fileName: 'jedit.txt',
      content: 'jedit\n'
    });

    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jedit-echo-dev"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        '',
        '[repos.jedit]',
        `git = ${JSON.stringify(jedit.repoPath)}`,
        `rev = ${JSON.stringify(jedit.head)}`,
        'path = "jedit"',
        '',
        '[crates]',
        'wesley-core = "0.0.2"',
        ''
      ].join('\n'),
      'utf8'
    );

    const lockResult = await lockWarpspace({
      manifestPath,
      lockPath,
      now: () => new Date('2026-05-09T19:00:00.000Z')
    });

    assert.equal(lockResult.repoCount, 2);
    assert.equal(lockResult.lock.repos.find(repo => repo.name === 'echo').resolved, echo.head);
    assert.equal(lockResult.lock.repos.find(repo => repo.name === 'jedit').resolution, 'literal-sha');

    const syncResult = await syncWarpspace({ lockPath, root: syncRoot });
    assert.deepEqual(
      Object.fromEntries(syncResult.repos.map(repo => [repo.name, repo.cloned])),
      {
        echo: true,
        jedit: true
      }
    );

    const verifyResult = await verifyWarpspace({ lockPath, root: syncRoot });
    assert.equal(verifyResult.ok, true);
    assert.deepEqual(verifyResult.issues, []);

    await writeFile(path.join(syncRoot, 'echo', 'echo.txt'), 'dirty\n', 'utf8');
    const dirtyResult = await verifyWarpspace({ lockPath, root: syncRoot });
    assert.equal(dirtyResult.ok, false);
    assert.ok(
      dirtyResult.issues.some(issue => issue.repo === 'echo' && issue.code === 'dirty-worktree'),
      `expected dirty-worktree on echo, got ${JSON.stringify(dirtyResult.issues)}`
    );

    const cli = await runCli(['warpspace', 'verify', lockPath, '--root', syncRoot, '--json']);
    assert.equal(cli.code, 1);
    const parsed = JSON.parse(cli.stdout);
    assert.equal(parsed.ok, false);
    assert.ok(
      parsed.issues.some(issue => issue.repo === 'echo' && issue.code === 'dirty-worktree'),
      `expected dirty-worktree in CLI output, got ${JSON.stringify(parsed.issues)}`
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace sync repairs origin and creates nested checkout directories', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const syncRoot = path.join(tempDir, 'sync');
  const manifestPath = path.join(tempDir, 'nested.toml');
  const lockPath = path.join(tempDir, 'nested.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "nested"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        `rev = ${JSON.stringify(echo.head)}`,
        'path = "nested/repos/echo"',
        ''
      ].join('\n'),
      'utf8'
    );

    await lockWarpspace({
      manifestPath,
      lockPath,
      now: () => new Date('2026-05-09T19:00:00.000Z')
    });

    const firstSync = await syncWarpspace({ lockPath, root: syncRoot });
    const checkoutPath = path.join(syncRoot, 'nested', 'repos', 'echo');
    assert.equal(firstSync.repos[0].cloned, true);
    assert.equal(await pathExists(path.join(checkoutPath, '.git')), true);

    git(['remote', 'set-url', 'origin', 'https://example.invalid/wrong.git'], checkoutPath);

    const secondSync = await syncWarpspace({ lockPath, root: syncRoot });
    assert.equal(secondSync.repos[0].cloned, false);
    assert.equal(git(['remote', 'get-url', 'origin'], checkoutPath).stdout.trim(), echo.repoPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install locks, syncs, verifies, and writes a devcontainer runtime projection', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        `rev = ${JSON.stringify(echo.head)}`,
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        'mount = "/warpspaces/jim"',
        '',
        '[runtime.default.image]',
        'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
        '',
        '[runtime.default.env]',
        'JIM_WARPSPACE_ROOT = "/warpspaces/jim"',
        ''
      ].join('\n'),
      'utf8'
    );

    const cli = await runCli(['install', manifestPath, '--json']);
    assert.equal(cli.code, 0);
    const parsed = JSON.parse(cli.stdout);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.locked.repoCount, 1);
    assert.equal(parsed.runtime.status, 'written');
    assert.equal(parsed.runtime.mount, '/warpspaces/jim');

    const lock = JSON.parse(await readFile(path.join(root, 'warpspace.lock.json'), 'utf8'));
    assert.equal(lock.repos[0].resolved, echo.head);
    assert.equal(lock.runtime.default.kind, 'devcontainer');

    const devcontainer = JSON.parse(
      await readFile(path.join(root, '.devcontainer', 'devcontainer.json'), 'utf8')
    );
    assert.equal(devcontainer.name, 'jim runtime');
    assert.equal(devcontainer.image, 'ghcr.io/flyingrobots/jim-runtime:test');
    assert.equal(devcontainer.workspaceFolder, '/warpspaces/jim');
    assert.equal(
      devcontainer.workspaceMount,
      'source=${localWorkspaceFolder},target=/warpspaces/jim,type=bind,consistency=cached'
    );
    assert.deepEqual(devcontainer.remoteEnv, {
      JIM_WARPSPACE_ROOT: '/warpspaces/jim'
    });
    assert.equal(await pathExists(path.join(root, 'echo', '.git')), true);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install rejects devcontainer runtime profiles without an image', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        'mount = "/warpspaces/jim"',
        ''
      ].join('\n'),
      'utf8'
    );

    const cli = await runCli(['install', manifestPath]);
    assert.equal(cli.code, 1);
    assert.match(cli.stderr, /\[runtime\.default\.image]/);
    assert.equal(await pathExists(path.join(root, '.devcontainer', 'devcontainer.json')), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install rejects devcontainer runtime profiles without a mount', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        '',
        '[runtime.default.image]',
        'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
        ''
      ].join('\n'),
      'utf8'
    );

    const cli = await runCli(['install', manifestPath]);
    assert.equal(cli.code, 1);
    assert.match(cli.stderr, /\[runtime\.default]\.mount/);
    assert.equal(await pathExists(path.join(root, '.devcontainer', 'devcontainer.json')), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install rejects devcontainer mount paths that inject workspaceMount fields', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        'mount = "/warpspaces/jim,type=volume"',
        '',
        '[runtime.default.image]',
        'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
        ''
      ].join('\n'),
      'utf8'
    );

    const cli = await runCli(['install', manifestPath]);
    assert.equal(cli.code, 1);
    assert.match(cli.stderr, /\[runtime\.default]\.mount.*comma/);
    assert.equal(await pathExists(path.join(root, '.devcontainer', 'devcontainer.json')), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install rejects nonscalar devcontainer runtime env values', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const arrayRoot = path.join(tempDir, 'array-env');
  const tableRoot = path.join(tempDir, 'table-env');
  const arrayManifestPath = path.join(arrayRoot, 'warpspace.toml');
  const tableManifestPath = path.join(tableRoot, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeRuntimeEnvManifest({
      root: arrayRoot,
      manifestPath: arrayManifestPath,
      repoPath: echo.repoPath,
      envLines: [
        '[runtime.default.env]',
        'BROKEN = ["a", "b"]'
      ]
    });
    const arrayCli = await runCli(['install', arrayManifestPath]);
    assert.equal(arrayCli.code, 1);
    assert.match(arrayCli.stderr, /\[runtime\.default\.env\.BROKEN]/);
    assert.equal(await pathExists(path.join(arrayRoot, '.devcontainer', 'devcontainer.json')), false);

    await writeRuntimeEnvManifest({
      root: tableRoot,
      manifestPath: tableManifestPath,
      repoPath: echo.repoPath,
      envLines: [
        '[runtime.default.env.BROKEN]',
        'VALUE = "x"'
      ]
    });
    const tableCli = await runCli(['install', tableManifestPath]);
    assert.equal(tableCli.code, 1);
    assert.match(tableCli.stderr, /\[runtime\.default\.env\.BROKEN]/);
    assert.equal(await pathExists(path.join(tableRoot, '.devcontainer', 'devcontainer.json')), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install skip-sync without checkouts reports verification failure without success text', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        'mount = "/warpspaces/jim"',
        '',
        '[runtime.default.image]',
        'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
        ''
      ].join('\n'),
      'utf8'
    );

    const cli = await runCli(['install', manifestPath, '--skip-sync']);
    assert.equal(cli.code, 1);
    assert.doesNotMatch(cli.stdout, /Installed WARPspace/);
    assert.match(cli.stderr, /Install failed/);
    assert.match(cli.stderr, /missing-checkout/);
    assert.equal(await pathExists(path.join(root, '.devcontainer', 'devcontainer.json')), true);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install json mode serializes thrown install errors as json', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));

  try {
    const cli = await runCli(['install', path.join(tempDir, 'missing.toml'), '--json']);

    assert.equal(cli.code, 1);
    assert.equal(cli.stderr, '');
    assert.doesNotMatch(cli.stdout, /node:internal|at .*warpspace\.mjs/);
    const parsed = JSON.parse(cli.stdout);
    assert.equal(parsed.kind, 'warp.install.error.v1');
    assert.equal(parsed.ok, false);
    assert.equal(parsed.error.code, 'EWARPSPACE_MANIFEST_NOT_FOUND');
    assert.match(parsed.error.message, /Warpspace manifest not found/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('install preserves an unchanged lock on repeated runs', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');
  const lockPath = path.join(root, 'warpspace.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await mkdir(root, { recursive: true });
    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "jim"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        `rev = ${JSON.stringify(echo.head)}`,
        'path = "echo"',
        '',
        '[runtime.default]',
        'kind = "devcontainer"',
        'mount = "/warpspaces/jim"',
        '',
        '[runtime.default.image]',
        'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
        ''
      ].join('\n'),
      'utf8'
    );

    const first = await installWarpspace({
      manifestPath,
      now: () => new Date('2026-05-09T19:00:00.000Z')
    });
    assert.equal(first.ok, true);
    const firstLock = await readFile(lockPath, 'utf8');

    const second = await installWarpspace({
      manifestPath,
      now: () => new Date('2026-05-10T19:00:00.000Z')
    });
    assert.equal(second.ok, true);
    assert.equal(second.sync.repos[0].cloned, false);
    assert.equal(await readFile(lockPath, 'utf8'), firstLock);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace rejects checkout paths outside the root', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const syncRoot = path.join(tempDir, 'sync');
  const manifestPath = path.join(tempDir, 'escape.toml');
  const lockPath = path.join(tempDir, 'escape.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "escape"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        `rev = ${JSON.stringify(echo.head)}`,
        'path = "echo"',
        ''
      ].join('\n'),
      'utf8'
    );

    const lockResult = await lockWarpspace({
      manifestPath,
      lockPath,
      now: () => new Date('2026-05-09T19:00:00.000Z')
    });
    const escaped = {
      ...lockResult.lock,
      repos: [
        {
          ...lockResult.lock.repos[0],
          path: '../escape'
        }
      ]
    };
    await writeFile(lockPath, JSON.stringify(escaped, null, 2) + '\n', 'utf8');

    await assert.rejects(
      () => verifyWarpspace({ lockPath, root: syncRoot }),
      /must not contain "\.\." segments|resolves outside|must be relative/
    );
    await assert.rejects(
      () => syncWarpspace({ lockPath, root: syncRoot }),
      /must not contain "\.\." segments|resolves outside|must be relative/
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace help and usage errors stay user-facing', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));

  const topHelp = await runCli(['--help']);
  assert.equal(topHelp.code, 0);
  assert.match(topHelp.stdout, /init: continuum-stack-release\.json/);
  assert.match(topHelp.stdout, /install: warpspace\.toml/);

  const installHelp = await runCli(['install', '--help']);
  assert.equal(installHelp.code, 0);
  assert.match(installHelp.stdout, /Usage: qw install \[warpspace\.toml]/);
  assert.match(installHelp.stdout, /--manifest <path>/);
  assert.equal(installHelp.stderr, '');

  const help = await runCli(['warpspace', 'lock', '--help']);
  assert.equal(help.code, 0);
  assert.match(help.stdout, /Usage: qw warpspace lock <manifest\.toml>/);
  assert.equal(help.stderr, '');

  const usageError = await runCli(['init', 'demo-app', '--manifest']);
  assert.equal(usageError.code, 1);
  assert.match(usageError.stderr, /Missing value for --manifest/);
  assert.match(usageError.stderr, /Usage: qw init <projectDir>/);
  assert.doesNotMatch(usageError.stderr, /node:internal|at .*cli\.mjs/);

  const shortFlagError = await runCli(['warpspace', 'sync', 'demo.lock.json', '--root', '-q']);
  assert.equal(shortFlagError.code, 1);
  assert.match(shortFlagError.stderr, /Missing value for --root/);
  assert.match(shortFlagError.stderr, /Usage: qw warpspace sync <warpspace\.lock\.json>/);

  const disallowedFlag = await runCli(['warpspace', 'lock', 'demo.toml', '--root', os.tmpdir()]);
  assert.equal(disallowedFlag.code, 1);
  assert.match(disallowedFlag.stderr, /Unknown option: --root/);
  assert.match(disallowedFlag.stderr, /Usage: qw warpspace lock <manifest\.toml>/);

  const conflictingInstallManifest = await runCli([
    'install',
    'positional-warpspace.toml',
    '--manifest',
    'flag-warpspace.toml'
  ]);
  assert.equal(conflictingInstallManifest.code, 1);
  assert.match(conflictingInstallManifest.stderr, /Use either positional manifest path or --manifest/);
  assert.match(conflictingInstallManifest.stderr, /Usage: qw install/);
  assert.doesNotMatch(conflictingInstallManifest.stderr, /ENOENT|node:internal|at .*warpspace\.mjs/);

  const quietInstall = await runCli(['install', '-q']);
  assert.equal(quietInstall.code, 1);
  assert.match(quietInstall.stderr, /Warpspace manifest not found: .*warpspace\.toml/);
  assert.doesNotMatch(quietInstall.stderr, /Warpspace manifest not found: .*-q/);

  try {
    const missingManifest = await runCli(['install', path.join(tempDir, 'missing.toml')]);
    assert.equal(missingManifest.code, 1);
    assert.match(missingManifest.stderr, /Warpspace manifest not found/);
    assert.doesNotMatch(missingManifest.stderr, /node:internal|at .*warpspace\.mjs/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace lock rejects unquoted barewords in TOML', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const manifestPath = path.join(tempDir, 'bareword.toml');
  const lockPath = path.join(tempDir, 'bareword.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = demo',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "main"',
        'path = "echo"',
        ''
      ].join('\n'),
      'utf8'
    );

    await assert.rejects(
      () => lockWarpspace({ manifestPath, lockPath }),
      /unquoted bareword/
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace lock rejects repo paths outside the manifest root', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const escapeManifestPath = path.join(tempDir, 'escape.toml');
  const escapeLockPath = path.join(tempDir, 'escape.lock.json');
  const absoluteManifestPath = path.join(tempDir, 'absolute.toml');
  const absoluteLockPath = path.join(tempDir, 'absolute.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeWarpspaceManifest({
      manifestPath: escapeManifestPath,
      repoPath: echo.repoPath,
      checkoutPath: '../escape'
    });
    await assert.rejects(
      () => lockWarpspace({ manifestPath: escapeManifestPath, lockPath: escapeLockPath }),
      /\[repos\.echo]\.path.*must not contain "\.\." segments/
    );
    assert.equal(await pathExists(escapeLockPath), false);

    await writeWarpspaceManifest({
      manifestPath: absoluteManifestPath,
      repoPath: echo.repoPath,
      checkoutPath: path.join(tempDir, 'absolute')
    });
    await assert.rejects(
      () => lockWarpspace({ manifestPath: absoluteManifestPath, lockPath: absoluteLockPath }),
      /\[repos\.echo]\.path.*must be relative/
    );
    assert.equal(await pathExists(absoluteLockPath), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace lock rejects literal SHA revisions absent from local evidence', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const manifestPath = path.join(tempDir, 'literal-sha.toml');
  const lockPath = path.join(tempDir, 'literal-sha.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'echo\n'
    });

    await writeFile(
      manifestPath,
      [
        'version = 1',
        '',
        '[warpspace]',
        'name = "unknown-sha"',
        '',
        '[repos.echo]',
        `git = ${JSON.stringify(echo.repoPath)}`,
        'rev = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
        'path = "echo"',
        ''
      ].join('\n'),
      'utf8'
    );

    await assert.rejects(
      () => lockWarpspace({ manifestPath, lockPath }),
      /Cannot verify literal sha|not found/
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace lock rejects literal SHA evidence from a mismatched checkout origin', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const root = path.join(tempDir, 'jim');
  const manifestPath = path.join(root, 'warpspace.toml');
  const lockPath = path.join(root, 'warpspace.lock.json');

  try {
    const declaredEcho = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'declared-echo'),
      fileName: 'echo.txt',
      content: 'declared\n'
    });
    const impostorEcho = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'impostor-echo'),
      fileName: 'echo.txt',
      content: 'impostor\n'
    });

    await mkdir(root, { recursive: true });
    git(['clone', impostorEcho.repoPath, path.join(root, 'echo')], tempDir);
    await writeWarpspaceManifest({
      manifestPath,
      repoPath: declaredEcho.repoPath,
      checkoutPath: 'echo',
      rev: impostorEcho.head
    });

    await assert.rejects(
      () => lockWarpspace({ manifestPath, lockPath }),
      /Cannot verify literal sha|origin mismatch|not found/
    );
    assert.equal(await pathExists(lockPath), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('warpspace lock accepts reachable literal SHA revisions not advertised as refs', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const manifestPath = path.join(tempDir, 'reachable-sha.toml');
  const lockPath = path.join(tempDir, 'reachable-sha.lock.json');

  try {
    const echo = await createGitRepo({
      repoPath: path.join(upstreamRoot, 'echo'),
      fileName: 'echo.txt',
      content: 'first\n'
    });
    const firstHead = echo.head;
    await writeFile(path.join(echo.repoPath, 'echo.txt'), 'second\n', 'utf8');
    git(['add', 'echo.txt'], echo.repoPath);
    git([
      '-c',
      'user.name=Warp Test',
      '-c',
      'user.email=warp-test@example.invalid',
      '-c',
      'commit.gpgsign=false',
      'commit',
      '-m',
      'second'
    ], echo.repoPath);
    const secondHead = git(['rev-parse', 'HEAD'], echo.repoPath).stdout.trim();
    assert.notEqual(firstHead, secondHead);

    await writeWarpspaceManifest({
      manifestPath,
      repoPath: pathToFileURL(echo.repoPath).href,
      checkoutPath: 'echo',
      rev: firstHead
    });

    const lockResult = await lockWarpspace({ manifestPath, lockPath });

    assert.equal(lockResult.lock.repos[0].resolved, firstHead);
    assert.equal(lockResult.lock.repos[0].resolution, 'literal-sha');
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test('defaultRunCommand returns command-execution failures in stderr', () => {
  const result = defaultRunCommand({
    command: 'definitely-not-a-real-command',
    args: [],
    cwd: undefined
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /not found|ENOENT/);
});

async function createGitRepo({ repoPath, fileName, content }) {
  await mkdir(repoPath, { recursive: true });
  git(['init'], repoPath);
  git(['symbolic-ref', 'HEAD', 'refs/heads/main'], repoPath);
  await writeFile(path.join(repoPath, fileName), content, 'utf8');
  git(['add', fileName], repoPath);
  git([
    '-c',
    'user.name=Warp Test',
    '-c',
    'user.email=warp-test@example.invalid',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '-m',
    'init'
  ], repoPath);
  const head = git(['rev-parse', 'HEAD'], repoPath).stdout.trim();
  return { repoPath, head };
}

async function writeWarpspaceManifest({
  manifestPath,
  repoPath,
  checkoutPath,
  rev = 'main'
}) {
  await writeFile(
    manifestPath,
    [
      'version = 1',
      '',
      '[warpspace]',
      'name = "jim"',
      '',
      '[repos.echo]',
      `git = ${JSON.stringify(repoPath)}`,
      `rev = ${JSON.stringify(rev)}`,
      `path = ${JSON.stringify(checkoutPath)}`,
      ''
    ].join('\n'),
    'utf8'
  );
}

async function writeRuntimeEnvManifest({
  root,
  manifestPath,
  repoPath,
  envLines
}) {
  await mkdir(root, { recursive: true });
  await writeFile(
    manifestPath,
    [
      'version = 1',
      '',
      '[warpspace]',
      'name = "jim"',
      '',
      '[repos.echo]',
      `git = ${JSON.stringify(repoPath)}`,
      'rev = "main"',
      'path = "echo"',
      '',
      '[runtime.default]',
      'kind = "devcontainer"',
      'mount = "/warpspaces/jim"',
      '',
      '[runtime.default.image]',
      'ref = "ghcr.io/flyingrobots/jim-runtime:test"',
      '',
      ...envLines,
      ''
    ].join('\n'),
    'utf8'
  );
}

function git(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8'
  });
  assert.equal(
    result.status,
    0,
    `git ${args.join(' ')} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
  );
  return result;
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function runCli(argv) {
  const stdout = [];
  const stderr = [];
  const code = await main(argv, {
    stdout: { write: chunk => stdout.push(chunk) },
    stderr: { write: chunk => stderr.push(chunk) }
  });
  return {
    code,
    stdout: stdout.join(''),
    stderr: stderr.join('')
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';

import { main } from '../src/cli.mjs';
import {
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

test('warpspace lock rejects unknown literal SHA revisions', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'continuum-warpspace-'));
  const upstreamRoot = path.join(tempDir, 'upstream');
  const manifestPath = path.join(tempDir, 'unknown-sha.toml');
  const lockPath = path.join(tempDir, 'unknown-sha.lock.json');

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
        'rev = "0000000000000000000000000000000000000000aa"',
        'path = "echo"',
        ''
      ].join('\n'),
      'utf8'
    );

    await assert.rejects(
      () => lockWarpspace({ manifestPath, lockPath }),
      /Cannot resolve literal sha|not found|No resolvable git ref found/
    );
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

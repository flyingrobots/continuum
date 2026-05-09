import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';

import { main } from '../src/cli.mjs';
import {
  lockWarpspace,
  syncWarpspace,
  verifyWarpspace
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
      syncResult.repos.map(repo => [repo.name, repo.cloned]),
      [
        ['echo', true],
        ['jedit', true]
      ]
    );

    const verifyResult = await verifyWarpspace({ lockPath, root: syncRoot });
    assert.equal(verifyResult.ok, true);
    assert.deepEqual(verifyResult.issues, []);

    await writeFile(path.join(syncRoot, 'echo', 'echo.txt'), 'dirty\n', 'utf8');
    const dirtyResult = await verifyWarpspace({ lockPath, root: syncRoot });
    assert.equal(dirtyResult.ok, false);
    assert.equal(dirtyResult.issues[0].code, 'dirty-worktree');

    const cli = await runCli(['warpspace', 'verify', lockPath, '--root', syncRoot, '--json']);
    assert.equal(cli.code, 1);
    assert.equal(JSON.parse(cli.stdout).ok, false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

async function createGitRepo({ repoPath, fileName, content }) {
  await mkdir(repoPath, { recursive: true });
  git(['init', '-b', 'main'], repoPath);
  await writeFile(path.join(repoPath, fileName), content, 'utf8');
  git(['add', fileName], repoPath);
  git([
    '-c',
    'user.name=Warp Test',
    '-c',
    'user.email=warp-test@example.invalid',
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

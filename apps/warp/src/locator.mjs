import path from 'node:path';
import { lstat, readFile, realpath, stat } from 'node:fs/promises';

const LOCATOR_KIND = 'warp.locator.v1';

export async function locateWarpspacePath({
  lockPath = 'warpspace.lock.json',
  root = null,
  cwd = null,
  inputPath,
  basis = null
}) {
  const resolvedLockPath = path.resolve(requiredText(lockPath, 'warpspace lock path'));
  const lock = await readLock(resolvedLockPath);
  const runtimeRoot = path.resolve(root ?? path.dirname(resolvedLockPath));
  const runtimeCwd = path.resolve(cwd ?? process.cwd());
  const rawInputPath = requiredText(inputPath, 'input path');
  const runtimePath = path.isAbsolute(rawInputPath)
    ? path.resolve(rawInputPath)
    : path.resolve(runtimeCwd, rawInputPath);

  assertUnderRoot({
    runtimePath,
    runtimeRoot,
    label: 'input path'
  });

  const repoMatch = findRepoMatch({
    repos: lock.repos,
    runtimeRoot,
    runtimePath
  });
  if (repoMatch == null) {
    throw userFacingError(
      `Input path is not inside a declared WARPspace repo: ${runtimePath}`,
      'EWARP_LOCATE_UNDECLARED_REPO'
    );
  }
  await assertNoSymlinkEscape({
    runtimePath,
    runtimeRoot,
    repoRoot: repoMatch.repoRoot
  });

  const warpspace = requiredText(lock.warpspace?.name, 'lock warpspace name');
  const repoRelativePath = repoMatch.repoRelativePath;
  const segments = [
    'repo',
    repoMatch.repo.name,
    ...pathSegments(repoRelativePath)
  ];
  const typedLocator = {
    kind: LOCATOR_KIND,
    warpspace,
    basis: basis ?? null,
    segments
  };
  const locator = renderWarpLocator({ warpspace, segments });
  const basisLocator = basis == null
    ? null
    : renderWarpLocator({ warpspace, basis, segments });

  return {
    kind: 'warp.warpspace.locate.result.v1',
    lockPath: resolvedLockPath,
    input: rawInputPath,
    repo: repoMatch.repo.name,
    repoRelativePath,
    locator,
    basisLocator,
    typedLocator,
    runtimeProjection: {
      path: runtimePath,
      root: runtimeRoot,
      cwd: runtimeCwd,
      hashScope: 'excluded'
    }
  };
}

async function readLock(lockPath) {
  let content;
  try {
    content = await readFile(lockPath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw userFacingError(`WARPspace lock not found: ${lockPath}`, 'EWARP_LOCK_NOT_FOUND');
    }
    throw error;
  }

  const lock = JSON.parse(content);
  if (!Array.isArray(lock.repos)) {
    throw userFacingError(`WARPspace lock has no repos array: ${lockPath}`, 'EWARP_LOCK_INVALID');
  }
  return lock;
}

function findRepoMatch({ repos, runtimeRoot, runtimePath }) {
  const candidates = repos
    .map(repo => {
      const repoRoot = path.resolve(runtimeRoot, repo.path);
      const relativePath = path.relative(repoRoot, runtimePath);
      const insideRepo = relativePath === '' ||
        (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
      if (!insideRepo) {
        return null;
      }
      return {
        repo,
        repoRoot,
        repoRelativePath: normalizeRelativePath(relativePath)
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.repoRoot.length - left.repoRoot.length);

  return candidates[0] ?? null;
}

function assertUnderRoot({
  runtimePath,
  runtimeRoot,
  label,
  code = 'EWARP_LOCATE_OUTSIDE_ROOT',
  boundary = 'WARPspace root'
}) {
  const relativePath = path.relative(runtimeRoot, runtimePath);
  if (relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))) {
    return;
  }
  throw userFacingError(
    `${label} resolves outside ${boundary}: ${runtimePath}`,
    code
  );
}

async function assertNoSymlinkEscape({ runtimePath, runtimeRoot, repoRoot }) {
  if (!await pathExists(runtimeRoot)) {
    return;
  }
  const ancestorPath = await deepestExistingAncestor(runtimePath);
  const [physicalPath, physicalRoot] = await Promise.all([
    realpathExistingAncestor({ ancestorPath, runtimePath }),
    realpath(runtimeRoot)
  ]);
  assertUnderRoot({
    runtimePath: physicalPath,
    runtimeRoot: physicalRoot,
    label: 'input path realpath'
  });
  if (await pathExists(repoRoot)) {
    assertUnderRoot({
      runtimePath: physicalPath,
      runtimeRoot: await realpath(repoRoot),
      label: 'input path repo realpath',
      code: 'EWARP_LOCATE_OUTSIDE_REPO',
      boundary: 'matched repo root'
    });
  }
}

async function deepestExistingAncestor(targetPath) {
  let candidate = targetPath;
  while (!await pathExists(candidate, { followSymlinks: false })) {
    const parent = path.dirname(candidate);
    if (parent === candidate) {
      return candidate;
    }
    candidate = parent;
  }
  return candidate;
}

async function realpathExistingAncestor({ ancestorPath, runtimePath }) {
  try {
    return await realpath(ancestorPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw userFacingError(
        `input path realpath cannot be resolved inside WARPspace root: ${runtimePath}`,
        'EWARP_LOCATE_OUTSIDE_ROOT'
      );
    }
    throw error;
  }
}

function renderWarpLocator({ warpspace, basis = null, segments }) {
  const scheme = basis == null ? 'warp' : `warp@${basis}`;
  return `${scheme}://${[warpspace, ...segments].map(encodeWarpSegment).join('/')}`;
}

function pathSegments(relativePath) {
  if (relativePath === '') {
    return [];
  }
  return normalizeRelativePath(relativePath).split('/');
}

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function encodeWarpSegment(segment) {
  return encodeURIComponent(segment);
}

function requiredText(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`Expected a non-empty ${label}.`);
  }
  return value.trim();
}

function userFacingError(message, code) {
  const error = new Error(message);
  error.code = code;
  error.expose = true;
  return error;
}

async function pathExists(targetPath, { followSymlinks = true } = {}) {
  try {
    if (followSymlinks) {
      await stat(targetPath);
    } else {
      await lstat(targetPath);
    }
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

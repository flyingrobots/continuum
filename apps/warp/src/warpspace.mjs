import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';

const CONSTELLATION_LOCK_KIND = 'warpspace.constellation-lock.v1';

export async function lockWarpspace({
  manifestPath,
  lockPath = null,
  now = () => new Date(),
  runCommand = defaultRunCommand
}) {
  const resolvedManifestPath = path.resolve(requiredText(manifestPath, 'warpspace manifest path'));
  const manifestContent = await readWarpspaceManifest(resolvedManifestPath);
  const manifest = parseWarpspaceToml(manifestContent, resolvedManifestPath);
  const resolvedLockPath = lockPath == null
    ? defaultLockPath(resolvedManifestPath)
    : path.resolve(lockPath);

  const repos = [];
  const manifestDir = path.dirname(resolvedManifestPath);
  for (const repo of manifest.repos) {
    const resolved = await resolveGitRef({
      git: repo.git,
      rev: repo.rev,
      manifestDir,
      checkoutPath: path.resolve(manifestDir, repo.path),
      runCommand
    });
    repos.push({
      name: repo.name,
      git: repo.git,
      rev: repo.rev,
      resolved: resolved.resolved,
      path: repo.path,
      resolution: resolved.resolution
    });
  }

  const lock = {
    kind: CONSTELLATION_LOCK_KIND,
    version: 1,
    lockedAt: now().toISOString(),
    manifest: {
      path: path.relative(path.dirname(resolvedLockPath), resolvedManifestPath),
      sha256: sha256(manifestContent)
    },
    warpspace: {
      name: manifest.name,
      version: manifest.version
    },
    repos,
    crates: manifest.crates,
    packages: manifest.packages,
    runtime: manifest.runtime,
    contracts: manifest.contracts
  };

  await preserveExistingLockedAt({ lock, lockPath: resolvedLockPath });
  await mkdir(path.dirname(resolvedLockPath), { recursive: true });
  await writeFile(resolvedLockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');

  return {
    kind: 'warp.warpspace.lock.result.v1',
    manifestPath: resolvedManifestPath,
    lockPath: resolvedLockPath,
    repoCount: repos.length,
    lock
  };
}

export async function installWarpspace({
  manifestPath = 'warpspace.toml',
  root = null,
  lockPath = null,
  allowDirty = false,
  skipSync = false,
  now = () => new Date(),
  runCommand = defaultRunCommand
}) {
  const resolvedManifestPath = path.resolve(requiredText(manifestPath, 'warpspace manifest path'));
  const resolvedRoot = path.resolve(root ?? path.dirname(resolvedManifestPath));
  const resolvedLockPath = lockPath == null
    ? defaultLockPath(resolvedManifestPath)
    : path.resolve(lockPath);

  const lockResult = await lockWarpspace({
    manifestPath: resolvedManifestPath,
    lockPath: resolvedLockPath,
    now,
    runCommand
  });

  const sync = skipSync
    ? null
    : await syncWarpspace({
      lockPath: resolvedLockPath,
      root: resolvedRoot,
      runCommand
    });

  const runtime = await materializeRuntimeProjection({
    lock: lockResult.lock,
    root: resolvedRoot
  });

  const verification = await verifyWarpspace({
    lockPath: resolvedLockPath,
    root: resolvedRoot,
    allowDirty,
    runCommand
  });

  return {
    kind: 'warp.install.result.v1',
    ok: verification.ok,
    manifestPath: resolvedManifestPath,
    lockPath: resolvedLockPath,
    root: resolvedRoot,
    locked: {
      repoCount: lockResult.repoCount
    },
    sync,
    runtime,
    verification
  };
}

export async function verifyWarpspace({
  lockPath,
  root = null,
  allowDirty = false,
  runCommand = defaultRunCommand
}) {
  const resolvedLockPath = path.resolve(requiredText(lockPath, 'warpspace lock path'));
  const lock = await readLock(resolvedLockPath);
  const resolvedRoot = path.resolve(root ?? path.dirname(resolvedLockPath));
  const repos = [];
  const issues = [];

  for (const repo of lock.repos) {
    const checkoutPath = resolveCheckoutPath({
      resolvedRoot,
      repo,
      lockPath: resolvedLockPath
    });
    const repoReport = {
      name: repo.name,
      path: checkoutPath,
      expected: repo.resolved,
      ok: false
    };
    repos.push(repoReport);

    if (!await pathExists(path.join(checkoutPath, '.git'))) {
      issues.push({
        code: 'missing-checkout',
        repo: repo.name,
        path: checkoutPath
      });
      continue;
    }

    const head = runGit(['rev-parse', 'HEAD'], { cwd: checkoutPath, runCommand });
    if (head.status !== 0) {
      issues.push(commandIssue('head-unreadable', repo.name, checkoutPath, head));
      continue;
    }
    repoReport.head = head.stdout.trim();
    if (repoReport.head !== repo.resolved) {
      issues.push({
        code: 'head-mismatch',
        repo: repo.name,
        path: checkoutPath,
        expected: repo.resolved,
        actual: repoReport.head
      });
    }

    const remote = runGit(['remote', 'get-url', 'origin'], { cwd: checkoutPath, runCommand });
    if (remote.status !== 0) {
      issues.push(commandIssue('origin-unreadable', repo.name, checkoutPath, remote));
    } else {
      repoReport.origin = remote.stdout.trim();
      if (repoReport.origin !== repo.git) {
        issues.push({
          code: 'origin-mismatch',
          repo: repo.name,
          path: checkoutPath,
          expected: repo.git,
          actual: repoReport.origin
        });
      }
    }

    if (!allowDirty) {
      const status = runGit(['status', '--porcelain=v1'], { cwd: checkoutPath, runCommand });
      if (status.status !== 0) {
        issues.push(commandIssue('status-unreadable', repo.name, checkoutPath, status));
      } else if (status.stdout.trim() !== '') {
        issues.push({
          code: 'dirty-worktree',
          repo: repo.name,
          path: checkoutPath,
          evidence: status.stdout.trim().split('\n')
        });
      }
    }

    repoReport.ok = !issues.some(issue => issue.repo === repo.name);
  }

  return {
    kind: 'warp.warpspace.verify.result.v1',
    lockPath: resolvedLockPath,
    root: resolvedRoot,
    ok: issues.length === 0,
    repos,
    issues
  };
}

export async function syncWarpspace({
  lockPath,
  root,
  runCommand = defaultRunCommand
}) {
  const resolvedLockPath = path.resolve(requiredText(lockPath, 'warpspace lock path'));
  const resolvedRoot = path.resolve(requiredText(root, 'sync root'));
  const lock = await readLock(resolvedLockPath);
  await mkdir(resolvedRoot, { recursive: true });

  const repos = [];
  for (const repo of lock.repos) {
    const checkoutPath = resolveCheckoutPath({
      resolvedRoot,
      repo,
      lockPath: resolvedLockPath
    });
    const existed = await pathExists(checkoutPath);
    await mkdir(path.dirname(checkoutPath), { recursive: true });

    if (existed && !await pathExists(path.join(checkoutPath, '.git'))) {
      throw new Error(`Cannot sync ${repo.name}: ${checkoutPath} exists but is not a git checkout.`);
    }

    if (!existed) {
      runGitChecked(['clone', repo.git, checkoutPath], {
        cwd: resolvedRoot,
        runCommand,
        label: `clone ${repo.name}`
      });
    } else {
      assertCleanWorktree({
        repo,
        checkoutPath,
        runCommand
      });

      const origin = runGit(['remote', 'get-url', 'origin'], {
        cwd: checkoutPath,
        runCommand
      });
      if (origin.status !== 0) {
        throw new Error(
          `Cannot sync ${repo.name}: unable to read origin remote for ${checkoutPath}.\n` +
          `${origin.stderr || origin.stdout}`.trim()
        );
      }
      const currentOrigin = origin.stdout.trim();
      if (currentOrigin !== repo.git) {
        runGitChecked(['remote', 'set-url', 'origin', repo.git], {
          cwd: checkoutPath,
          runCommand,
          label: `set origin for ${repo.name}`
        });
      }
    }

    runGitChecked(['fetch', 'origin', '--tags', '--prune'], {
      cwd: checkoutPath,
      runCommand,
      label: `fetch ${repo.name}`
    });
    runGitChecked(['checkout', '--detach', repo.resolved], {
      cwd: checkoutPath,
      runCommand,
      label: `checkout ${repo.name}`
    });

    repos.push({
      name: repo.name,
      path: checkoutPath,
      resolved: repo.resolved,
      cloned: !existed
    });
  }

  return {
    kind: 'warp.warpspace.sync.result.v1',
    lockPath: resolvedLockPath,
    root: resolvedRoot,
    repos
  };
}

export async function doctorWarpspace({
  lockPath,
  root = null,
  allowDirty = false,
  runCommand = defaultRunCommand
}) {
  const verification = await verifyWarpspace({
    lockPath,
    root,
    allowDirty,
    runCommand
  });

  return {
    kind: 'warp.warpspace.doctor.result.v1',
    ok: verification.ok,
    verification
  };
}

function parseWarpspaceToml(content, manifestPath) {
  const tree = {};
  let current = tree;

  for (const [lineIndex, rawLine] of content.split(/\r?\n/).entries()) {
    const line = stripTomlComment(rawLine).trim();
    if (line === '') {
      continue;
    }

    const tableMatch = line.match(/^\[([A-Za-z0-9_.-]+)]$/);
    if (tableMatch) {
      current = ensureTable(tree, tableMatch[1].split('.'), manifestPath, lineIndex + 1);
      continue;
    }

    const assignmentMatch = line.match(/^([A-Za-z0-9_-]+|"[^"]+")\s*=\s*(.+)$/);
    if (!assignmentMatch) {
      throw new Error(`${manifestPath}:${lineIndex + 1}: unsupported TOML line: ${rawLine}`);
    }

    const key = parseTomlKey(assignmentMatch[1]);
    current[key] = parseTomlValue(assignmentMatch[2].trim(), manifestPath, lineIndex + 1);
  }

  const version = Number(tree.version ?? tree.warpspace?.version ?? 1);
  if (!Number.isInteger(version) || version < 1) {
    throw new Error(`${manifestPath}: warpspace version must be a positive integer.`);
  }

  const repoEntries = Object.entries(tree.repos ?? {}).map(([name, spec]) => {
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      throw new Error(`${manifestPath}: [repos.${name}] must be a table.`);
    }
    return {
      name,
      git: requiredText(spec.git, `[repos.${name}].git`),
      rev: requiredText(spec.rev, `[repos.${name}].rev`),
      path: manifestRepoPath({ spec, name, manifestPath })
    };
  });

  if (repoEntries.length === 0) {
    throw new Error(`${manifestPath}: declare at least one [repos.<name>] table.`);
  }

  return {
    version,
    name: tree.warpspace?.name ?? tree.name ?? path.basename(manifestPath, path.extname(manifestPath)),
    repos: repoEntries,
    crates: tree.crates ?? {},
    packages: tree.packages ?? {},
    runtime: tree.runtime ?? {},
    contracts: tree.contracts ?? {}
  };
}

function ensureTable(root, parts, manifestPath, lineNumber) {
  let current = root;
  for (const part of parts) {
    if (current[part] == null) {
      current[part] = {};
    }
    if (typeof current[part] !== 'object' || Array.isArray(current[part])) {
      throw new Error(`${manifestPath}:${lineNumber}: table ${parts.join('.')} conflicts with an existing scalar.`);
    }
    current = current[part];
  }
  return current;
}

function parseTomlKey(key) {
  if (key.startsWith('"')) {
    return JSON.parse(key);
  }
  return key;
}

function parseTomlValue(value, manifestPath, lineNumber) {
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`${manifestPath}:${lineNumber}: invalid string: ${error.message}`);
    }
  }
  if (value.startsWith('[')) {
    if (!value.endsWith(']')) {
      throw new Error(`${manifestPath}:${lineNumber}: arrays must be written on one line.`);
    }
    const inner = value.slice(1, -1).trim();
    if (inner === '') {
      return [];
    }
    return splitTomlArray(inner).map(item => parseTomlValue(item.trim(), manifestPath, lineNumber));
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }
  throw new Error(`${manifestPath}:${lineNumber}: unquoted bareword '${value}' is not allowed.`);
}

function splitTomlArray(value) {
  const items = [];
  let current = '';
  let inString = false;
  let escaped = false;

  for (const char of value) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\' && inString) {
      current += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      current += char;
      inString = !inString;
      continue;
    }
    if (char === ',' && !inString) {
      items.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim() !== '') {
    items.push(current);
  }
  return items;
}

function stripTomlComment(line) {
  let out = '';
  let inString = false;
  let escaped = false;

  for (const char of line) {
    if (escaped) {
      out += char;
      escaped = false;
      continue;
    }
    if (char === '\\' && inString) {
      out += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      out += char;
      inString = !inString;
      continue;
    }
    if (char === '#' && !inString) {
      break;
    }
    out += char;
  }

  return out;
}

async function readWarpspaceManifest(manifestPath) {
  try {
    return await readFile(manifestPath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw userFacingError(`Warpspace manifest not found: ${manifestPath}`, 'EWARPSPACE_MANIFEST_NOT_FOUND');
    }
    throw error;
  }
}

function userFacingError(message, code) {
  const error = new Error(message);
  error.code = code;
  error.expose = true;
  return error;
}

async function preserveExistingLockedAt({ lock, lockPath }) {
  const existing = await readJsonIfExists(lockPath);
  if (
    typeof existing?.lockedAt === 'string' &&
    equivalentLocksExceptLockedAt(existing, lock)
  ) {
    lock.lockedAt = existing.lockedAt;
  }
}

async function readJsonIfExists(filePath) {
  let content;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    throw error;
  }

  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function equivalentLocksExceptLockedAt(left, right) {
  return JSON.stringify(lockComparableWithoutLockedAt(left)) ===
    JSON.stringify(lockComparableWithoutLockedAt(right));
}

function lockComparableWithoutLockedAt(lock) {
  const {
    lockedAt: _lockedAt,
    ...rest
  } = lock;
  return stableJsonValue(rest);
}

function stableJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(item => stableJsonValue(item));
  }
  if (value != null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableJsonValue(item)])
    );
  }
  return value;
}

async function resolveGitRef({ git, rev, manifestDir, checkoutPath, runCommand }) {
  if (/^[0-9a-f]{40}$/i.test(rev)) {
    const normalizedRev = rev.toLowerCase();
    const evidence = [];

    const checkoutVerification = await verifyLiteralShaInLocalRepo({
      repoPath: checkoutPath,
      rev: normalizedRev,
      runCommand
    });
    if (checkoutVerification.ok) {
      return {
        resolved: normalizedRev,
        resolution: 'literal-sha'
      };
    }
    if (checkoutVerification.evidence != null) {
      evidence.push(`checkout ${checkoutPath}: ${checkoutVerification.evidence}`);
    }

    const localSourcePath = localGitSourcePath(git, manifestDir);
    if (localSourcePath != null && localSourcePath !== checkoutPath) {
      const sourceVerification = await verifyLiteralShaInLocalRepo({
        repoPath: localSourcePath,
        rev: normalizedRev,
        runCommand
      });
      if (sourceVerification.ok) {
        return {
          resolved: normalizedRev,
          resolution: 'literal-sha'
        };
      }
      if (sourceVerification.evidence != null) {
        evidence.push(`source ${localSourcePath}: ${sourceVerification.evidence}`);
      }
    }

    const advertised = runGit(['ls-remote', git], { runCommand });
    if (advertised.status === 0) {
      const found = advertised.stdout
        .trim()
        .split('\n')
        .filter(Boolean)
        .some(line => line.split(/\s+/, 1)[0]?.toLowerCase() === normalizedRev);
      if (found) {
        return {
          resolved: normalizedRev,
          resolution: 'literal-sha'
        };
      }
      evidence.push('remote did not advertise the literal sha as a ref');
    } else {
      evidence.push(`remote lookup failed: ${(advertised.stderr || advertised.stdout || 'not found').trim()}`);
    }

    throw new Error(
      `Cannot verify literal sha ${rev} in ${git}: ${evidence.filter(Boolean).join('; ') || 'not found'}`
    );
  }

  // Prefer peeled tags first, then the tag object, then branches, then exact
  // ref matches. That keeps annotated releases stable while still allowing
  // branch names when no tag collision exists.
  const candidates = [
    rev,
    `refs/heads/${rev}`,
    `refs/tags/${rev}`,
    `refs/tags/${rev}^{}`
  ];
  const result = runGit(['ls-remote', git, ...candidates], { runCommand });
  if (result.status !== 0) {
    throw new Error(
      `Failed to resolve ${git} ${rev}: ${result.stderr || result.stdout}`.trim()
    );
  }

  const refs = result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [sha, ref] = line.split(/\s+/, 2);
      return { sha, ref };
    });

  const selected = refs.find(ref => ref.ref === `refs/tags/${rev}^{}`)
    ?? refs.find(ref => ref.ref === `refs/tags/${rev}`)
    ?? refs.find(ref => ref.ref === `refs/heads/${rev}`)
    ?? refs.find(ref => ref.ref === rev)
    ?? refs[0];

  if (!selected || !/^[0-9a-f]{40}$/i.test(selected.sha)) {
    throw new Error(`No resolvable git ref found for ${git} ${rev}.`);
  }

  return {
    resolved: selected.sha.toLowerCase(),
    resolution: selected.ref
  };
}

async function verifyLiteralShaInLocalRepo({ repoPath, rev, runCommand }) {
  if (repoPath == null || !await pathExists(repoPath)) {
    return { ok: false };
  }

  const result = runGit(['rev-parse', '--verify', `${rev}^{commit}`], {
    cwd: repoPath,
    runCommand
  });
  if (result.status === 0 && result.stdout.trim().toLowerCase() === rev) {
    return { ok: true };
  }

  return {
    ok: false,
    evidence: (result.stderr || result.stdout || 'not found').trim()
  };
}

function localGitSourcePath(git, manifestDir) {
  if (/^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(git) || /^[^/\\]+@[^:]+:/.test(git)) {
    return null;
  }
  return path.resolve(manifestDir, git);
}

async function readLock(lockPath) {
  const content = await readFile(lockPath, 'utf8');
  let lock;
  try {
    lock = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse ${lockPath}: ${error.message}`);
  }
  if (lock.kind !== CONSTELLATION_LOCK_KIND) {
    throw new Error(`${lockPath} must declare kind "${CONSTELLATION_LOCK_KIND}".`);
  }
  if (!Array.isArray(lock.repos)) {
    throw new Error(`${lockPath} must declare repos.`);
  }
  return lock;
}

function manifestRepoPath({ spec, name, manifestPath }) {
  const repoPath = spec.path == null
    ? name
    : requiredText(spec.path, `[repos.${name}].path`);
  return validateRelativeRepoPath({
    rawPath: repoPath,
    label: `${manifestPath}: [repos.${name}].path`
  });
}

async function materializeRuntimeProjection({ lock, root }) {
  const profile = lock.runtime?.default;
  if (profile == null) {
    return {
      kind: 'warp.runtime.materialize.result.v1',
      status: 'skipped',
      reason: 'no-runtime-profile'
    };
  }

  if (profile.kind !== 'devcontainer') {
    return {
      kind: 'warp.runtime.materialize.result.v1',
      status: 'skipped',
      reason: `unsupported-runtime-kind:${profile.kind ?? 'unknown'}`
    };
  }

  const mount = runtimeMount(profile);
  const devcontainerDir = path.join(root, '.devcontainer');
  const devcontainerPath = path.join(devcontainerDir, 'devcontainer.json');
  const config = {
    name: `${lock.warpspace?.name ?? 'Warpspace'} runtime`,
    image: runtimeImage(profile),
    workspaceFolder: mount,
    workspaceMount: `source=\${localWorkspaceFolder},target=${mount},type=bind,consistency=cached`,
    remoteEnv: runtimeEnv(profile)
  };

  await mkdir(devcontainerDir, { recursive: true });
  await writeFile(devcontainerPath, JSON.stringify(config, null, 2) + '\n', 'utf8');

  return {
    kind: 'warp.runtime.materialize.result.v1',
    status: 'written',
    profile: 'default',
    runtimeKind: 'devcontainer',
    path: devcontainerPath,
    mount,
    image: config.image
  };
}

function runtimeImage(profile) {
  if (typeof profile.image === 'string') {
    return requiredText(profile.image, '[runtime.default].image');
  }

  if (profile.image == null) {
    throw new Error('[runtime.default.image] is required for devcontainer runtime profiles.');
  }

  const image = profile.image;
  if (image.ref != null) {
    return requiredText(image.ref, '[runtime.default.image].ref');
  }
  if (image.source != null && image.tag != null) {
    return `${requiredText(image.source, '[runtime.default.image].source')}:${requiredText(image.tag, '[runtime.default.image].tag')}`;
  }
  if (image.source != null) {
    return requiredText(image.source, '[runtime.default.image].source');
  }
  throw new Error('[runtime.default.image] must declare ref or source.');
}

function runtimeMount(profile) {
  const mount = requiredText(profile.mount, '[runtime.default].mount');
  if (!mount.startsWith('/')) {
    throw new Error('[runtime.default].mount must be an absolute container path.');
  }
  if (mount.includes(',')) {
    throw new Error('[runtime.default].mount must not contain commas.');
  }
  return mount;
}

function runtimeEnv(profile) {
  const env = profile.env ?? {};
  if (typeof env !== 'object' || Array.isArray(env)) {
    throw new Error('[runtime.default.env] must be a table.');
  }
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, runtimeEnvValue(key, value)])
  );
}

function runtimeEnvValue(key, value) {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }
  throw new Error(`[runtime.default.env.${key}] must be a string, number, or boolean.`);
}

function resolveCheckoutPath({ resolvedRoot, repo, lockPath }) {
  const rawPath = validateRelativeRepoPath({
    rawPath: requiredText(repo.path ?? repo.name, `path for ${repo.name}`),
    label: `${lockPath}: repo ${repo.name} path`
  });
  const checkoutPath = path.resolve(resolvedRoot, rawPath);
  const relative = path.relative(resolvedRoot, checkoutPath);
  if (relative !== '' && (relative.startsWith('..') || path.isAbsolute(relative))) {
    throw new Error(
      `${lockPath}: repo ${repo.name} path "${rawPath}" resolves outside ${resolvedRoot}.`
    );
  }
  return checkoutPath;
}

function validateRelativeRepoPath({ rawPath, label }) {
  if (rawPath.split(/[\\/]/).includes('..')) {
    throw new Error(`${label} "${rawPath}" must not contain ".." segments.`);
  }
  if (path.isAbsolute(rawPath) || /^[A-Za-z]:[\\/]/.test(rawPath)) {
    throw new Error(`${label} "${rawPath}" must be relative.`);
  }
  return rawPath;
}

function assertCleanWorktree({ repo, checkoutPath, runCommand }) {
  const status = runGit(['status', '--porcelain=v1'], { cwd: checkoutPath, runCommand });
  if (status.status !== 0) {
    throw new Error(`Cannot inspect ${repo.name} before sync: ${status.stderr || status.stdout}`.trim());
  }
  if (status.stdout.trim() !== '') {
    throw new Error(
      `Cannot sync ${repo.name}: ${checkoutPath} has uncommitted changes:\n${status.stdout.trim()}`
    );
  }
}

function runGitChecked(args, { cwd, runCommand, label }) {
  const result = runGit(args, { cwd, runCommand });
  if (result.status !== 0) {
    throw new Error(`${label} failed: git ${args.join(' ')}\n${result.stderr || result.stdout}`.trim());
  }
  return result;
}

function runGit(args, { cwd = undefined, runCommand }) {
  return runCommand({
    command: 'git',
    args,
    cwd
  });
}

function commandIssue(code, repo, checkoutPath, result) {
  return {
    code,
    repo,
    path: checkoutPath,
    status: result.status,
    evidence: (result.stderr || result.stdout || '').trim()
  };
}

function defaultLockPath(manifestPath) {
  if (path.basename(manifestPath) === 'warpspace.toml') {
    return path.join(path.dirname(manifestPath), 'warpspace.lock.json');
  }
  return path.join(
    path.dirname(manifestPath),
    `${path.basename(manifestPath, path.extname(manifestPath))}.lock.json`
  );
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function requiredText(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`Expected a non-empty ${label}.`);
  }
  return value.trim();
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

function defaultRunCommand({ command, args, cwd }) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8'
  });
  const spawnError = result.error?.message ? `${result.error.message}\n` : '';

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: `${spawnError}${result.stderr ?? ''}`
  };
}

export { defaultRunCommand };

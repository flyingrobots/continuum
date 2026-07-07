import { initWarp } from './init.mjs';
import { locateWarpspacePath } from './locator.mjs';
import {
  doctorWarpspace,
  doctorRuntimeProjection,
  installWarpspace,
  lockWarpspace,
  materializeRuntimeProjection,
  syncWarpspace,
  verifyRuntimeProjection,
  verifyWarpspace
} from './warpspace.mjs';

export async function main(argv, io = {}) {
  const stdout = bindWrite(io.stdout) ?? process.stdout.write.bind(process.stdout);
  const stderr = bindWrite(io.stderr) ?? process.stderr.write.bind(process.stderr);

  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    stdout(renderUsage());
    return 0;
  }

  const [command, ...rest] = argv;

  if (command === 'init') {
    return runInit(rest, { stdout, stderr });
  }

  if (command === 'install') {
    return runInstall(rest, { stdout, stderr });
  }

  if (command === 'runtime') {
    return runRuntime(rest, { stdout, stderr });
  }

  if (command === 'warpspace') {
    return runWarpspace(rest, { stdout, stderr });
  }

  stderr(`Unknown command: ${command}\n\n`);
  stderr(renderUsage());
  return 1;
}

async function runInit(argv, { stdout, stderr }) {
  const usage = renderInitUsage();
  if (hasHelpFlag(argv)) {
    stdout(usage);
    return 0;
  }

  try {
    const {
      options,
      positionals
    } = parseInitArgs(argv, usage);

    if (positionals.length !== 1) {
      throw new UsageError('Expected exactly one project directory.', usage);
    }

    const result = await initWarp({
      projectDir: positionals[0],
      manifestPath: options.manifest ?? null,
      profile: options.profile ?? null,
      authorityRoot: options.authorityRoot ?? null,
      force: Boolean(options.force),
      generate: !options.skipGenerate
    });

    if (options.json) {
      stdout(JSON.stringify({
        success: true,
        result,
        timestamp: new Date().toISOString()
      }, null, 2) + '\n');
      return 0;
    }

    if (!options.quiet) {
      stdout(`Initialized WARPspace: ${result.projectDir}\n`);
      stdout(`Release: ${result.releaseId}\n`);
      stdout(`Manifest: ${result.manifestPath}\n`);
      stdout(`Template: ${result.template.id}\n`);
      stdout(`Config: ${result.warpspacePath}\n`);
      stdout(`Lock: ${result.lockPath}\n`);
      if (result.toolchain.node != null) {
        stdout(`Node runtime: ${result.toolchain.node.version} via ${result.toolchain.node.source}\n`);
      } else {
        stdout('Node runtime: not installed\n');
      }
      stdout(`Wesley tool: ${result.toolchain.wesley.package ?? 'wesley'} ${result.toolchain.wesley.version ?? ''}`.trimEnd() + '\n');
      stdout(`Materialized families: ${result.materializedFamilies.map(family => family.id).join(', ')}\n`);
      if (result.generated === 'completed') {
        stdout(`Generation: ${result.generatedCommands.length} Wesley command(s) completed\n`);
      } else {
        stdout('Generation: skipped by flag\n');
      }
    }

    return 0;
  } catch (error) {
    return writeCommandError(stderr, error);
  }
}

async function runInstall(argv, { stdout, stderr }) {
  const usage = renderInstallUsage();
  if (hasHelpFlag(argv)) {
    stdout(usage);
    return 0;
  }
  const wantsJson = argv.includes('--json');

  try {
    const { options, positionals } = parseInstallArgs(argv, usage);
    if (positionals.length > 1) {
      throw new UsageError('Expected at most one manifest path.', usage);
    }
    if (positionals.length === 1 && options.manifest != null) {
      throw new UsageError('Use either positional manifest path or --manifest, not both.', usage);
    }

    const result = await installWarpspace({
      manifestPath: positionals[0] ?? options.manifest ?? 'warpspace.toml',
      root: options.root ?? null,
      lockPath: options.lock ?? null,
      allowDirty: Boolean(options.allowDirty),
      skipSync: Boolean(options.skipSync)
    });

    if (options.json) {
      stdout(JSON.stringify(result, null, 2) + '\n');
      return result.ok ? 0 : 1;
    }

    if (!result.ok) {
      if (!options.quiet) {
        stderr(`Install failed: ${result.root}\n`);
      }
      stderr(renderWarpspaceIssues(result.verification));
      return 1;
    }

    if (!options.quiet) {
      stdout(`Installed WARPspace: ${result.root}\n`);
      stdout(`Lock: ${result.lockPath}\n`);
      stdout(`Repos: ${result.locked.repoCount}\n`);
      if (result.sync != null) {
        stdout(`Synced repos: ${result.sync.repos.length}\n`);
      }
      if (result.runtime.status === 'written') {
        stdout(`Runtime: ${result.runtime.path}\n`);
      } else {
        stdout(`Runtime: ${result.runtime.status} (${result.runtime.reason})\n`);
      }
    }

    return 0;
  } catch (error) {
    if (wantsJson) {
      return writeJsonCommandError(stdout, error, 'warp.install.error.v1');
    }
    return writeCommandError(stderr, error);
  }
}

async function runRuntime(argv, { stdout, stderr }) {
  const [command, ...rest] = argv;
  if (command == null || command === '--help' || command === '-h') {
    stdout(renderRuntimeUsage());
    return 0;
  }

  if (command === 'materialize') {
    const usage = renderRuntimeMaterializeUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    const wantsJson = rest.includes('--json');
    try {
      const { options, positionals } = parseRuntimeArgs(rest, usage);
      const result = await materializeRuntimeProjection({
        lockPath: runtimeLockPath(positionals, usage),
        root: options.root ?? null
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else if (result.status === 'written') {
        stdout(`Runtime projection written: ${result.path}\n`);
      } else {
        stdout(`Runtime projection skipped: ${result.reason}\n`);
      }
      return 0;
    } catch (error) {
      if (wantsJson) {
        return writeJsonCommandError(stdout, error, 'warp.runtime.materialize.error.v1', 'EWARP_RUNTIME_FAILED');
      }
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'verify') {
    const usage = renderRuntimeVerifyUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    const wantsJson = rest.includes('--json');
    try {
      const { options, positionals } = parseRuntimeArgs(rest, usage);
      const result = await verifyRuntimeProjection({
        lockPath: runtimeLockPath(positionals, usage),
        root: options.root ?? null
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else if (result.ok) {
        if (result.status === 'skipped') {
          stdout(`Runtime projection skipped: ${result.reason}\n`);
        } else {
          stdout(`Runtime projection verified: ${result.path}\n`);
        }
      } else {
        stderr(renderRuntimeIssues(result));
      }
      return result.ok ? 0 : 1;
    } catch (error) {
      if (wantsJson) {
        return writeJsonCommandError(stdout, error, 'warp.runtime.verify.error.v1', 'EWARP_RUNTIME_FAILED');
      }
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'doctor') {
    const usage = renderRuntimeDoctorUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    const wantsJson = rest.includes('--json');
    try {
      const { options, positionals } = parseRuntimeArgs(rest, usage);
      const result = await doctorRuntimeProjection({
        lockPath: runtimeLockPath(positionals, usage),
        root: options.root ?? null
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else if (result.ok) {
        stdout('Runtime doctor: ok\n');
      } else {
        stderr(renderRuntimeIssues(result.verification));
      }
      return result.ok ? 0 : 1;
    } catch (error) {
      if (wantsJson) {
        return writeJsonCommandError(stdout, error, 'warp.runtime.doctor.error.v1', 'EWARP_RUNTIME_FAILED');
      }
      return writeCommandError(stderr, error);
    }
  }

  stderr(`Unknown runtime command: ${command}\n\n`);
  stderr(renderRuntimeUsage());
  return 1;
}

async function runWarpspace(argv, { stdout, stderr }) {
  const [command, ...rest] = argv;
  if (command == null || command === '--help' || command === '-h') {
    stdout(renderWarpspaceUsage());
    return 0;
  }

  if (command === 'lock') {
    const usage = renderWarpspaceLockUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    try {
      const { options, positionals } = parseWarpspaceArgs(rest, usage, new Set([
        '--lock',
        '--json'
      ]));
      if (positionals.length !== 1) {
        throw new UsageError('Expected exactly one manifest path.', usage);
      }
      const result = await lockWarpspace({
        manifestPath: positionals[0],
        lockPath: options.lock ?? null
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else {
        stdout(`Locked WARPspace: ${result.lockPath}\n`);
        stdout(`Repos: ${result.repoCount}\n`);
      }
      return 0;
    } catch (error) {
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'verify') {
    const usage = renderWarpspaceVerifyUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    try {
      const { options, positionals } = parseWarpspaceArgs(rest, usage, new Set([
        '--root',
        '--allow-dirty',
        '--json'
      ]));
      if (positionals.length !== 1) {
        throw new UsageError('Expected exactly one warpspace lock path.', usage);
      }
      const result = await verifyWarpspace({
        lockPath: positionals[0],
        root: options.root ?? null,
        allowDirty: Boolean(options.allowDirty)
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else if (result.ok) {
        stdout(`WARPspace verified: ${result.root}\n`);
      } else {
        stderr(renderWarpspaceIssues(result));
      }
      return result.ok ? 0 : 1;
    } catch (error) {
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'sync') {
    const usage = renderWarpspaceSyncUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    try {
      const { options, positionals } = parseWarpspaceArgs(rest, usage, new Set([
        '--root',
        '--json'
      ]));
      if (positionals.length !== 1 || options.root == null) {
        throw new UsageError('Expected exactly one warpspace lock path and --root <dir>.', usage);
      }
      const result = await syncWarpspace({
        lockPath: positionals[0],
        root: options.root
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else {
        stdout(`Synced WARPspace: ${result.root}\n`);
        for (const repo of result.repos) {
          stdout(`- ${repo.name}: ${repo.resolved} at ${repo.path}\n`);
        }
      }
      return 0;
    } catch (error) {
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'doctor') {
    const usage = renderWarpspaceDoctorUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    try {
      const { options, positionals } = parseWarpspaceArgs(rest, usage, new Set([
        '--root',
        '--allow-dirty',
        '--json'
      ]));
      if (positionals.length !== 1) {
        throw new UsageError('Expected exactly one warpspace lock path.', usage);
      }
      const result = await doctorWarpspace({
        lockPath: positionals[0],
        root: options.root ?? null,
        allowDirty: Boolean(options.allowDirty)
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else if (result.ok) {
        stdout(`WARPspace doctor: ok\n`);
      } else {
        stderr(renderWarpspaceIssues(result.verification));
      }
      return result.ok ? 0 : 1;
    } catch (error) {
      return writeCommandError(stderr, error);
    }
  }

  if (command === 'locate') {
    const usage = renderWarpspaceLocateUsage();
    if (hasHelpFlag(rest)) {
      stdout(usage);
      return 0;
    }
    const wantsJson = rest.includes('--json');
    try {
      const { options, positionals } = parseWarpspaceLocateArgs(rest, usage);
      if (positionals.length !== 1) {
        throw new UsageError('Expected exactly one path to locate.', usage);
      }
      const result = await locateWarpspacePath({
        lockPath: options.lock ?? 'warpspace.lock.json',
        root: options.root ?? null,
        cwd: options.cwd ?? null,
        basis: options.basis ?? null,
        inputPath: positionals[0]
      });
      if (options.json) {
        stdout(JSON.stringify(result, null, 2) + '\n');
      } else {
        stdout(`${result.basisLocator ?? result.locator}\n`);
      }
      return 0;
    } catch (error) {
      if (wantsJson) {
        return writeJsonCommandError(stdout, error, 'warp.warpspace.locate.error.v1', 'EWARP_LOCATE_FAILED');
      }
      return writeCommandError(stderr, error);
    }
  }

  stderr(`Unknown warpspace command: ${command}\n\n`);
  stderr(renderWarpspaceUsage());
  return 1;
}

function bindWrite(target) {
  return typeof target?.write === 'function'
    ? target.write.bind(target)
    : null;
}

class UsageError extends Error {
  constructor(message, usage) {
    super(message);
    this.code = 'EUSAGE';
    this.usage = usage;
  }
}

function hasHelpFlag(argv) {
  return argv.includes('--help') || argv.includes('-h');
}

function writeCommandError(stderr, error) {
  if (isUsageError(error)) {
    stderr(`${error.message}\n\n${error.usage}`);
    return 1;
  }
  if (isUserFacingError(error)) {
    stderr(`${error.message}\n`);
    return 1;
  }
  stderr(`${error?.stack || error?.message || String(error)}\n`);
  return 1;
}

function writeJsonCommandError(stdout, error, kind, fallbackCode = 'EINSTALL') {
  stdout(JSON.stringify({
    kind,
    ok: false,
    error: {
      code: error?.code ?? fallbackCode,
      message: error?.message ?? String(error)
    }
  }, null, 2) + '\n');
  return 1;
}

function isUsageError(error) {
  return error?.code === 'EUSAGE';
}

function isUserFacingError(error) {
  return error?.expose === true;
}

function parseInitArgs(argv, usage) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    switch (token) {
      case '--profile':
        options.profile = requireValue(argv, ++index, token, usage);
        break;
      case '--manifest':
        options.manifest = requireValue(argv, ++index, token, usage);
        break;
      case '--authority-root':
        options.authorityRoot = requireValue(argv, ++index, token, usage);
        break;
      case '--json':
        options.json = true;
        break;
      case '--quiet':
      case '-q':
        options.quiet = true;
        break;
      case '--skip-generate':
        options.skipGenerate = true;
        break;
      case '--force':
        options.force = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${token}`, usage);
    }
  }

  return { options, positionals };
}

function parseInstallArgs(argv, usage) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('-')) {
      positionals.push(token);
      continue;
    }

    switch (token) {
      case '--manifest':
        options.manifest = requireValue(argv, ++index, token, usage);
        break;
      case '--root':
        options.root = requireValue(argv, ++index, token, usage);
        break;
      case '--lock':
        options.lock = requireValue(argv, ++index, token, usage);
        break;
      case '--allow-dirty':
        options.allowDirty = true;
        break;
      case '--skip-sync':
        options.skipSync = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--quiet':
      case '-q':
        options.quiet = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${token}`, usage);
    }
  }

  return { options, positionals };
}

function parseWarpspaceArgs(argv, usage, allowedFlags = new Set()) {
  const options = {};
  const positionals = [];
  const flags = allowedFlags instanceof Set ? allowedFlags : new Set(allowedFlags);

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    if (!flags.has(token)) {
      throw new UsageError(`Unknown option: ${token}`, usage);
    }

    switch (token) {
      case '--lock':
        options.lock = requireValue(argv, ++index, token, usage);
        break;
      case '--root':
        options.root = requireValue(argv, ++index, token, usage);
        break;
      case '--allow-dirty':
        options.allowDirty = true;
        break;
      case '--json':
        options.json = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${token}`, usage);
    }
  }

  return { options, positionals };
}

function parseWarpspaceLocateArgs(argv, usage) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    switch (token) {
      case '--lock':
        options.lock = requireValue(argv, ++index, token, usage);
        break;
      case '--root':
        options.root = requireValue(argv, ++index, token, usage);
        break;
      case '--cwd':
        options.cwd = requireValue(argv, ++index, token, usage);
        break;
      case '--basis':
        options.basis = requireValue(argv, ++index, token, usage);
        break;
      case '--json':
        options.json = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${token}`, usage);
    }
  }

  return { options, positionals };
}

function parseRuntimeArgs(argv, usage) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    switch (token) {
      case '--root':
        options.root = requireValue(argv, ++index, token, usage);
        break;
      case '--json':
        options.json = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${token}`, usage);
    }
  }

  return { options, positionals };
}

function runtimeLockPath(positionals, usage) {
  if (positionals.length > 1) {
    throw new UsageError('Expected at most one warpspace lock path.', usage);
  }
  return positionals[0] ?? 'warpspace.lock.json';
}

function requireValue(argv, index, flag, usage) {
  const value = argv[index];
  if (value == null || value.startsWith('-')) {
    throw new UsageError(`Missing value for ${flag}`, usage);
  }
  return value;
}

function renderUsage() {
  return [
    'qw - Bootstrap and manage a Continuum WARPspace',
    '',
    'Usage:',
    '  qw init <projectDir> [--profile demo] [--manifest <path>]',
    '  qw install [warpspace.toml] [--manifest <path>] [--root <dir>] [--lock <path>] [--skip-sync] [--json]',
    '  qw runtime <materialize|verify|doctor> [warpspace.lock.json] [--root <dir>] [--json]',
    '  qw warpspace <lock|verify|sync|doctor> ...',
    '',
    'Options:',
    '  --profile <id>         Use a built-in Continuum release profile such as demo',
    '  --manifest <path>      init: continuum-stack-release.json; install: warpspace.toml',
    '  --authority-root <p>   Override the Continuum authored-home root',
    '  --skip-generate        Do not invoke Wesley during bootstrap',
    '  --force                Initialize into a non-empty target directory',
    '  --json                 Emit structured JSON output',
    '  -q, --quiet            Suppress success text output',
    '  -h, --help             Show this help text',
    ''
  ].join('\n');
}

function renderInitUsage() {
  return [
    'Usage: qw init <projectDir> [--profile demo] [--manifest <path>]',
    ''
  ].join('\n');
}

function renderInstallUsage() {
  return [
    'Usage: qw install [warpspace.toml] [--manifest <path>] [--root <dir>] [--lock <path>] [--skip-sync] [--json]',
    ''
  ].join('\n');
}

function renderRuntimeUsage() {
  return [
    'qw runtime - Manage local runtime projections from a WARPspace lock',
    '',
    'Usage:',
    '  qw runtime materialize [warpspace.lock.json] [--root <dir>] [--json]',
    '  qw runtime verify [warpspace.lock.json] [--root <dir>] [--json]',
    '  qw runtime doctor [warpspace.lock.json] [--root <dir>] [--json]',
    ''
  ].join('\n');
}

function renderRuntimeMaterializeUsage() {
  return 'Usage: qw runtime materialize [warpspace.lock.json] [--root <dir>] [--json]\n';
}

function renderRuntimeVerifyUsage() {
  return 'Usage: qw runtime verify [warpspace.lock.json] [--root <dir>] [--json]\n';
}

function renderRuntimeDoctorUsage() {
  return 'Usage: qw runtime doctor [warpspace.lock.json] [--root <dir>] [--json]\n';
}

function renderWarpspaceUsage() {
  return [
    'qw warpspace - Manage pinned repo constellations',
    '',
    'Usage:',
    '  qw warpspace lock <manifest.toml> [--lock <path>] [--json]',
    '  qw warpspace verify <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]',
    '  qw warpspace sync <warpspace.lock.json> --root <dir> [--json]',
    '  qw warpspace doctor <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]',
    '  qw warpspace locate <path> [--lock <path>] [--root <dir>] [--cwd <dir>] [--basis <ref>] [--json]',
    ''
  ].join('\n');
}

function renderWarpspaceLockUsage() {
  return 'Usage: qw warpspace lock <manifest.toml> [--lock <path>] [--json]\n';
}

function renderWarpspaceVerifyUsage() {
  return 'Usage: qw warpspace verify <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]\n';
}

function renderWarpspaceSyncUsage() {
  return 'Usage: qw warpspace sync <warpspace.lock.json> --root <dir> [--json]\n';
}

function renderWarpspaceDoctorUsage() {
  return 'Usage: qw warpspace doctor <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]\n';
}

function renderWarpspaceLocateUsage() {
  return 'Usage: qw warpspace locate <path> [--lock <warpspace.lock.json>] [--root <dir>] [--cwd <dir>] [--basis <ref>] [--json]\n';
}

function renderRuntimeIssues(result) {
  const lines = [
    `Runtime projection verification failed: ${result.root}`,
    ''
  ];
  for (const issue of result.issues) {
    lines.push(`- ${issue.code}`);
    if (issue.path) {
      lines.push(`  path: ${issue.path}`);
    }
    if (issue.field) {
      lines.push(`  field: ${issue.field}`);
    }
    if (issue.expected !== undefined) {
      lines.push(`  expected: ${renderIssueValue(issue.expected)}`);
    }
    if (issue.actual !== undefined) {
      lines.push(`  actual: ${renderIssueValue(issue.actual)}`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function renderIssueValue(value) {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

function renderWarpspaceIssues(result) {
  const lines = [
    `WARPspace verification failed: ${result.root}`,
    ''
  ];
  for (const issue of result.issues) {
    lines.push(`- ${issue.repo}: ${issue.code}`);
    if (issue.path) {
      lines.push(`  path: ${issue.path}`);
    }
    if (issue.expected) {
      lines.push(`  expected: ${issue.expected}`);
    }
    if (issue.actual) {
      lines.push(`  actual: ${issue.actual}`);
    }
    if (issue.evidence) {
      const evidence = Array.isArray(issue.evidence)
        ? issue.evidence.join('\n')
        : issue.evidence;
      lines.push(`  evidence: ${evidence}`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

import { initWarp } from './init.mjs';
import {
  doctorWarpspace,
  lockWarpspace,
  syncWarpspace,
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

  if (command === 'warpspace') {
    return runWarpspace(rest, { stdout, stderr });
  }

  stderr(`Unknown command: ${command}\n\n`);
  stderr(renderUsage());
  return 1;
}

async function runInit(argv, { stdout, stderr }) {
  if (hasHelpFlag(argv)) {
    stdout('Usage: warp init <projectDir> [--profile demo] [--manifest <path>]\n');
    return 0;
  }

  const {
    options,
    positionals
  } = parseInitArgs(argv);

  if (positionals.length !== 1) {
    stderr('Usage: warp init <projectDir> [--profile demo] [--manifest <path>]\n');
    return 1;
  }

  try {
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
      stdout(`Node runtime: ${result.toolchain.node.version} via ${result.toolchain.node.source}\n`);
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
    stderr(`${error?.stack || error?.message || String(error)}\n`);
    return 1;
  }
}

async function runWarpspace(argv, { stdout, stderr }) {
  const [command, ...rest] = argv;
  if (command == null || hasHelpFlag(argv)) {
    stdout(renderWarpspaceUsage());
    return 0;
  }

  try {
    if (command === 'lock') {
      const { options, positionals } = parseWarpspaceArgs(rest);
      if (positionals.length !== 1) {
        stderr('Usage: warp warpspace lock <manifest.toml> [--lock <path>] [--json]\n');
        return 1;
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
    }

    if (command === 'verify') {
      const { options, positionals } = parseWarpspaceArgs(rest);
      if (positionals.length !== 1) {
        stderr('Usage: warp warpspace verify <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]\n');
        return 1;
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
    }

    if (command === 'sync') {
      const { options, positionals } = parseWarpspaceArgs(rest);
      if (positionals.length !== 1 || options.root == null) {
        stderr('Usage: warp warpspace sync <warpspace.lock.json> --root <dir> [--json]\n');
        return 1;
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
    }

    if (command === 'doctor') {
      const { options, positionals } = parseWarpspaceArgs(rest);
      if (positionals.length !== 1) {
        stderr('Usage: warp warpspace doctor <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]\n');
        return 1;
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
    }

    stderr(`Unknown warpspace command: ${command}\n\n`);
    stderr(renderWarpspaceUsage());
    return 1;
  } catch (error) {
    stderr(`${error?.stack || error?.message || String(error)}\n`);
    return 1;
  }
}

function bindWrite(target) {
  return typeof target?.write === 'function'
    ? target.write.bind(target)
    : null;
}

function hasHelpFlag(argv) {
  return argv.includes('--help') || argv.includes('-h');
}

function parseInitArgs(argv) {
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
        options.profile = requireValue(argv, ++index, token);
        break;
      case '--manifest':
        options.manifest = requireValue(argv, ++index, token);
        break;
      case '--authority-root':
        options.authorityRoot = requireValue(argv, ++index, token);
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
        throw new Error(`Unknown option: ${token}`);
    }
  }

  return { options, positionals };
}

function parseWarpspaceArgs(argv) {
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
        options.lock = requireValue(argv, ++index, token);
        break;
      case '--root':
        options.root = requireValue(argv, ++index, token);
        break;
      case '--allow-dirty':
        options.allowDirty = true;
        break;
      case '--json':
        options.json = true;
        break;
      default:
        throw new Error(`Unknown option: ${token}`);
    }
  }

  return { options, positionals };
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (value == null || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function renderUsage() {
  return [
    'warp - Bootstrap and manage a Continuum WARPspace',
    '',
    'Usage:',
    '  warp init <projectDir> [--profile demo] [--manifest <path>]',
    '  warp warpspace <lock|verify|sync|doctor> ...',
    '',
    'Options:',
    '  --profile <id>         Use a built-in Continuum release profile such as demo',
    '  --manifest <path>      Use an explicit continuum-stack-release.json',
    '  --authority-root <p>   Override the Continuum authored-home root',
    '  --skip-generate        Do not invoke Wesley during bootstrap',
    '  --force                Initialize into a non-empty target directory',
    '  --json                 Emit structured JSON output',
    '  -q, --quiet            Suppress success text output',
    '  -h, --help             Show this help text',
    ''
  ].join('\n');
}

function renderWarpspaceUsage() {
  return [
    'warp warpspace - Manage pinned repo constellations',
    '',
    'Usage:',
    '  warp warpspace lock <manifest.toml> [--lock <path>] [--json]',
    '  warp warpspace verify <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]',
    '  warp warpspace sync <warpspace.lock.json> --root <dir> [--json]',
    '  warp warpspace doctor <warpspace.lock.json> [--root <dir>] [--allow-dirty] [--json]',
    ''
  ].join('\n');
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

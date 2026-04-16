import { initWarp } from './init.mjs';

export async function main(argv, io = {}) {
  const stdout = bindWrite(io.stdout) ?? process.stdout.write.bind(process.stdout);
  const stderr = bindWrite(io.stderr) ?? process.stderr.write.bind(process.stderr);

  if (argv.length === 0 || hasHelpFlag(argv)) {
    stdout(renderUsage());
    return 0;
  }

  const [command, ...rest] = argv;

  if (command === 'init') {
    return runInit(rest, { stdout, stderr });
  }

  stderr(`Unknown command: ${command}\n\n`);
  stderr(renderUsage());
  return 1;
}

async function runInit(argv, { stdout, stderr }) {
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

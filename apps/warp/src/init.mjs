import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  chmod,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile
} from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const STACK_RELEASE_KIND = 'continuum.stack-release.v1';
const TEMPLATE_KIND = 'warpspace.template.v1';
const WARPSPACE_LOCK_KIND = 'warpspace.lock.v2';
const WESLEY_WARPSPACE_KIND = 'wesley.warpspace.v1';
const DEFAULT_PROFILE = 'demo';
const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));

export async function initWarp({
  projectDir,
  manifestPath = null,
  profile = null,
  authorityRoot = null,
  force = false,
  generate = true,
  now = () => new Date(),
  runCommand = defaultRunCommand
}) {
  const resolvedProjectDir = path.resolve(requiredText(projectDir, 'project directory'));
  const resolvedManifestPath = manifestPath == null
    ? defaultManifestPath(profile ?? DEFAULT_PROFILE)
    : path.resolve(manifestPath);

  const manifestContent = await readFile(resolvedManifestPath, 'utf8');
  const manifest = parseManifest(manifestContent, resolvedManifestPath);
  const manifestHash = sha256(manifestContent);
  validateManifest(manifest, resolvedManifestPath);

  await ensureProjectDirectory({ projectDir: resolvedProjectDir, force });

  const resolvedAuthorityRoot = authorityRoot == null
    ? await findRepoRoot({ startPath: resolvedManifestPath }) ?? REPO_ROOT
    : path.resolve(authorityRoot);

  const templateArtifactPath = path.resolve(
    resolvedAuthorityRoot,
    manifest.bootstrap.template.artifactPath
  );
  const templateContent = await readFile(templateArtifactPath, 'utf8');
  const template = parseTemplate(templateContent, templateArtifactPath);
  validateTemplate(template, templateArtifactPath);

  await applyTemplate({
    template,
    templateArtifactPath,
    projectDir: resolvedProjectDir,
    tokens: {
      PROJECT_NAME: path.basename(resolvedProjectDir),
      PROFILE: manifest.profile,
      RELEASE_ID: manifest.releaseId
    }
  });

  const installLayout = manifest.bootstrap.installLayout ?? defaultInstallLayout();
  await ensureDirectories(
    resolvedProjectDir,
    Object.values(installLayout),
    true
  );
  await writeInternalReadme({ projectDir: resolvedProjectDir, installLayout, manifest });
  const toolchain = await installManagedToolchain({
    manifest,
    authorityRoot: resolvedAuthorityRoot,
    projectDir: resolvedProjectDir,
    installLayout
  });

  const materializedFamilies = [];
  for (const family of manifest.families) {
    const sourceFile = path.resolve(resolvedAuthorityRoot, family.sourcePath);
    const targetFile = path.resolve(resolvedProjectDir, family.materializeTo);
    const sourceContent = await readFile(sourceFile, 'utf8');
    const sourceHash = sha256(sourceContent);
    if (family.sha256 && family.sha256 !== sourceHash) {
      throw new Error(
        `Family digest mismatch for ${family.id}: manifest declares ${family.sha256}, ` +
        `but ${sourceFile} hashes to ${sourceHash}.`
      );
    }

    await mkdir(path.dirname(targetFile), { recursive: true });
    await writeFile(targetFile, ensureTrailingNewline(sourceContent), 'utf8');
    materializedFamilies.push({
      id: family.id,
      version: family.version,
      sourceFile,
      targetFile,
      sha256: sourceHash
    });
  }

  await ensureDirectories(
    resolvedProjectDir,
    Object.values(manifest.bootstrap.defaultOutputs),
    false
  );

  const warpspacePath = path.join(resolvedProjectDir, 'warpspace.toml');
  await writeFile(
    warpspacePath,
    renderWarpspaceToml({ manifest, installLayout }),
    'utf8'
  );
  const wesleyWarpspaceBridgePath = path.join(
    resolvedProjectDir,
    '.warpspace.wesley.mjs'
  );
  await writeFile(
    wesleyWarpspaceBridgePath,
    renderWesleyWarpspaceBridge({ manifest }),
    'utf8'
  );

  let generated = 'skipped-by-flag';
  const generatedCommands = [];
  if (generate) {
    generated = 'completed';
    for (const family of manifest.families) {
      generatedCommands.push(
        ...await invokeWesleyForFamily({
          nodeBin: toolchain.node.commandPath,
          wesleyEntrypoint: toolchain.wesley.entrypointPath,
          wesleyWarpspaceBridgePath,
          family,
          projectDir: resolvedProjectDir,
          runCommand
        })
      );
    }
  }

  const initializedAt = now().toISOString();
  const lock = buildLock({
    manifest,
    manifestPath: resolvedManifestPath,
    manifestHash,
    authorityRoot: resolvedAuthorityRoot,
    template,
    templateArtifactPath,
    installLayout,
    toolchain,
    initializedAt,
    generated,
    generatedCommands,
    wesleyWarpspaceBridgePath
  });
  const lockPath = path.join(resolvedProjectDir, 'warpspace.lock.json');
  await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');

  return {
    kind: 'warp.init.result.v1',
    profile: manifest.profile,
    releaseId: manifest.releaseId,
    projectDir: resolvedProjectDir,
    manifestPath: resolvedManifestPath,
    template: {
      id: template.id,
      artifactPath: templateArtifactPath
    },
    authorityRoot: resolvedAuthorityRoot,
    toolchain,
    warpspacePath,
    lockPath,
    materializedFamilies,
    generated,
    generatedCommands
  };
}

function defaultManifestPath(profile) {
  return path.join(REPO_ROOT, 'docs', 'releases', profile, 'continuum-stack-release.json');
}

function defaultInstallLayout() {
  return {
    root: '.warpspace',
    packages: '.warpspace/packages',
    cache: '.warpspace/cache',
    downloads: '.warpspace/downloads'
  };
}

function requiredText(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`Expected a non-empty ${label}.`);
  }
  return value.trim();
}

function parseManifest(content, manifestPath) {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse stack release manifest at ${manifestPath}: ${error.message}`);
  }
}

function parseTemplate(content, templatePath) {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse WARPspace template at ${templatePath}: ${error.message}`);
  }
}

function validateManifest(manifest, manifestPath) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must be a JSON object.`);
  }
  if (manifest.kind !== STACK_RELEASE_KIND) {
    throw new Error(
      `Stack release manifest at ${manifestPath} must declare kind "${STACK_RELEASE_KIND}".`
    );
  }
  if (!Array.isArray(manifest.families) || manifest.families.length === 0) {
    throw new Error(`Stack release manifest at ${manifestPath} must declare at least one family.`);
  }
  if (!manifest.bootstrap || typeof manifest.bootstrap !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare bootstrap settings.`);
  }
  if (!manifest.bootstrap.template || typeof manifest.bootstrap.template !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare bootstrap.template.`);
  }
  if (!manifest.bootstrap.template.artifactPath) {
    throw new Error(`Stack release manifest at ${manifestPath} must declare bootstrap.template.artifactPath.`);
  }
  if (!manifest.bootstrap.defaultOutputs || typeof manifest.bootstrap.defaultOutputs !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare bootstrap.defaultOutputs.`);
  }
  if (!manifest.toolchain || typeof manifest.toolchain !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare toolchain settings.`);
  }
  if (!manifest.toolchain.node || typeof manifest.toolchain.node !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare toolchain.node.`);
  }
  if (!manifest.toolchain.wesley || typeof manifest.toolchain.wesley !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare toolchain.wesley.`);
  }
  if (!manifest.toolchain.wesley.install || typeof manifest.toolchain.wesley.install !== 'object') {
    throw new Error(`Stack release manifest at ${manifestPath} must declare toolchain.wesley.install.`);
  }
  for (const family of manifest.families) {
    if (!family.id || !family.version || !family.sourcePath || !family.materializeTo) {
      throw new Error(
        `Family entries in ${manifestPath} must declare id, version, sourcePath, and materializeTo.`
      );
    }
  }
}

function validateTemplate(template, templatePath) {
  if (!template || typeof template !== 'object') {
    throw new Error(`Template at ${templatePath} must be a JSON object.`);
  }
  if (template.kind !== TEMPLATE_KIND) {
    throw new Error(`Template at ${templatePath} must declare kind "${TEMPLATE_KIND}".`);
  }
  if (!template.id || !Array.isArray(template.directories) || !template.copyFilesFrom) {
    throw new Error(
      `Template at ${templatePath} must declare id, directories, and copyFilesFrom.`
    );
  }
}

async function ensureProjectDirectory({ projectDir, force }) {
  const exists = await pathExists(projectDir);
  if (!exists) {
    await mkdir(projectDir, { recursive: true });
    return;
  }

  const entries = await readdir(projectDir);
  if (entries.length > 0 && !force) {
    throw new Error(
      `Project directory ${projectDir} is not empty. Pass --force to initialize into an existing directory.`
    );
  }
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

async function findRepoRoot({ startPath }) {
  let current = path.dirname(path.resolve(startPath));
  while (true) {
    if (await pathExists(path.join(current, '.git'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

async function applyTemplate({ template, templateArtifactPath, projectDir, tokens }) {
  await ensureDirectories(projectDir, template.directories, false);

  const templateRoot = path.dirname(templateArtifactPath);
  const sourceRoot = path.join(templateRoot, template.copyFilesFrom);
  await copyTemplateTree({
    sourceRoot,
    currentSourceDir: sourceRoot,
    projectDir,
    tokens
  });
}

async function ensureDirectories(projectDir, relativePaths, ignoreEmpty = false) {
  for (const relativePath of relativePaths) {
    if (ignoreEmpty && !relativePath) {
      continue;
    }
    await mkdir(path.join(projectDir, relativePath), { recursive: true });
  }
}

async function copyTemplateTree({ sourceRoot, currentSourceDir, projectDir, tokens }) {
  const entries = await readdir(currentSourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(currentSourceDir, entry.name);
    const relativePath = path.relative(sourceRoot, sourcePath);
    const targetPath = path.join(projectDir, relativePath);

    if (entry.isDirectory()) {
      await mkdir(targetPath, { recursive: true });
      await copyTemplateTree({
        sourceRoot,
        currentSourceDir: sourcePath,
        projectDir,
        tokens
      });
      continue;
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    const content = await readFile(sourcePath, 'utf8');
    await writeFile(targetPath, replaceTokens(content, tokens), 'utf8');
  }
}

function replaceTokens(content, tokens) {
  let rendered = content;
  for (const [key, value] of Object.entries(tokens)) {
    rendered = rendered.replaceAll(`__${key}__`, value);
  }
  return rendered;
}

async function writeInternalReadme({ projectDir, installLayout, manifest }) {
  const readmePath = path.join(projectDir, installLayout.root, 'README.md');
  const content = [
    '# Managed WARPspace State',
    '',
    'This directory is managed by `warp`.',
    '',
    `Profile: ${manifest.profile}`,
    `Release: ${manifest.releaseId}`,
    '',
    'Expected subdirectories:',
    `- ${installLayout.packages}`,
    `- ${installLayout.cache}`,
    `- ${installLayout.downloads}`,
    '',
    'In the released flow this directory will hold downloaded toolchain packages',
    'such as Wesley, Echo, git-warp, and warp-ttd.',
    ''
  ].join('\n');
  await writeFile(readmePath, content, 'utf8');
}

async function installManagedToolchain({
  manifest,
  authorityRoot,
  projectDir,
  installLayout
}) {
  const node = await installNodeRuntime({
    nodeSpec: manifest.toolchain.node,
    projectDir,
    installLayout
  });
  const wesley = await installWesleyTool({
    wesleySpec: manifest.toolchain.wesley,
    authorityRoot,
    projectDir,
    installLayout
  });

  return { node, wesley };
}

async function installNodeRuntime({ nodeSpec, projectDir, installLayout }) {
  const source = requiredText(nodeSpec.source, 'toolchain.node.source');
  if (source !== 'system') {
    throw new Error(
      `Unsupported toolchain.node.source "${source}". The current prototype only supports "system".`
    );
  }

  const versionRange = requiredText(nodeSpec.versionRange, 'toolchain.node.versionRange');
  assertNodeVersionSatisfies({
    actualVersion: process.version,
    requestedRange: versionRange
  });

  const commandPath = path.join(
    projectDir,
    nodeSpec.managedPath ?? path.join(installLayout.packages, 'node', 'current', 'bin', 'node')
  );
  await stageFileReference({
    sourcePath: process.execPath,
    targetPath: commandPath
  });

  const receiptPath = path.join(path.dirname(commandPath), 'install-receipt.json');
  const receipt = {
    kind: 'warp.tool-install-receipt.v1',
    tool: 'node',
    source,
    requestedRange: versionRange,
    resolvedVersion: normalizeNodeVersion(process.version),
    sourcePath: process.execPath,
    stagedPath: commandPath
  };
  await writeFile(receiptPath, JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  return {
    runtime: 'node',
    source,
    requestedRange: versionRange,
    version: normalizeNodeVersion(process.version),
    sourcePath: process.execPath,
    commandPath,
    receiptPath
  };
}

async function installWesleyTool({
  wesleySpec,
  authorityRoot,
  projectDir,
  installLayout
}) {
  const install = wesleySpec.install;
  const source = requiredText(install.source, 'toolchain.wesley.install.source');

  if (source !== 'local-sibling-entrypoint') {
    throw new Error(
      `Unsupported toolchain.wesley.install.source "${source}". ` +
      'The current prototype only supports "local-sibling-entrypoint".'
    );
  }

  const sourcePath = path.resolve(
    authorityRoot,
    requiredText(install.path, 'toolchain.wesley.install.path')
  );
  if (!await pathExists(sourcePath)) {
    throw new Error(`Configured Wesley entrypoint does not exist: ${sourcePath}`);
  }

  const entrypointPath = path.join(
    projectDir,
    install.managedPath ?? path.join(installLayout.packages, 'wesley', 'current', 'bin', 'wesley.mjs')
  );
  await writeWesleyWrapper({
    sourcePath,
    targetPath: entrypointPath
  });

  const receiptPath = path.join(path.dirname(entrypointPath), 'install-receipt.json');
  const receipt = {
    kind: 'warp.tool-install-receipt.v1',
    tool: 'wesley',
    source,
    package: wesleySpec.package ?? null,
    version: wesleySpec.version ?? null,
    sourcePath,
    stagedPath: entrypointPath
  };
  await writeFile(receiptPath, JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  return {
    package: wesleySpec.package ?? null,
    version: wesleySpec.version ?? null,
    source,
    sourcePath,
    entrypointPath,
    receiptPath
  };
}

async function stageFileReference({ sourcePath, targetPath }) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await rm(targetPath, { force: true });

  try {
    await symlink(sourcePath, targetPath);
    return;
  } catch (error) {
    if (!isRetryableLinkError(error)) {
      throw error;
    }
  }

  await copyFile(sourcePath, targetPath);
  const sourceStat = await stat(sourcePath);
  await chmod(targetPath, sourceStat.mode);
}

async function writeWesleyWrapper({ sourcePath, targetPath }) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  const wrapper = [
    '#!/usr/bin/env node',
    `await import(${JSON.stringify(pathToFileURL(sourcePath).href)});`,
    ''
  ].join('\n');
  await writeFile(targetPath, wrapper, 'utf8');
  await chmod(targetPath, 0o755);
}

function isRetryableLinkError(error) {
  return ['EPERM', 'EEXIST', 'EXDEV', 'UNKNOWN'].includes(error?.code);
}

async function invokeWesleyForFamily({
  nodeBin,
  wesleyEntrypoint,
  wesleyWarpspaceBridgePath,
  family,
  projectDir,
  runCommand
}) {
  const schemaPath = family.materializeTo;
  const projections = new Set(Array.isArray(family.defaultProjections) ? family.defaultProjections : []);
  const commands = [];

  if (projections.has('typescript')) {
    commands.push(await invokeWesley({
      nodeBin,
      wesleyEntrypoint,
      projectDir,
      runCommand,
      args: ['typescript', '--schema', schemaPath, '--warpspace', wesleyWarpspaceBridgePath, '--json']
    }));
  }
  if (projections.has('zod')) {
    commands.push(await invokeWesley({
      nodeBin,
      wesleyEntrypoint,
      projectDir,
      runCommand,
      args: ['zod', '--schema', schemaPath, '--warpspace', wesleyWarpspaceBridgePath, '--json']
    }));
  }
  if (projections.has('echo-ir')) {
    commands.push(await invokeWesley({
      nodeBin,
      wesleyEntrypoint,
      projectDir,
      runCommand,
      args: ['bundle-echo', '--schema', schemaPath, '--warpspace', wesleyWarpspaceBridgePath, '--json']
    }));
  }
  if (projections.has('warp-ttd')) {
    commands.push(await invokeWesley({
      nodeBin,
      wesleyEntrypoint,
      projectDir,
      runCommand,
      args: ['compile-ttd', '--schema', schemaPath, '--warpspace', wesleyWarpspaceBridgePath, '--target', 'manifest,typescript', '--json']
    }));
  }

  return commands;
}

async function invokeWesley({ nodeBin, wesleyEntrypoint, projectDir, runCommand, args }) {
  const command = path.resolve(nodeBin);
  const fullArgs = [path.resolve(wesleyEntrypoint), ...args];
  const result = await runCommand({
    command,
    args: fullArgs,
    cwd: projectDir
  });

  if (result.status !== 0) {
    throw new Error(
      `Wesley command failed: ${command} ${fullArgs.join(' ')}\n${result.stderr || result.stdout || ''}`.trim()
    );
  }

  return {
    command,
    args: fullArgs,
    cwd: projectDir
  };
}

function buildLock({
  manifest,
  manifestPath,
  manifestHash,
  authorityRoot,
  template,
  templateArtifactPath,
  installLayout,
  toolchain,
  initializedAt,
  generated,
  generatedCommands,
  wesleyWarpspaceBridgePath
}) {
  return {
    kind: WARPSPACE_LOCK_KIND,
    profile: manifest.profile,
    releaseId: manifest.releaseId,
    initializedAt,
    manifest: {
      path: manifestPath,
      sha256: manifestHash,
      kind: manifest.kind
    },
    template: {
      id: template.id,
      artifactPath: templateArtifactPath
    },
    authorityRoot,
    installLayout,
    toolchain,
    stack: {
      families: manifest.families.map(family => ({
        id: family.id,
        version: family.version,
        sha256: family.sha256,
        sourcePath: family.sourcePath,
        materializeTo: family.materializeTo
      })),
      wesley: manifest.toolchain?.wesley ?? null,
      echo: manifest.runtimes?.echo ?? null,
      'git-warp': manifest.runtimes?.['git-warp'] ?? null,
      'warp-ttd': manifest.runtimes?.['warp-ttd'] ?? null
    },
    bootstrap: {
      tool: manifest.bootstrap.tool,
      command: manifest.bootstrap.command,
      generated,
      generatedCommands,
      wesleyWarpspaceBridgePath
    },
    engineLocal: {
      wesleyWarpspaceBridge: {
        kind: WESLEY_WARPSPACE_KIND,
        path: wesleyWarpspaceBridgePath
      }
    },
    localOverrides: manifest.localOverrides ?? null
  };
}

function renderWarpspaceToml({ manifest, installLayout }) {
  const lines = [
    'version = 1',
    `profile = ${tomlString(manifest.profile)}`,
    '',
    '[stack]',
    `release_id = ${tomlString(manifest.releaseId)}`,
    `template = ${tomlString(manifest.bootstrap.template.id)}`,
    '',
    '[toolchain]',
    `node_runtime = ${tomlString(manifest.toolchain?.node?.runtime ?? 'node')}`,
    `node_source = ${tomlString(manifest.toolchain?.node?.source ?? 'unknown')}`,
    `node_version_range = ${tomlString(manifest.toolchain?.node?.versionRange ?? 'unknown')}`,
    `wesley_package = ${tomlString(manifest.toolchain?.wesley?.package ?? 'unknown')}`,
    `wesley_version = ${tomlString(manifest.toolchain?.wesley?.version ?? 'unknown')}`,
    '',
    '[install]',
    `root = ${tomlString(installLayout.root)}`,
    `packages = ${tomlString(installLayout.packages)}`,
    `cache = ${tomlString(installLayout.cache)}`,
    `downloads = ${tomlString(installLayout.downloads)}`,
    '',
    '[contracts]',
    `root = ${tomlString(manifest.bootstrap.contractsRoot)}`,
    '',
    '[outputs]'
  ];

  for (const [name, outputPath] of Object.entries(manifest.bootstrap.defaultOutputs)) {
    lines.push(`${tomlKey(name)} = ${tomlString(outputPath)}`);
  }

  lines.push('', '[runtimes]');
  lines.push(`echo = ${tomlString(manifest.runtimes?.echo?.participation ?? 'unknown')}`);
  lines.push(`git_warp = ${tomlString(manifest.runtimes?.['git-warp']?.participation ?? 'unknown')}`);
  lines.push(`warp_ttd = ${tomlString(manifest.runtimes?.['warp-ttd']?.participation ?? 'unknown')}`);

  for (const family of manifest.families) {
    lines.push('', '[[family]]');
    lines.push(`id = ${tomlString(family.id)}`);
    lines.push(`version = ${tomlString(family.version)}`);
    lines.push(`source = ${tomlString(family.materializeTo)}`);
    lines.push(`projections = ${tomlArray(family.defaultProjections ?? [])}`);
  }

  lines.push('');
  return lines.join('\n');
}

function tomlKey(key) {
  return /^[A-Za-z0-9_-]+$/.test(key)
    ? key.replaceAll('-', '_')
    : tomlString(key);
}

function tomlArray(values) {
  return `[${values.map(value => tomlString(String(value))).join(', ')}]`;
}

function tomlString(value) {
  return JSON.stringify(String(value));
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function ensureTrailingNewline(content) {
  return content.endsWith('\n') ? content : `${content}\n`;
}

function normalizeNodeVersion(version) {
  return String(version).replace(/^v/, '');
}

function assertNodeVersionSatisfies({ actualVersion, requestedRange }) {
  if (!requestedRange.startsWith('>=')) {
    throw new Error(
      `Unsupported Node version range "${requestedRange}". ` +
      'The current prototype only supports ranges of the form ">=X.Y.Z".'
    );
  }

  const actual = parseSemver(normalizeNodeVersion(actualVersion));
  const minimum = parseSemver(requestedRange.slice(2));

  if (compareSemver(actual, minimum) < 0) {
    throw new Error(
      `Current Node ${normalizeNodeVersion(actualVersion)} does not satisfy ${requestedRange}.`
    );
  }
}

function parseSemver(input) {
  const match = String(input).trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Expected a semantic version like X.Y.Z, received "${input}".`);
  }
  return match.slice(1).map(value => Number.parseInt(value, 10));
}

function compareSemver(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) {
      return 1;
    }
    if (left[index] < right[index]) {
      return -1;
    }
  }
  return 0;
}

function renderWesleyWarpspaceBridge({ manifest }) {
  const bridge = {
    kind: WESLEY_WARPSPACE_KIND,
    profile: manifest.profile,
    stackRelease: {
      releaseId: manifest.releaseId
    },
    outputs: manifest.bootstrap.defaultOutputs
  };

  return `export default ${JSON.stringify(bridge, null, 2)};\n`;
}

async function defaultRunCommand({ command, args, cwd }) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8'
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? ''
  };
}

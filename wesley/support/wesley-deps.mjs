import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const SUPPORT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTINUUM_ROOT = path.resolve(SUPPORT_DIR, '..', '..');
const DEFAULT_WESLEY_ROOT = path.resolve(CONTINUUM_ROOT, '..', 'wesley');
const CONFIGURED_WESLEY_ROOT =
  normalizePath(process.env.WESLEY_REPO_ROOT) ??
  deriveWesleyRootFromCliPath(process.env.WESLEY_CLI_PATH) ??
  DEFAULT_WESLEY_ROOT;

const WESLEY_LAYOUT_HINT =
  'Install @wesley/cli and @wesley/core, set WESLEY_REPO_ROOT to a Wesley checkout, ' +
  'or set WESLEY_CLI_PATH to the sibling Wesley host CLI path.';

const coreModule = await importFirst('@wesley/core', [
  packageCandidate('@wesley/core'),
  wesleyFileCandidate('packages/wesley-core/src/index.mjs')
]);

const cliModule = await importFirst('@wesley/cli', [
  packageCandidate('@wesley/cli'),
  wesleyFileCandidate('packages/wesley-cli/src/index.mjs')
]);

const modulePortModule = await importFirst('WesleyModule', [
  installedFileCandidate('@wesley/core', 'ports/WesleyModule.mjs'),
  wesleyFileCandidate('packages/wesley-core/src/ports/WesleyModule.mjs')
]);

const schemaHashModule = await importFirst('schemaHashWithCrypto', [
  packageCandidate('@wesley/core/domain/schemaHash.mjs'),
  installedFileCandidate('@wesley/core', 'domain/schemaHash.mjs'),
  wesleyFileCandidate('packages/wesley-core/src/domain/schemaHash.mjs')
]);

export const {
  WesleyError,
  computeSdlHash,
  schemaHash
} = coreModule;
export const { WesleyCommand } = cliModule;
export const { WesleyModule } = modulePortModule;
export const { schemaHashWithCrypto } = schemaHashModule;
export const WESLEY_CLI_PACKAGE_VERSION = readWesleyCliPackageVersion();

const graphqlModule = loadGraphqlModule();
export const { Kind, parse } = graphqlModule;

export function joinPath(...parts) {
  const filtered = [];
  for (const part of parts) {
    if (part == null) {
      continue;
    }
    const text = String(part);
    if (text.length > 0) {
      filtered.push(text);
    }
  }

  return filtered.length === 0 ? '' : path.posix.join(...filtered);
}

export function canonicalizeSchemaPath(schemaPath) {
  if (schemaPath == null) {
    return null;
  }

  const text = String(schemaPath).trim();
  if (text.length === 0 || text === '-' || text === '<stdin>') {
    return null;
  }

  return path.resolve(text);
}

function packageCandidate(specifier) {
  return {
    label: specifier,
    load: () => import(specifier)
  };
}

function wesleyFileCandidate(relativePath) {
  const absolutePath = path.join(CONFIGURED_WESLEY_ROOT, relativePath);
  return {
    label: absolutePath,
    load: () => import(pathToFileURL(absolutePath).href)
  };
}

function installedFileCandidate(specifier, sourceRelativePath) {
  return {
    label: `${specifier}:${sourceRelativePath}`,
    load: async () => {
      const entrypoint = require.resolve(specifier);
      const sourceRoot = path.dirname(entrypoint);
      return import(pathToFileURL(path.join(sourceRoot, sourceRelativePath)).href);
    }
  };
}

async function importFirst(label, candidates) {
  const failures = [];
  for (const candidate of candidates) {
    try {
      return await candidate.load();
    } catch (error) {
      failures.push(`${candidate.label}: ${error.message}`);
    }
  }

  throw new Error(
    `Unable to load ${label} for the Continuum Wesley module. ${WESLEY_LAYOUT_HINT} ` +
    `Tried: ${failures.join('; ')}`
  );
}

function loadGraphqlModule() {
  try {
    return require('graphql');
  } catch (firstError) {
    const packageJson = path.join(CONFIGURED_WESLEY_ROOT, 'packages', 'wesley-cli', 'package.json');
    try {
      return createRequire(pathToFileURL(packageJson))('graphql');
    } catch (secondError) {
      throw new Error(
        `Unable to load graphql for the Continuum Wesley module. ${WESLEY_LAYOUT_HINT} ` +
        `Tried local package resolution (${firstError.message}) and ${packageJson} (${secondError.message}).`
      );
    }
  }
}

function readWesleyCliPackageVersion() {
  const candidates = [
    resolveInstalledPackageManifest('@wesley/cli'),
    path.join(CONFIGURED_WESLEY_ROOT, 'packages', 'wesley-cli', 'package.json')
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }
    const manifest = JSON.parse(readFileSync(candidate, 'utf8'));
    if (typeof manifest.version === 'string' && manifest.version.trim().length > 0) {
      return manifest.version.trim();
    }
  }

  throw new Error(`Unable to read @wesley/cli package version. ${WESLEY_LAYOUT_HINT}`);
}

function resolveInstalledPackageManifest(specifier) {
  try {
    let current = path.dirname(require.resolve(specifier));
    while (current !== path.dirname(current)) {
      const manifestPath = path.join(current, 'package.json');
      if (existsSync(manifestPath)) {
        return manifestPath;
      }
      current = path.dirname(current);
    }
  } catch {
    return null;
  }
  return null;
}

function deriveWesleyRootFromCliPath(cliPath) {
  const normalized = normalizePath(cliPath);
  if (normalized == null) {
    return null;
  }

  const cliDir = path.dirname(normalized);
  return path.resolve(cliDir, '..', '..', '..');
}

function normalizePath(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }
  return path.resolve(value.trim());
}

import path from 'node:path';

import { createCheck } from './continuum-witness-support.mjs';

const REALIZATION_MANIFEST_KIND = 'wesley.realization.manifest.v1';

export async function buildRealizationManifest({
  fs,
  crypto,
  schemaContent,
  schemaPath,
  outDir,
  targets = [],
  summary = {}
}) {
  const generatedLegs = {};
  for (const target of targets) {
    const outKey = target === 'warp-ttd' ? 'warpTtd' : target;
    const legOutDir = normalizePath(path.resolve(joinPath(outDir, target)));
    const files = await collectManifestFiles({ fs, crypto, root: legOutDir });
    generatedLegs[outKey] = {
      target,
      outDir: legOutDir,
      fileCount: files.length,
      files
    };
  }

  return {
    kind: REALIZATION_MANIFEST_KIND,
    schema: {
      path: schemaPath,
      hash: summary.schemaHash ?? await digestText({ crypto, text: schemaContent })
    },
    generatedLegs,
    generation: {
      status: 'generated',
      generatedFiles: Object.values(generatedLegs)
        .reduce((total, leg) => total + leg.fileCount, 0)
    }
  };
}

export async function inspectRealizationManifest({
  fs,
  crypto,
  realizationRoot
}) {
  if (realizationRoot == null) {
    return null;
  }

  const manifestPath = joinPath(realizationRoot, 'manifest.json');
  if (!(await fs.exists(manifestPath))) {
    return null;
  }

  const checks = [];
  let manifest;
  try {
    manifest = JSON.parse(await fs.read(manifestPath));
  } catch (error) {
    checks.push(createCheck(
      'realization.manifest-json',
      false,
      `Realization manifest at ${manifestPath} is not valid JSON: ${error.message}`,
      {
        manifestPath,
        error: error.message
      }
    ));
    return {
      manifestPath,
      manifest: null,
      checks
    };
  }

  checks.push(createCheck(
    'realization.manifest-kind',
    manifest.kind === REALIZATION_MANIFEST_KIND,
    manifest.kind === REALIZATION_MANIFEST_KIND
      ? 'Realization manifest declares the expected kind.'
      : `Realization manifest kind mismatch: ${manifest.kind}`,
    {
      manifestPath,
      expectedKind: REALIZATION_MANIFEST_KIND,
      actualKind: manifest.kind
    }
  ));

  const missingFiles = [];
  const digestMismatches = [];
  for (const leg of Object.values(manifest.generatedLegs ?? {})) {
    for (const file of leg.files ?? []) {
      if (!(await fs.exists(file.path))) {
        missingFiles.push(file.path);
        continue;
      }
      if (typeof file.digest === 'string') {
        const content = await fs.read(file.path);
        const digest = await digestText({ crypto, text: content });
        if (digest !== file.digest) {
          digestMismatches.push(file.path);
        }
      }
    }
  }

  checks.push(createCheck(
    'realization.generated-files-present',
    missingFiles.length === 0,
    missingFiles.length === 0
      ? 'All files declared by the realization manifest are present.'
      : `Missing realized files: ${missingFiles.join(', ')}`,
    { manifestPath, missingFiles }
  ));
  checks.push(createCheck(
    'realization.generated-file-digests',
    digestMismatches.length === 0,
    digestMismatches.length === 0
      ? 'All digest-bearing realized files match the manifest.'
      : `Realized file digests drifted: ${digestMismatches.join(', ')}`,
    { manifestPath, digestMismatches }
  ));

  return {
    manifestPath,
    manifest,
    checks
  };
}

async function collectManifestFiles({ fs, crypto, root }) {
  if (!(await fs.exists(root))) {
    return [];
  }

  const files = [];
  const walk = async (dir) => {
    const entries = await fs.readDir?.(dir);
    if (!Array.isArray(entries)) {
      return;
    }
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (entry.isDirectory) {
        await walk(entry.path);
        continue;
      }
      if (!entry.isFile) {
        continue;
      }
      const content = await fs.read(entry.path);
      files.push({
        path: normalizePath(path.resolve(entry.path)),
        relativePath: normalizePath(path.relative(root, entry.path)),
        digest: await digestText({ crypto, text: content })
      });
    }
  };

  await walk(root);
  return files;
}

async function digestText({ crypto, text }) {
  const subtle = crypto?.subtle ?? globalThis.crypto?.subtle;
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return hexFromArrayBuffer(digest);
}

function joinPath(...segments) {
  return normalizePath(path.join(...segments));
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function hexFromArrayBuffer(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

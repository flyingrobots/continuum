import { compileTtdProtocol } from '../../../wesley/packages/wesley-core/src/ttd/codegen/orchestrator.mjs';
import { WesleyError } from '../../../wesley/packages/wesley-core/src/index.mjs';
import { schemaHashWithCrypto } from '../../../wesley/packages/wesley-core/src/domain/schemaHash.mjs';
import { generateEcho } from '../../../wesley/packages/wesley-generator-echo/src/index.mjs';
import { canonicalizeSchemaPath, joinPath } from '../../../wesley/packages/wesley-cli/src/commands/path-utils.mjs';

const TTD_TARGETS = new Set(['manifest', 'typescript', 'rust']);
const DEFAULT_TTD_TARGETS = ['manifest', 'typescript'];
const ECHO_TARGET_KIND = 'continuum.wesley.target.echo.v1';
const WARP_TTD_TARGET_KIND = 'continuum.wesley.target.warp-ttd.v1';

export async function runCompileTtd({
  ctx,
  schemaContent,
  schemaPath,
  options = {},
  logger,
  outDir,
  emitTargets = DEFAULT_TTD_TARGETS
}) {
  const targets = normalizeTtdTargets(emitTargets);
  const result = await compileTtdProtocol({
    sdl: schemaContent,
    targets,
    deps: {
      crypto: ctx.crypto,
      clock: ctx.clock
    }
  });
  const dryRun = Boolean(options.dryRun);
  const files = result.files.map((file) => ({
    relativePath: normalizeRelativePath(file.path),
    outputPath: joinPath(outDir, file.path),
    content: normalizeContent(file.content)
  }));

  if (!dryRun) {
    await writeFiles(ctx.fs, files);
  }

  logger?.debug?.({ outDir, targets }, 'Compiled Continuum warp-ttd target');

  return {
    kind: WARP_TTD_TARGET_KIND,
    schemaPath,
    outDir,
    dryRun,
    targets,
    schemaHash: result.schemaHash,
    validation: result.validation,
    files: files.map((file) => ({
      path: file.outputPath,
      relativePath: file.relativePath,
      size: Buffer.byteLength(file.content)
    }))
  };
}

export async function runBundleEcho({
  ctx,
  schemaContent,
  schemaPath,
  options = {},
  logger,
  outDir
}) {
  const generated = await generateEcho({ sdl: schemaContent });
  const dryRun = Boolean(options.dryRun);
  const schemaHash = schemaHashWithCrypto(schemaContent, ctx.crypto);
  const generatedFiles = generated.files.map((file) => ({
    relativePath: normalizeRelativePath(file.path),
    outputPath: joinPath(outDir, file.path),
    content: normalizeContent(file.content)
  }));
  const irFile = generated.files.find((file) => file.path === 'ir.json');
  const ir = JSON.parse(normalizeContent(irFile?.content ?? '{}'));
  const deliveryRows = buildMockDeliveryRows(ir);
  const deliveryContent = deliveryRows.map((row) => JSON.stringify(row)).join('\n') + '\n';
  const outcomes = countDeliveryOutcomes(deliveryRows);
  const echoSummary = {
    artifactCount: generatedFiles.length,
    files: generatedFiles.map((file) => ({
      path: file.relativePath,
      size: Buffer.byteLength(file.content)
    })),
    ir: {
      typeCount: Array.isArray(ir.types) ? ir.types.length : 0,
      opCount: Array.isArray(ir.ops) ? ir.ops.length : 0
    }
  };
  const summary = {
    kind: 'wesley.echo-bundle.inspect.v1',
    schemaPath,
    canonicalSchemaPath: canonicalizeSchemaPath(schemaPath),
    schemaHash,
    echo: echoSummary,
    mock: {
      command: 'deliveries',
      observationCount: deliveryRows.length,
      outcomes
    }
  };
  const mockFiles = [
    {
      relativePath: 'mock/deliveries.jsonl',
      outputPath: joinPath(outDir, 'mock/deliveries.jsonl'),
      content: deliveryContent
    },
    {
      relativePath: 'mock/summary.json',
      outputPath: joinPath(outDir, 'mock/summary.json'),
      content: JSON.stringify(summary, null, 2) + '\n'
    }
  ];

  if (!dryRun) {
    await writeFiles(ctx.fs, [...generatedFiles, ...mockFiles]);
  }

  logger?.debug?.({ outDir }, 'Compiled Continuum Echo target');

  return {
    kind: ECHO_TARGET_KIND,
    schemaPath,
    outDir,
    dryRun,
    schemaHash,
    echo: echoSummary,
    mock: {
      outputPath: joinPath(outDir, 'mock/deliveries.jsonl'),
      summaryPath: joinPath(outDir, 'mock/summary.json')
    },
    files: [...generatedFiles, ...mockFiles].map((file) => ({
      path: file.relativePath,
      outputPath: file.outputPath,
      size: Buffer.byteLength(file.content)
    }))
  };
}

export function normalizeTtdTargets(rawTargets) {
  const selected = (Array.isArray(rawTargets) ? rawTargets : String(rawTargets ?? '').split(','))
    .map((target) => String(target).trim().toLowerCase())
    .filter(Boolean);
  const targets = selected.length === 0 ? DEFAULT_TTD_TARGETS : selected;
  const invalidTargets = targets.filter((target) => !TTD_TARGETS.has(target));
  if (invalidTargets.length > 0) {
    throw new WesleyError(
      'CONTINUUM_TTD_TARGET_INVALID',
      `Invalid warp-ttd emit target(s): ${invalidTargets.join(', ')}. Valid targets: ${[...TTD_TARGETS].join(', ')}.`
    );
  }
  return [...new Set(targets)];
}

async function writeFiles(fs, files) {
  for (const file of files) {
    await fs.write(file.outputPath, file.content);
  }
}

function buildMockDeliveryRows(ir) {
  const ops = Array.isArray(ir.ops) ? ir.ops : [];
  return ops.map((op, index) => ({
    envelope: 'DeliveryObservationSummary',
    data: {
      observationId: `obs:continuum:${safeIdentifier(op.name, index)}`,
      emissionId: `emit:continuum:${safeIdentifier(op.name, index)}`,
      headId: 'head:continuum:mock',
      frameIndex: index,
      sinkId: 'sink:continuum:mock',
      outcome: 'delivered',
      reason: 'mock-delivery',
      executionMode: 'mock',
      summary: `Mock delivery for ${op.name ?? `operation-${index}`}`
    }
  }));
}

function countDeliveryOutcomes(rows) {
  return rows.reduce((counts, row) => {
    const outcome = row?.data?.outcome ?? 'unknown';
    counts[outcome] = (counts[outcome] ?? 0) + 1;
    return counts;
  }, {});
}

function safeIdentifier(value, index) {
  const text = typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : `operation-${index}`;
  return text.replace(/[^a-zA-Z0-9_.:-]+/g, '-');
}

function normalizeRelativePath(value) {
  return String(value).replace(/\\/g, '/').replace(/^\/+/, '');
}

function normalizeContent(content) {
  if (typeof content === 'string') {
    return content;
  }
  return Buffer.from(content ?? '').toString('utf8');
}

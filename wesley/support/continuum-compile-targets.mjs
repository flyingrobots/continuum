import { compileTtdProtocol } from '../../../wesley/packages/wesley-core/src/ttd/codegen/orchestrator.mjs';
import { computeSdlHash, WesleyError } from '../../../wesley/packages/wesley-core/src/index.mjs';
import { schemaHashWithCrypto } from '../../../wesley/packages/wesley-core/src/domain/schemaHash.mjs';
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
  const generated = await generateContinuumEchoInspectArtifacts({
    ctx,
    schemaContent,
    schemaPath
  });
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

async function generateContinuumEchoInspectArtifacts({
  ctx,
  schemaContent,
  schemaPath
}) {
  const compiled = await compileTtdProtocol({
    sdl: schemaContent,
    targets: ['manifest'],
    deps: {
      crypto: ctx.crypto,
      clock: ctx.clock
    }
  });
  const ir = await buildEchoInspectIr({
    schema: compiled.schema,
    schemaContent,
    schemaPath
  });
  const files = [
    {
      path: 'ir.json',
      content: JSON.stringify(ir, null, 2) + '\n'
    },
    ...buildEchoGeneratedFiles(ir)
  ];

  return {
    files,
    schemaHash: compiled.schemaHash,
    validation: compiled.validation
  };
}

async function buildEchoInspectIr({
  schema,
  schemaContent,
  schemaPath
}) {
  const sdlHash = await computeSdlHash(schemaContent);
  return {
    ir_version: 'continuum.echo.inspect-ir/v1',
    schemaPath,
    canonical_schema_path: canonicalizeSchemaPath(schemaPath),
    schema_hash: sdlHash,
    schema_sha256: sdlHash,
    canonical_schema_hash: schema.schemaHash,
    types: [
      ...(schema.types ?? []).map((type) => ({
        name: type.name,
        kind: 'OBJECT',
        fields: (type.fields ?? []).map((field) => normalizeEchoField(field))
      })),
      ...(schema.enums ?? []).map((type) => ({
        name: type.name,
        kind: 'ENUM',
        values: [...(type.values ?? [])]
      }))
    ],
    ops: (schema.ops ?? []).map((op) => ({
      name: op.name,
      result_type: op.resultType,
      readonly: op.readonly === true,
      idempotent: op.idempotent === true,
      args: (op.args ?? []).map((arg) => normalizeEchoField(arg))
    }))
  };
}

function normalizeEchoField(field) {
  return {
    name: field.name,
    type: field.type,
    required: field.required === true,
    list: field.list === true
  };
}

function buildEchoGeneratedFiles(ir) {
  const objectTypes = (ir.types ?? []).filter((type) => type.kind === 'OBJECT');
  const enumTypes = (ir.types ?? []).filter((type) => type.kind === 'ENUM');
  return [
    {
      path: 'schemas.generated.ts',
      content: buildEchoSchemasTypeScript({ objectTypes, enumTypes })
    },
    {
      path: 'ops.generated.ts',
      content: buildEchoOpsTypeScript(ir.ops ?? [])
    },
    {
      path: 'client.generated.ts',
      content: buildEchoClientTypeScript(ir.ops ?? [])
    },
    {
      path: 'raw_le_codec.generated.ts',
      content: buildEchoCodecTypeScript('raw_le')
    },
    {
      path: 'raw_le_codec.generated.rs',
      content: buildEchoCodecRust('raw_le')
    },
    {
      path: 'wasm_abi_codec.generated.ts',
      content: buildEchoCodecTypeScript('wasm_abi')
    },
    {
      path: 'wasm_abi_codec.generated.rs',
      content: buildEchoCodecRust('wasm_abi')
    }
  ];
}

function buildEchoSchemasTypeScript({ objectTypes, enumTypes }) {
  const lines = [
    '// Generated by Continuum Wesley Echo inspect target. Do not edit by hand.',
    ''
  ];

  for (const enumType of enumTypes) {
    lines.push(
      `export type ${enumType.name} = ${enumType.values.map((value) => JSON.stringify(value)).join(' | ')};`,
      ''
    );
  }

  for (const type of objectTypes) {
    lines.push(`export interface ${type.name} {`);
    for (const field of type.fields) {
      lines.push(`  ${field.name}${field.required ? '' : '?'}: ${fieldTypeScriptType(field)};`);
    }
    lines.push('}', '');
  }

  return lines.join('\n');
}

function buildEchoOpsTypeScript(ops) {
  const lines = [
    '// Generated by Continuum Wesley Echo inspect target. Do not edit by hand.',
    '',
    'export const echoOperations = ['
  ];

  for (const op of ops) {
    lines.push(
      '  {',
      `    name: ${JSON.stringify(op.name)},`,
      `    resultType: ${JSON.stringify(op.result_type)},`,
      `    readonly: ${JSON.stringify(op.readonly === true)},`,
      `    args: ${JSON.stringify(op.args ?? [])}`,
      '  },'
    );
  }

  lines.push('] as const;', '');
  return lines.join('\n');
}

function buildEchoClientTypeScript(ops) {
  const lines = [
    '// Generated by Continuum Wesley Echo inspect target. Do not edit by hand.',
    '',
    'export interface EchoInspectClient {',
    '  call(operation: string, args?: Record<string, unknown>): Promise<unknown>;',
    '}',
    '',
    'export const echoOperationNames = ['
  ];

  for (const op of ops) {
    lines.push(`  ${JSON.stringify(op.name)},`);
  }

  lines.push('] as const;', '');
  return lines.join('\n');
}

function buildEchoCodecTypeScript(codecName) {
  return [
    '// Generated by Continuum Wesley Echo inspect target. Do not edit by hand.',
    '',
    `export const codecName = ${JSON.stringify(codecName)};`,
    'export type EncodedEnvelope = Uint8Array;',
    ''
  ].join('\n');
}

function buildEchoCodecRust(codecName) {
  return [
    '// Generated by Continuum Wesley Echo inspect target. Do not edit by hand.',
    '',
    `pub const CODEC_NAME: &str = ${JSON.stringify(codecName)};`,
    ''
  ].join('\n');
}

function fieldTypeScriptType(field) {
  const base = scalarTypeScriptType(field.type);
  return field.list ? `readonly ${base}[]` : base;
}

function scalarTypeScriptType(type) {
  switch (type) {
  case 'Int':
  case 'Float':
    return 'number';
  case 'Boolean':
    return 'boolean';
  default:
    return 'string';
  }
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

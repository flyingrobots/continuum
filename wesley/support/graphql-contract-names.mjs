import { Kind, parse } from './wesley-deps.mjs';

const ROOT_OPERATION_TYPE_NAMES = new Set(['Query', 'Mutation', 'Subscription']);

export function extractContractNames(schemaContent) {
  let document;
  try {
    document = parse(schemaContent, { noLocation: true });
  } catch (error) {
    return {
      names: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
  const names = [];
  for (const definition of document.definitions) {
    if (!definition.name?.value) {
      continue;
    }
    if (
      definition.kind === Kind.OBJECT_TYPE_DEFINITION ||
      definition.kind === Kind.INTERFACE_TYPE_DEFINITION ||
      definition.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION ||
      definition.kind === Kind.UNION_TYPE_DEFINITION ||
      definition.kind === Kind.ENUM_TYPE_DEFINITION ||
      definition.kind === Kind.SCALAR_TYPE_DEFINITION
    ) {
      if (!ROOT_OPERATION_TYPE_NAMES.has(definition.name.value)) {
        names.push(definition.name.value);
      }
    }
  }
  return { names, error: null };
}

export function declarationPatternForExtension(extension, familyName) {
  const name = escapeRegExp(familyName);
  if (extension === '.graphql' || extension === '.gql') {
    return new RegExp(`\\b(type|enum|input|interface|union|scalar)\\s+${name}\\b`, 'm');
  }
  if (extension === '.ts' || extension === '.tsx' || extension === '.js' || extension === '.mjs' || extension === '.cjs') {
    return new RegExp(`\\b(export\\s+)?(type|interface|class|enum)\\s+${name}\\b`, 'm');
  }
  if (extension === '.rs') {
    return new RegExp(`\\b(pub\\s+)?(struct|enum|type)\\s+${name}\\b`, 'm');
  }
  return null;
}

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

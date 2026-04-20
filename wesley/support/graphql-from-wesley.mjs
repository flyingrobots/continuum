import { createRequire } from 'node:module';

const requireFromWesley = createRequire(new URL('../../../wesley/packages/wesley-cli/package.json', import.meta.url));
const graphql = requireFromWesley('graphql');

export const { Kind, parse } = graphql;

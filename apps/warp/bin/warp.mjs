#!/usr/bin/env node

import process from 'node:process';
import { main } from '../src/cli.mjs';

const exitCode = await main(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr
});

process.exit(exitCode);

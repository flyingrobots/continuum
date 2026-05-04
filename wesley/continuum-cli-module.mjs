import { WesleyModule } from './support/wesley-deps.mjs';

import { ContractCommand } from './commands/contract.mjs';
import { DriftWatchCommand } from './commands/drift-watch.mjs';
import { ObserverPlanCommand } from './commands/observer-plan.mjs';
import { WitnessCommand } from './commands/witness.mjs';
import { WitnessContinuumCommand } from './commands/witness-continuum.mjs';
import { runBundleEcho, runCompileTtd } from './support/continuum-compile-targets.mjs';

export class ContinuumCliModule extends WesleyModule {
  get apiVersion() {
    return '1';
  }

  get name() {
    return 'continuum';
  }

  get capabilities() {
    return {
      wesley: {
        targets: [
          {
            name: 'warp-ttd',
            aliases: ['ttd'],
            compile: ({ ctx, schemaContent, schemaPath, options, logger, outDir }) => runCompileTtd({
              ctx,
              schemaContent,
              schemaPath,
              options,
              outDir,
              logger
            })
          },
          {
            name: 'echo',
            compile: ({ ctx, schemaContent, schemaPath, options, logger, outDir }) => runBundleEcho({
              ctx,
              schemaContent,
              schemaPath,
              options,
              outDir,
              logger
            })
          }
        ]
      }
    };
  }

  async registerCliCommands(ctx) {
    new ContractCommand(ctx);
    new DriftWatchCommand(ctx);
    new ObserverPlanCommand(ctx);
    new WitnessCommand(ctx);
    new WitnessContinuumCommand(ctx);
  }
}

export const wesleyModule = new ContinuumCliModule();

export default wesleyModule;

import { WesleyModule } from '../../wesley/packages/wesley-core/src/ports/WesleyModule.mjs';

import { ContractCommand } from '../../wesley/packages/wesley-cli/src/commands/contract.mjs';
import { DriftWatchCommand } from '../../wesley/packages/wesley-cli/src/commands/drift-watch.mjs';
import { ObserverPlanCommand } from '../../wesley/packages/wesley-cli/src/commands/observer-plan.mjs';
import { WitnessCommand } from '../../wesley/packages/wesley-cli/src/commands/witness.mjs';
import { WitnessContinuumCommand } from '../../wesley/packages/wesley-cli/src/commands/witness-continuum.mjs';

export class ContinuumCliModule extends WesleyModule {
  get apiVersion() {
    return '1';
  }

  get name() {
    return 'continuum';
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

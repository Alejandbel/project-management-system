import { AsyncContainerModule } from 'inversify';

import { ConfigService } from './config';
import { DatabaseClient } from './database';

export const coreModule = new AsyncContainerModule(async (bind) => {
  bind<ConfigService>(ConfigService).toSelf();
  bind<DatabaseClient>(DatabaseClient).toSelf().inSingletonScope();
});

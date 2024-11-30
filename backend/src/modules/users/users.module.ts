import { AsyncContainerModule } from 'inversify';

import './controllers';
import * as Repositories from './repositories';
import * as Services from './services';

const repositories = Object.values(Repositories);
const services = Object.values(Services);

export const usersModule = new AsyncContainerModule(async (bind) => {
  repositories.forEach((repository) => bind(repository as any).toSelf());
  services.forEach((service) => bind(service as any).toSelf());
});

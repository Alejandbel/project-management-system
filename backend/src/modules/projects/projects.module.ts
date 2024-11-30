import { AsyncContainerModule } from 'inversify';

import './controllers';
import * as Repositories from './repositories';
import * as Services from './services';

const repositories = Object.values(Repositories);
const services = Object.values(Services);

export const projectsModule = new AsyncContainerModule(async (bind) => {
  services.forEach((service) => bind(service as any).toSelf());
  repositories.forEach((repository) => bind(repository as any).toSelf());
});

import { AsyncContainerModule } from 'inversify';

import './controllers';
import { AuthorizedMiddleware } from './middlewares';
import * as Services from './services';

const services = Object.values(Services);

export const authModule = new AsyncContainerModule(async (bind) => {
  services.forEach((service) => bind(service as any).toSelf());
  bind(AuthorizedMiddleware).toSelf();
});

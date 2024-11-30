import { injectable } from 'inversify';

import { EnvKey, envMapper, EnvMapper } from './config.initializers';

@injectable()
export class ConfigService {
  get<TKey extends EnvKey>(key: TKey): ReturnType<EnvMapper[TKey]> {
    const value = process.env[key];

    if (!value) {
      throw new Error(`Value for ${key} not provided`);
    }

    return envMapper[key](value) as never;
  }
}

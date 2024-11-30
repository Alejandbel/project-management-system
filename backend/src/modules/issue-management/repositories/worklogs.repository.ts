import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { Worklog } from '../types';

@injectable()
export class WorklogsRepository extends BaseRepository<Worklog> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('worklog', databaseClient);
  }
}

import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { Issue } from '../types';

@injectable()
export class IssuesRepository extends BaseRepository<Issue> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('issue', databaseClient);
  }
}

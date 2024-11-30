import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { IssueStatus } from '../types';

@injectable()
export class IssueStatusesRepository extends BaseRepository<IssueStatus> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('issue_status', databaseClient);
  }
}

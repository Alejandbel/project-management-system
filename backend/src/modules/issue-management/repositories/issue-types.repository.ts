import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { IssueType } from '../types';

@injectable()
export class IssueTypesRepository extends BaseRepository<IssueType> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('issue_type', databaseClient);
  }
}

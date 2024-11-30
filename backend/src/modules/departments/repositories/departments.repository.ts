import { inject, injectable } from 'inversify';

import { DatabaseClient, BaseRepository } from '@modules/core';

import { Department } from '../types';

@injectable()
export class DepartmentsRepository extends BaseRepository<Department> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('department', databaseClient);
  }
}

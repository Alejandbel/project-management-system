import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { EmployeeRole } from '../types';

@injectable()
export class EmployeeRolesRepository extends BaseRepository<EmployeeRole> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('employee_role', databaseClient);
  }
}

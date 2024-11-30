import { inject, injectable } from 'inversify';

import { DatabaseClient, BaseRepository } from '@modules/core';

import { User, UsersListOptions, UserWithRole } from '../types';

@injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('user', databaseClient);
  }

  async findWithRoles(
    where: Partial<User>,
    { offset, limit, sortDirection, sortField }: Partial<UsersListOptions>,
  ): Promise<UserWithRole[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT "user"."id",
                 "user"."email",
                 "user"."name",
                 "user"."startWorksAt",
                 "user"."endWorksAt",
                 "user"."roleId",
                 "er"."title" AS "role",
                 get_user_last_salary_change_date("user"."id") AS "lastSalaryChangeDate"
          FROM "user"
                   INNER JOIN "employee_role" "er" ON "user"."roleId" = "er"."id"
          WHERE TRUE
              ${this.formWhereClause(where)}
          ${
            sortField && sortDirection
              ? ` ORDER BY "${this.entityName}"."${sortField.toString()}" ${sortDirection}`
              : ''
          }
          ${limit ? ' LIMIT :limit' : ''} 
          ${offset ? ' OFFSET :offset' : ''}
          ;
      `,
      { ...where, sortField, sortDirection, offset, limit },
    );

    const res = await this.databaseClient.query<UserWithRole>(query, params);
    return res.rows;
  }

  async findOneWithRole(where: Partial<User> = {}): Promise<UserWithRole | undefined> {
    const [user] = await this.findWithRoles(where, { limit: 1 });
    return user;
  }
}

import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient } from '@modules/core';

import { UserSalary, UserSalaryWithUser } from '../types';

@injectable()
export class UserSalariesRepository extends BaseRepository<UserSalary> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('user_salary', databaseClient);
  }

  async findByPeriod(period: Date): Promise<UserSalaryWithUser[]> {
    const [sql, params] = this.databaseClient.escapeQueryWithParameters(
      `
        SELECT "user_salary".*, "user"."name" AS "userName" 
            FROM "user_salary"
                     INNER JOIN "user" ON "user_salary"."userId" = "user"."id"
            WHERE "period" = :period
            ORDER BY "userName" 
    `,
      { period },
    );

    const res = await this.databaseClient.query<UserSalaryWithUser>(sql, params);
    return res.rows;
  }

  async insertSalariesForAllUsers(period: Date): Promise<void> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
        INSERT INTO "user_salary"("userId", "period")
        SELECT "user"."id", :period
        FROM "user"
        ;
    `,
      { period },
    );

    await this.databaseClient.query(query, params);
  }
}

import { inject, injectable } from 'inversify';

import { BaseRepository, DatabaseClient, SortDirection } from '@modules/core';

import { Project, ProjectWithRelations } from '../types';

@injectable()
export class ProjectsRepository extends BaseRepository<Project> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('project', databaseClient);
  }

  async findWithRelations(
    where: Partial<Project> = {},
    {
      limit,
      offset,
      sortField,
      sortDirection,
    }: { limit?: number; offset?: number; sortField?: keyof Project; sortDirection?: SortDirection } = {},
  ): Promise<ProjectWithRelations[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT "project".*, "d"."title" AS "department", "u"."name" AS "lead"
          FROM "project"
                   LEFT JOIN "public"."user" "u" ON "u"."id" = "project"."leadId"
                   INNER JOIN "public"."department" "d" ON "d"."id" = "project"."departmentId"
          WHERE TRUE
              ${this.formWhereClause(where)} ${
                sortField && sortDirection
                  ? ` ORDER BY "${this.entityName}"."${sortField.toString()}" ${sortDirection}`
                  : ''
              } ${limit ? ' LIMIT :limit' : ''} ${offset ? ' OFFSET :offset' : ''}
          ;
      `,
      { ...where, sortField, sortDirection, offset, limit },
    );

    const res = await this.databaseClient.query<ProjectWithRelations>(query, params);

    return res.rows;
  }
}

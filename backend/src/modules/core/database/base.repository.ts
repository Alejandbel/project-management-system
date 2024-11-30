import { injectable, unmanaged } from 'inversify';

import { SortDirection } from '@modules/core';

import { DatabaseClient } from './database.client';

@injectable()
export class BaseRepository<TEntity extends Record<string, unknown> & { id: number }> {
  constructor(
    @unmanaged() protected readonly entityName: string,
    @unmanaged() protected readonly databaseClient: DatabaseClient,
  ) {}

  async create(entity: Partial<TEntity>): Promise<number> {
    const entityKeys = Object.keys(entity);

    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          INSERT INTO "${this.entityName}" (${entityKeys.map((key) => `"${key}"`).join(', ')})
          VALUES (${entityKeys.map((key) => `:${key}`).join(', ')})
          RETURNING "id"
          ;
      `,
      entity,
    );

    const res = await this.databaseClient.query(query, params);

    return res.rows[0].id;
  }

  async updateById(id: number, set: Partial<Omit<TEntity, 'id'>>): Promise<number> {
    if (!set || !Object.keys(set).length) {
      return 0;
    }

    const setKeys = Object.keys(set);

    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          UPDATE "${this.entityName}"
          SET ${setKeys.map((key) => `"${key}" = :${key}`).join(', ')}
          WHERE "id" = :id
          RETURNING "id"
          ;
      `,
      { ...set, id },
    );

    const res = await this.databaseClient.query(query, params);

    return res.rows.length;
  }

  async deleteById(id: number): Promise<void> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          DELETE FROM "${this.entityName}"
          WHERE "id" = :id
          ;
      `,
      { id },
    );

    await this.databaseClient.query(query, params);
  }

  async find(
    where: Partial<TEntity> = {},
    {
      sortField,
      sortDirection,
      offset,
      limit,
    }: { limit?: number; offset?: number; sortField?: keyof TEntity; sortDirection?: SortDirection } = {},
  ): Promise<TEntity[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT *
          FROM "${this.entityName}"
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

    const res = await this.databaseClient.query<TEntity>(query, params);

    return res.rows;
  }

  async findWithCount(
    where: Partial<TEntity> = {},
    options: { limit?: number; offset?: number; sortField?: keyof TEntity; sortDirection?: SortDirection } = {},
  ): Promise<[TEntity[], number]> {
    return Promise.all([this.find(where, options), this.count(where)]);
  }

  async count(where: Partial<TEntity> = {}): Promise<number> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT COUNT(*) as total
          FROM "${this.entityName}"
          WHERE TRUE
              ${this.formWhereClause(where)}
          ;
      `,
      where,
    );

    const res = await this.databaseClient.query<TEntity>(query, params);

    return parseInt(res.rows[0].total as string);
  }

  protected formWhereClause(where: Partial<TEntity>, entityName: string = this.entityName): string {
    return Object.keys(where)
      .filter((key) => where[key])
      .map((key) => `AND "${entityName}"."${key}" = :${key}`)
      .join('\n');
  }

  async findOne(where: Partial<TEntity> = {}): Promise<TEntity | undefined> {
    const res = await this.find(where, { limit: 1 });
    return res[0];
  }
}

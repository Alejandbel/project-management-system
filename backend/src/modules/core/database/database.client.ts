import { injectable } from 'inversify';
import migrate from 'node-pg-migrate';
import { Client, QueryResult, QueryResultRow, types } from 'pg';

import { ConfigService } from '../config';

@injectable()
export class DatabaseClient {
  client: Client;

  constructor(configService: ConfigService) {
    types.setTypeParser(20, parseInt);
    this.client = new Client({
      database: configService.get('DB_DATABASE'),
      password: configService.get('DB_PASS'),
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      user: configService.get('DB_USER'),
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async migrate(): Promise<void> {
    await migrate({ dbClient: this.client, migrationsTable: 'pgmigrations', dir: './migrations', direction: 'up' });
  }

  query<TRes extends QueryResultRow, TParams extends unknown[] = unknown[]>(
    sql: string,
    parameters: TParams,
  ): Promise<QueryResult<TRes>> {
    return this.client.query<TRes>(sql, parameters);
  }

  escapeQueryWithParameters(
    sql: string,
    parameters: Record<string, unknown>,
    nativeParameters: Record<string, unknown> = {},
  ): [string, unknown[]] {
    const escapedParameters = Object.keys(nativeParameters).map((key) => nativeParameters[key]);

    if (!parameters || !Object.keys(parameters).length) {
      return [sql, escapedParameters];
    }

    const parsedSql = sql.replace(/:(\.\.\.)?([A-Za-z0-9_.]+)/g, (full, isArray, key) => {
      if (!Object.prototype.hasOwnProperty.call(parameters, key)) {
        return full;
      }

      const value = parameters[key];

      if (isArray) {
        return (value as unknown[])
          .map((v) => {
            escapedParameters.push(v);

            return `$${escapedParameters.length}`;
          })
          .join(', ');
      }

      escapedParameters.push(value);

      return `$${escapedParameters.length}`;
    });

    return [parsedSql, escapedParameters];
  }
}

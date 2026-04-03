import { pool } from "./pg-pool.js";
import type { DatabaseClient } from "./database-client.interface.js";

export class PgDatabaseClient implements DatabaseClient {
    async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
        const result = await pool.query(sql, params);
        return result.rows as T[];
    }
}
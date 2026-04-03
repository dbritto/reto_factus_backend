// src/infrastructure/database/database-client.interface.ts
export interface DatabaseClient {
    query<T>(sql: string, params?: unknown[]): Promise<T[]>;
}
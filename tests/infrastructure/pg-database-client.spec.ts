import { describe, expect, it, jest } from "@jest/globals";

const poolQueryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>>();

jest.unstable_mockModule("../../src/infrastructure/database/pg-pool.js", () => ({
  pool: {
    query: poolQueryMock,
  },
}));

const { PgDatabaseClient } = await import("../../src/infrastructure/database/pg-database-client.js");

describe("PgDatabaseClient", () => {
  it("query delega en pool.query y retorna rows", async () => {
    poolQueryMock.mockResolvedValue({ rows: [{ id: "1" }] });
    const client = new PgDatabaseClient();

    const result = await client.query<{ id: string }>("SELECT * FROM users WHERE id = $1", ["1"]);

    expect(poolQueryMock).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", ["1"]);
    expect(result).toEqual([{ id: "1" }]);
  });
});

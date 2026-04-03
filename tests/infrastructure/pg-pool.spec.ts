import { afterEach, describe, expect, it, jest } from "@jest/globals";

describe("pg-pool", () => {
  const baseEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...baseEnv };
    jest.resetModules();
  });

  it("configura Pool con ssl habilitado", async () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "postgres";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "factus";
    process.env.DB_SSL = "true";

    const fakePool = { query: jest.fn(), end: jest.fn() };
    const PoolMock = jest.fn();
    PoolMock.mockReturnValue(fakePool);

    jest.unstable_mockModule("pg", () => ({ Pool: PoolMock }));

    const mod = await import("../../src/infrastructure/database/pg-pool.js");

    expect(PoolMock).toHaveBeenCalledWith({
      host: "localhost",
      port: 5433,
      user: "postgres",
      password: "secret",
      database: "factus",
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    expect(mod.pool).toBe(fakePool);
  });

  it("usa puerto default y ssl false", async () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "";
    process.env.DB_USER = "postgres";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "factus";
    process.env.DB_SSL = "false";

    const PoolMock = jest.fn();
    PoolMock.mockReturnValue({ query: jest.fn(), end: jest.fn() });

    jest.unstable_mockModule("pg", () => ({ Pool: PoolMock }));

    await import("../../src/infrastructure/database/pg-pool.js");

    expect(PoolMock).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 5432,
        ssl: false,
      })
    );
  });
});

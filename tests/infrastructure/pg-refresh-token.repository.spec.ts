import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { PgRefreshTokenRepository } from "../../src/infrastructure/repositories/pg-refresh-token.repository.js";
import type { DatabaseClient } from "../../src/infrastructure/database/database-client.interface.js";

describe("PgRefreshTokenRepository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();

  const db = {
    query: ((sql: string, params?: unknown[]) =>
      queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("save inserta refresh token", async () => {
    queryMock.mockResolvedValue([]);
    const repo = new PgRefreshTokenRepository(db);
    const expiresAt = new Date("2030-01-01T00:00:00.000Z");

    await repo.save("user-1", "token-1", expiresAt);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO refresh_tokens"),
      ["user-1", "token-1", expiresAt]
    );
  });

  it("findValidByToken retorna null cuando no hay registro", async () => {
    queryMock.mockResolvedValue([]);
    const repo = new PgRefreshTokenRepository(db);

    const result = await repo.findValidByToken("missing-token");

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE token = $1"),
      ["missing-token"]
    );
    expect(result).toBeNull();
  });

  it("findValidByToken mapea fila a RefreshTokenRecord", async () => {
    queryMock.mockResolvedValue([
      {
        user_id: "user-2",
        token: "token-2",
        expires_at: "2030-01-01T00:00:00.000Z",
        revoked: false,
      },
    ]);
    const repo = new PgRefreshTokenRepository(db);

    const result = await repo.findValidByToken("token-2");

    expect(result).toEqual({
      userId: "user-2",
      token: "token-2",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
      revoked: false,
    });
  });

  it("revokeByToken marca token como revocado", async () => {
    queryMock.mockResolvedValue([]);
    const repo = new PgRefreshTokenRepository(db);

    await repo.revokeByToken("token-3");

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("SET revoked = true"),
      ["token-3"]
    );
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { DatabaseClient } from "../../../src/infrastructure/database/database-client.interface.js";
import { softDeleteProducto } from "../../../src/infrastructure/repositories/producto/delete-producto.repository.js";

describe("softDeleteProducto repository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) => queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna true cuando hay fila retornada", async () => {
    queryMock.mockResolvedValueOnce([{ id_producto: 3 }]);

    const result = await softDeleteProducto(db, 3);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("SET deleted_at = NOW()"),
      [3]
    );
    expect(result).toBe(true);
  });

  it("retorna false cuando no hay filas retornadas", async () => {
    queryMock.mockResolvedValueOnce([]);

    const result = await softDeleteProducto(db, 3);

    expect(result).toBe(false);
  });
});

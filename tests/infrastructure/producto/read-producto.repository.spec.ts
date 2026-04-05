import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { DatabaseClient } from "../../../src/infrastructure/database/database-client.interface.js";
import {
  findAllProductos,
  findProductoById,
} from "../../../src/infrastructure/repositories/producto/read-producto.repository.js";

describe("read producto repository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) => queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("findProductoById retorna null cuando no existe", async () => {
    queryMock.mockResolvedValueOnce([]);

    const result = await findProductoById(db, 999);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id_producto = $1 AND deleted_at IS NULL"),
      [999]
    );
    expect(result).toBeNull();
  });

  it("findProductoById retorna producto mapeado cuando existe", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id_producto: 5,
        nombre_producto: "Leche",
        cantidad: 10,
        descuento: 0,
        precio: 15,
        tax_rate: 19,
        id_unidad_de_medida: 1,
        id_identificacion_del_producto: 1,
        iva: 19,
        id_tipo_de_producto: 2,
        id_tributo: 1,
        code_reference: "LEC-001",
        created_at: "2030-01-01T00:00:00.000Z",
        updated_at: "2030-01-01T00:00:00.000Z",
        deleted_at: null,
      },
    ]);

    const result = await findProductoById(db, 5);

    expect(result?.idProducto).toBe(5);
    expect(result?.nombreProducto).toBe("Leche");
  });

  it("findAllProductos retorna lista mapeada", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id_producto: 1,
        nombre_producto: "A",
        cantidad: 1,
        descuento: 0,
        precio: 10,
        tax_rate: 19,
        id_unidad_de_medida: 1,
        id_identificacion_del_producto: 1,
        iva: 19,
        id_tipo_de_producto: 1,
        id_tributo: 1,
        code_reference: "A-1",
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
      {
        id_producto: 2,
        nombre_producto: "B",
        cantidad: 2,
        descuento: 0,
        precio: 20,
        tax_rate: 19,
        id_unidad_de_medida: 1,
        id_identificacion_del_producto: 1,
        iva: 19,
        id_tipo_de_producto: 1,
        id_tributo: 1,
        code_reference: "B-2",
        created_at: null,
        updated_at: null,
        deleted_at: null,
      },
    ]);

    const result = await findAllProductos(db);

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE deleted_at IS NULL"),
      undefined
    );
    expect(result).toHaveLength(2);
    expect(result[0]?.idProducto).toBe(1);
    expect(result[1]?.idProducto).toBe(2);
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import type { DatabaseClient } from "../../../src/infrastructure/database/database-client.interface.js";
import { createProducto } from "../../../src/infrastructure/repositories/producto/create-producto.repository.js";

function buildProducto(): Producto {
  return new Producto({
    nombreProducto: "Producto Nuevo",
    cantidad: 5,
    descuento: 1,
    precio: 250,
    taxRate: 19,
    idUnidadDeMedida: 1,
    idIdentificacionDelProducto: 2,
    iva: 19,
    idTipoDeProducto: 3,
    idTributo: 1,
    codeReference: "P-250",
  });
}

describe("createProducto repository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) => queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserta producto y retorna entidad mapeada", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id_producto: 10,
        nombre_producto: "Producto Nuevo",
        cantidad: 5,
        descuento: 1,
        precio: 250,
        tax_rate: 19,
        id_unidad_de_medida: 1,
        id_identificacion_del_producto: 2,
        iva: 19,
        id_tipo_de_producto: 3,
        id_tributo: 1,
        code_reference: "P-250",
        created_at: "2030-01-01T00:00:00.000Z",
        updated_at: "2030-01-01T00:00:00.000Z",
        deleted_at: null,
      },
    ]);

    const result = await createProducto(db, buildProducto());

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO producto"),
      ["Producto Nuevo", 5, 1, 250, 19, 1, 2, 19, 3, 1, "P-250"]
    );
    expect(result.idProducto).toBe(10);
    expect(result.nombreProducto).toBe("Producto Nuevo");
  });

  it("lanza error cuando INSERT no retorna fila", async () => {
    queryMock.mockResolvedValueOnce([]);

    await expect(createProducto(db, buildProducto())).rejects.toThrow("No se pudo crear el producto");
  });
});

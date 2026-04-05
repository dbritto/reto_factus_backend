import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import type { DatabaseClient } from "../../../src/infrastructure/database/database-client.interface.js";
import { updateProducto } from "../../../src/infrastructure/repositories/producto/update-producto.repository.js";

function buildProducto(overrides: Partial<ConstructorParameters<typeof Producto>[0]> = {}): Producto {
  return new Producto({
    idProducto: 7,
    nombreProducto: "Actualizado",
    cantidad: 8,
    descuento: 1,
    precio: 300,
    taxRate: 19,
    idUnidadDeMedida: 1,
    idIdentificacionDelProducto: 2,
    iva: 19,
    idTipoDeProducto: 3,
    idTributo: 1,
    codeReference: "UPD-300",
    ...overrides,
  });
}

describe("updateProducto repository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) => queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lanza error si producto no tiene idProducto", async () => {
    await expect(updateProducto(db, buildProducto({ idProducto: undefined }))).rejects.toThrow(
      "idProducto es requerido para actualizar"
    );
    expect(queryMock).not.toHaveBeenCalled();
  });

  it("retorna null cuando UPDATE no retorna filas", async () => {
    queryMock.mockResolvedValueOnce([]);

    const result = await updateProducto(db, buildProducto());

    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("WHERE id_producto = $12 AND deleted_at IS NULL"),
      ["Actualizado", 8, 1, 300, 19, 1, 2, 19, 3, 1, "UPD-300", 7]
    );
    expect(result).toBeNull();
  });

  it("retorna producto mapeado cuando UPDATE retorna fila", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id_producto: 7,
        nombre_producto: "Actualizado",
        cantidad: 8,
        descuento: 1,
        precio: 300,
        tax_rate: 19,
        id_unidad_de_medida: 1,
        id_identificacion_del_producto: 2,
        iva: 19,
        id_tipo_de_producto: 3,
        id_tributo: 1,
        code_reference: "UPD-300",
        created_at: "2030-01-01T00:00:00.000Z",
        updated_at: "2030-01-02T00:00:00.000Z",
        deleted_at: null,
      },
    ]);

    const result = await updateProducto(db, buildProducto());

    expect(result?.idProducto).toBe(7);
    expect(result?.nombreProducto).toBe("Actualizado");
  });
});

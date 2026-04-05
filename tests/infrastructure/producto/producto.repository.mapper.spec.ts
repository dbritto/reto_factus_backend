import { describe, expect, it } from "@jest/globals";
import { mapRowToProducto } from "../../../src/infrastructure/repositories/producto/producto.repository.mapper.js";
import type { ProductoRow } from "../../../src/infrastructure/repositories/producto/producto.repository.types.js";

function buildRow(overrides: Partial<ProductoRow> = {}): ProductoRow {
  return {
    id_producto: 1,
    nombre_producto: "Producto A",
    cantidad: 10,
    descuento: 1,
    precio: 100,
    tax_rate: 19,
    id_unidad_de_medida: 2,
    id_identificacion_del_producto: 3,
    iva: 19,
    id_tipo_de_producto: 4,
    id_tributo: 1,
    code_reference: "P-001",
    created_at: "2030-01-01T00:00:00.000Z",
    updated_at: "2030-01-02T00:00:00.000Z",
    deleted_at: null,
    ...overrides,
  };
}

describe("mapRowToProducto", () => {
  it("mapea fila completa a entidad Producto", () => {
    const producto = mapRowToProducto(buildRow());

    expect(producto.idProducto).toBe(1);
    expect(producto.nombreProducto).toBe("Producto A");
    expect(producto.taxRate).toBe(19);
    expect(producto.codeReference).toBe("P-001");
    expect(producto.createdAt).toEqual(new Date("2030-01-01T00:00:00.000Z"));
    expect(producto.updatedAt).toEqual(new Date("2030-01-02T00:00:00.000Z"));
    expect(producto.deletedAt).toBeNull();
  });

  it("deja createdAt/updatedAt undefined cuando no vienen y mapea deletedAt", () => {
    const producto = mapRowToProducto(
      buildRow({
        created_at: null,
        updated_at: null,
        deleted_at: "2030-01-03T00:00:00.000Z",
      })
    );

    expect(producto.createdAt).toBeUndefined();
    expect(producto.updatedAt).toBeUndefined();
    expect(producto.deletedAt).toEqual(new Date("2030-01-03T00:00:00.000Z"));
  });
});

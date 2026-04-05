import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import type { ProductoRepository } from "../../../src/domain/repositories/producto/producto.repository.js";
import { UpdateProductoUseCase } from "../../../src/application/use-cases/producto/update-producto.use_case.js";

describe("UpdateProductoUseCase", () => {
  const updateMock = jest.fn<(producto: Producto) => Promise<Producto | null>>();

  const productoRepository = {
    update: updateMock,
  } as unknown as ProductoRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("actualiza y retorna producto", async () => {
    const updated = new Producto({
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
    });

    updateMock.mockResolvedValue(updated);
    const useCase = new UpdateProductoUseCase(productoRepository);

    const result = await useCase.execute(7, {
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
    });

    expect(updateMock).toHaveBeenCalledTimes(1);
    const updateArg = updateMock.mock.calls[0]?.[0];
    expect(updateArg).toBeInstanceOf(Producto);
    expect(updateArg?.idProducto).toBe(7);
    expect(result).toBe(updated);
  });

  it("lanza ProductoNotFoundException cuando no encuentra", async () => {
    updateMock.mockResolvedValue(null);
    const useCase = new UpdateProductoUseCase(productoRepository);

    await expect(
      useCase.execute(404, {
        nombreProducto: "N/A",
        cantidad: 0,
        descuento: 0,
        precio: 0,
        taxRate: 0,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 2,
        iva: 0,
        idTipoDeProducto: 3,
      })
    ).rejects.toBeInstanceOf(ProductoNotFoundException);
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import type { ProductoRepository } from "../../../src/domain/repositories/producto/producto.repository.js";
import { DeleteProductoUseCase } from "../../../src/application/use-cases/producto/delete-producto.use_case.js";

describe("DeleteProductoUseCase", () => {
  const findByIdMock = jest.fn<(idProducto: number) => Promise<Producto | null>>();
  const deleteMock = jest.fn<(idProducto: number) => Promise<boolean>>();

  const productoRepository = {
    findById: findByIdMock,
    delete: deleteMock,
  } as unknown as ProductoRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna producto cuando findById existe y delete retorna true", async () => {
    const producto = new Producto({
      idProducto: 10,
      nombreProducto: "A",
      cantidad: 1,
      descuento: 0,
      precio: 100,
      taxRate: 19,
      idUnidadDeMedida: 1,
      idIdentificacionDelProducto: 2,
      iva: 19,
      idTipoDeProducto: 3,
    });
    findByIdMock.mockResolvedValue(producto);
    deleteMock.mockResolvedValue(true);
    const useCase = new DeleteProductoUseCase(productoRepository);

    await expect(useCase.execute(10)).resolves.toBe(producto);
    expect(findByIdMock).toHaveBeenCalledWith(10);
    expect(deleteMock).toHaveBeenCalledWith(10);
  });

  it("lanza ProductoNotFoundException cuando findById retorna null", async () => {
    findByIdMock.mockResolvedValue(null);
    const useCase = new DeleteProductoUseCase(productoRepository);

    await expect(useCase.execute(10)).rejects.toBeInstanceOf(ProductoNotFoundException);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("lanza ProductoNotFoundException cuando delete retorna false", async () => {
    findByIdMock.mockResolvedValue(
      new Producto({
        idProducto: 10,
        nombreProducto: "A",
        cantidad: 1,
        descuento: 0,
        precio: 100,
        taxRate: 19,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 2,
        iva: 19,
        idTipoDeProducto: 3,
      })
    );
    deleteMock.mockResolvedValue(false);
    const useCase = new DeleteProductoUseCase(productoRepository);

    await expect(useCase.execute(10)).rejects.toBeInstanceOf(ProductoNotFoundException);
  });
});

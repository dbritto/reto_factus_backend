import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import type { ProductoRepository } from "../../../src/domain/repositories/producto/producto.repository.js";
import { GetProductoUseCase } from "../../../src/application/use-cases/producto/get-producto.use_case.js";

describe("GetProductoUseCase", () => {
  const findByIdMock = jest.fn<(idProducto: number) => Promise<Producto | null>>();

  const productoRepository = {
    findById: findByIdMock,
  } as unknown as ProductoRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna producto cuando existe", async () => {
    const producto = new Producto({
      idProducto: 11,
      nombreProducto: "Producto A",
      cantidad: 10,
      descuento: 0,
      precio: 100,
      taxRate: 19,
      idUnidadDeMedida: 1,
      idIdentificacionDelProducto: 2,
      iva: 19,
      idTipoDeProducto: 3,
    });

    findByIdMock.mockResolvedValue(producto);
    const useCase = new GetProductoUseCase(productoRepository);

    const result = await useCase.execute(11);

    expect(findByIdMock).toHaveBeenCalledWith(11);
    expect(result).toBe(producto);
  });

  it("lanza ProductoNotFoundException cuando no existe", async () => {
    findByIdMock.mockResolvedValue(null);
    const useCase = new GetProductoUseCase(productoRepository);

    await expect(useCase.execute(99)).rejects.toBeInstanceOf(ProductoNotFoundException);
  });
});

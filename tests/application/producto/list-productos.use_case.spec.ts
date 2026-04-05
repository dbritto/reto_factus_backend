import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../src/domain/repositories/producto/producto.repository.js";
import { ListProductosUseCase } from "../../../src/application/use-cases/producto/list-productos.use_case.js";

describe("ListProductosUseCase", () => {
  const findAllMock = jest.fn<() => Promise<Producto[]>>();

  const productoRepository = {
    findAll: findAllMock,
  } as unknown as ProductoRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna listado desde repository.findAll", async () => {
    const productos = [
      new Producto({
        idProducto: 1,
        nombreProducto: "Producto A",
        cantidad: 10,
        descuento: 0,
        precio: 100,
        taxRate: 19,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 2,
        iva: 19,
        idTipoDeProducto: 3,
      }),
      new Producto({
        idProducto: 2,
        nombreProducto: "Producto B",
        cantidad: 5,
        descuento: 1,
        precio: 200,
        taxRate: 19,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 2,
        iva: 19,
        idTipoDeProducto: 3,
      }),
    ];

    findAllMock.mockResolvedValue(productos);
    const useCase = new ListProductosUseCase(productoRepository);

    const result = await useCase.execute();

    expect(findAllMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(productos);
  });
});

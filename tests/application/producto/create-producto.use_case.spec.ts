import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../src/domain/repositories/producto/producto.repository.js";
import { CreateProductoUseCase } from "../../../src/application/use-cases/producto/create-producto.use_case.js";

describe("CreateProductoUseCase", () => {
  const createMock = jest.fn<(producto: Producto) => Promise<Producto>>();

  const productoRepository = {
    create: createMock,
  } as unknown as ProductoRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("crea entidad y delega en repository.create", async () => {
    const created = new Producto({
      idProducto: 20,
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

    createMock.mockResolvedValue(created);
    const useCase = new CreateProductoUseCase(productoRepository);

    const result = await useCase.execute({
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

    expect(createMock).toHaveBeenCalledTimes(1);
    const createdArg = createMock.mock.calls[0]?.[0];
    expect(createdArg).toBeInstanceOf(Producto);
    expect(createdArg?.nombreProducto).toBe("Producto Nuevo");
    expect(result).toBe(created);
  });
});

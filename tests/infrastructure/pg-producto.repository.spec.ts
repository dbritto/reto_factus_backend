import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Producto } from "../../src/domain/entities/producto/producto.entity.js";
import type { DatabaseClient } from "../../src/infrastructure/database/database-client.interface.js";

const createProductoMock = jest.fn<(db: DatabaseClient, producto: Producto) => Promise<Producto>>();
const findProductoByIdMock = jest.fn<
  (db: DatabaseClient, idProducto: number) => Promise<Producto | null>
>();
const findAllProductosMock = jest.fn<(db: DatabaseClient) => Promise<Producto[]>>();
const updateProductoMock = jest.fn<(db: DatabaseClient, producto: Producto) => Promise<Producto | null>>();
const softDeleteProductoMock = jest.fn<(db: DatabaseClient, idProducto: number) => Promise<boolean>>();

jest.unstable_mockModule("../../src/infrastructure/repositories/producto/create-producto.repository.js", () => ({
  createProducto: createProductoMock,
}));

jest.unstable_mockModule("../../src/infrastructure/repositories/producto/read-producto.repository.js", () => ({
  findProductoById: findProductoByIdMock,
  findAllProductos: findAllProductosMock,
}));

jest.unstable_mockModule("../../src/infrastructure/repositories/producto/update-producto.repository.js", () => ({
  updateProducto: updateProductoMock,
}));

jest.unstable_mockModule("../../src/infrastructure/repositories/producto/delete-producto.repository.js", () => ({
  softDeleteProducto: softDeleteProductoMock,
}));

const { PgProductoRepository } = await import("../../src/infrastructure/repositories/pg-producto.repository.js");

function buildProducto(overrides?: Partial<ConstructorParameters<typeof Producto>[0]>): Producto {
  return new Producto({
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
    idTributo: 1,
    codeReference: "P-001",
    ...overrides,
  });
}

describe("PgProductoRepository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) => queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create delega en createProducto", async () => {
    const producto = buildProducto();
    createProductoMock.mockResolvedValue(producto);
    const repo = new PgProductoRepository(db);

    const result = await repo.create(producto);

    expect(createProductoMock).toHaveBeenCalledWith(db, producto);
    expect(result).toBe(producto);
  });

  it("create envuelve errores de infraestructura", async () => {
    const producto = buildProducto();
    const originalError = new Error("db fail");
    createProductoMock.mockRejectedValue(originalError);
    const repo = new PgProductoRepository(db);

    await expect(repo.create(producto)).rejects.toThrow("Failed to create producto");
  });

  it("findById delega en findProductoById", async () => {
    const producto = buildProducto();
    findProductoByIdMock.mockResolvedValue(producto);
    const repo = new PgProductoRepository(db);

    const result = await repo.findById(1);

    expect(findProductoByIdMock).toHaveBeenCalledWith(db, 1);
    expect(result).toBe(producto);
  });

  it("findById envuelve errores de infraestructura", async () => {
    findProductoByIdMock.mockRejectedValue(new Error("db fail"));
    const repo = new PgProductoRepository(db);

    await expect(repo.findById(1)).rejects.toThrow("Failed to find producto by id");
  });

  it("findAll delega en findAllProductos", async () => {
    const productos = [buildProducto({ idProducto: 1 }), buildProducto({ idProducto: 2 })];
    findAllProductosMock.mockResolvedValue(productos);
    const repo = new PgProductoRepository(db);

    const result = await repo.findAll();

    expect(findAllProductosMock).toHaveBeenCalledWith(db);
    expect(result).toEqual(productos);
  });

  it("findAll envuelve errores de infraestructura", async () => {
    findAllProductosMock.mockRejectedValue(new Error("db fail"));
    const repo = new PgProductoRepository(db);

    await expect(repo.findAll()).rejects.toThrow("Failed to list productos");
  });

  it("update delega en updateProducto", async () => {
    const producto = buildProducto({ idProducto: 3 });
    updateProductoMock.mockResolvedValue(producto);
    const repo = new PgProductoRepository(db);

    const result = await repo.update(producto);

    expect(updateProductoMock).toHaveBeenCalledWith(db, producto);
    expect(result).toBe(producto);
  });

  it("update envuelve errores de infraestructura", async () => {
    const producto = buildProducto({ idProducto: 3 });
    updateProductoMock.mockRejectedValue(new Error("db fail"));
    const repo = new PgProductoRepository(db);

    await expect(repo.update(producto)).rejects.toThrow("Failed to update producto");
  });

  it("delete delega en softDeleteProducto", async () => {
    softDeleteProductoMock.mockResolvedValue(true);
    const repo = new PgProductoRepository(db);

    const result = await repo.delete(9);

    expect(softDeleteProductoMock).toHaveBeenCalledWith(db, 9);
    expect(result).toBe(true);
  });

  it("delete envuelve errores de infraestructura", async () => {
    softDeleteProductoMock.mockRejectedValue(new Error("db fail"));
    const repo = new PgProductoRepository(db);

    await expect(repo.delete(9)).rejects.toThrow("Failed to delete producto");
  });
});

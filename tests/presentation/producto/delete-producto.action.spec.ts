import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { Producto } from "../../../src/domain/entities/producto/producto.entity.js";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import { deleteProductoAction } from "../../../src/presentation/controller/producto/delete-producto.action.js";

function mockRes(): Response {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock; send: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("deleteProductoAction", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 200 con mensaje y producto cuando elimina", async () => {
    const req = { params: { idProducto: "3" } } as unknown as Request;
    const res = mockRes();
    const producto = new Producto({
      idProducto: 3,
      nombreProducto: "A",
      cantidad: 1,
      descuento: 0,
      precio: 100,
      taxRate: 19,
      idUnidadDeMedida: 1,
      idIdentificacionDelProducto: 1,
      iva: 19,
      idTipoDeProducto: 1,
    });
    executeMock.mockResolvedValue(producto);

    await deleteProductoAction({ execute: executeMock } as any, req, res);

    expect(executeMock).toHaveBeenCalledWith(3);
    expect((res.status as any)).toHaveBeenCalledWith(200);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 200,
      message: "Producto eliminado exitosamente",
      data: producto,
    });
  });

  it("retorna 404 cuando no existe", async () => {
    const req = { params: { idProducto: "3" } } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new ProductoNotFoundException(3));

    await deleteProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(404);
  });

  it("retorna 400 para id invalido", async () => {
    const req = { params: { idProducto: "x" } } as unknown as Request;
    const res = mockRes();

    await deleteProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(400);
  });

  it("retorna 500 para error inesperado", async () => {
    const req = { params: { idProducto: "3" } } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new Error("boom"));

    await deleteProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(500);
  });
});

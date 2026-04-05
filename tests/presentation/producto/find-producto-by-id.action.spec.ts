import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import { findProductoByIdAction } from "../../../src/presentation/controller/producto/find-producto-by-id.action.js";

function mockRes(): Response {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("findProductoByIdAction", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 200 cuando encuentra producto", async () => {
    const req = { params: { idProducto: "10" } } as unknown as Request;
    const res = mockRes();
    executeMock.mockResolvedValue({ idProducto: 10 });

    await findProductoByIdAction({ execute: executeMock } as any, req, res);

    expect(executeMock).toHaveBeenCalledWith(10);
    expect((res.status as any)).toHaveBeenCalledWith(200);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 200,
      message: "Producto obtenido exitosamente",
      data: { idProducto: 10 },
    });
  });

  it("retorna 404 cuando use case lanza ProductoNotFoundException", async () => {
    const req = { params: { idProducto: "10" } } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new ProductoNotFoundException(10));

    await findProductoByIdAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(404);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 404,
      message: "No se encontró ningún producto con el id '10'.",
      data: null,
    });
  });

  it("retorna 400 cuando id es invalido", async () => {
    const req = { params: { idProducto: "abc" } } as unknown as Request;
    const res = mockRes();

    await findProductoByIdAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(400);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 400,
      message: "idProducto must be a positive integer",
      data: null,
    });
  });

  it("retorna 500 para error no controlado", async () => {
    const req = { params: { idProducto: "10" } } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new Error("boom"));

    await findProductoByIdAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(500);
  });
});

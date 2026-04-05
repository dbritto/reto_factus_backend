import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { findAllProductosAction } from "../../../src/presentation/controller/producto/find-all-productos.action.js";

function mockRes(): Response {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("findAllProductosAction", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 200 con lista de productos", async () => {
    const req = {} as Request;
    const res = mockRes();
    executeMock.mockResolvedValue([{ idProducto: 1 }]);

    await findAllProductosAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(200);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 200,
      message: "Productos obtenidos exitosamente",
      data: [{ idProducto: 1 }],
    });
  });

  it("retorna 200 con mensaje de lista vacia cuando no hay productos", async () => {
    const req = {} as Request;
    const res = mockRes();
    executeMock.mockResolvedValue([]);

    await findAllProductosAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(200);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 200,
      message: "No hay productos disponibles",
      data: [],
    });
  });

  it("retorna 500 cuando execute falla", async () => {
    const req = {} as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new Error("boom"));

    await findAllProductosAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(500);
    expect((res.json as any)).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

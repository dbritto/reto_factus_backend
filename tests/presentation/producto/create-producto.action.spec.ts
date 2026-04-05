import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { createProductoAction } from "../../../src/presentation/controller/producto/create-producto.action.js";

function mockRes(): Response {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("createProductoAction", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 201 cuando crea correctamente", async () => {
    const req = {
      body: {
        nombreProducto: "A",
        cantidad: 1,
        descuento: 0,
        precio: 100,
        taxRate: 19,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 1,
        iva: 19,
        idTipoDeProducto: 1,
      },
    } as Request;
    const res = mockRes();
    executeMock.mockResolvedValue({ idProducto: 1 });

    await createProductoAction({ execute: executeMock } as any, req, res);

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect((res.status as any)).toHaveBeenCalledWith(201);
    expect((res.json as any)).toHaveBeenCalledWith({
      status: 201,
      message: "Producto creado exitosamente",
      data: { idProducto: 1 },
    });
  });

  it("retorna 400 cuando body es invalido", async () => {
    const req = { body: null } as unknown as Request;
    const res = mockRes();

    await createProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(400);
    expect((res.json as any)).toHaveBeenCalledWith({ message: "Request body is missing" });
  });

  it("retorna 500 cuando ocurre error inesperado", async () => {
    const req = {
      body: {
        nombreProducto: "A",
        cantidad: 1,
        descuento: 0,
        precio: 100,
        taxRate: 19,
        idUnidadDeMedida: 1,
        idIdentificacionDelProducto: 1,
        iva: 19,
        idTipoDeProducto: 1,
      },
    } as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new Error("db down"));

    await createProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(500);
    expect((res.json as any)).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

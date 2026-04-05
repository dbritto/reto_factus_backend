import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { ProductoNotFoundException } from "../../../src/domain/exceptions/producto.exceptions.js";
import { updateProductoAction } from "../../../src/presentation/controller/producto/update-producto.action.js";

function mockRes(): Response {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("updateProductoAction", () => {
  const executeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 200 cuando actualiza", async () => {
    const req = {
      params: { idProducto: "9" },
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
    } as unknown as Request;
    const res = mockRes();
    executeMock.mockResolvedValue({ idProducto: 9 });

    await updateProductoAction({ execute: executeMock } as any, req, res);

    expect(executeMock).toHaveBeenCalledWith(9, expect.any(Object));
    expect((res.status as any)).toHaveBeenCalledWith(200);
  });

  it("retorna 404 si producto no existe", async () => {
    const req = {
      params: { idProducto: "9" },
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
    } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new ProductoNotFoundException(9));

    await updateProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(404);
  });

  it("retorna 400 para body invalido", async () => {
    const req = { params: { idProducto: "9" }, body: null } as unknown as Request;
    const res = mockRes();

    await updateProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(400);
  });

  it("retorna 500 para error inesperado", async () => {
    const req = {
      params: { idProducto: "9" },
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
    } as unknown as Request;
    const res = mockRes();
    executeMock.mockRejectedValue(new Error("boom"));

    await updateProductoAction({ execute: executeMock } as any, req, res);

    expect((res.status as any)).toHaveBeenCalledWith(500);
  });
});

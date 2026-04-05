import { describe, expect, it } from "@jest/globals";
import { validateCreateProductoDto } from "../../../src/application/dtos/create-producto.dto.js";

describe("validateCreateProductoDto", () => {
  const validBody = {
    nombreProducto: "Producto A",
    cantidad: 10,
    descuento: 0,
    precio: 100,
    taxRate: 19,
    idUnidadDeMedida: 1,
    idIdentificacionDelProducto: 2,
    iva: 19,
    idTipoDeProducto: 3,
  };

  it("lanza error si body no es objeto", () => {
    expect(() => validateCreateProductoDto(null)).toThrow("Request body is missing");
  });

  it("lanza error si nombreProducto falta o es vacio", () => {
    expect(() => validateCreateProductoDto({ ...validBody, nombreProducto: undefined })).toThrow(
      "nombreProducto is required"
    );

    expect(() => validateCreateProductoDto({ ...validBody, nombreProducto: "   " })).toThrow(
      "nombreProducto is required"
    );
  });

  it("lanza error cuando un campo numerico requerido no es numero valido", () => {
    expect(() => validateCreateProductoDto({ ...validBody, cantidad: "10" })).toThrow(
      "cantidad must be a valid number"
    );

    expect(() => validateCreateProductoDto({ ...validBody, descuento: Number.NaN })).toThrow(
      "descuento must be a valid number"
    );

    expect(() => validateCreateProductoDto({ ...validBody, precio: "100" })).toThrow(
      "precio must be a valid number"
    );

    expect(() => validateCreateProductoDto({ ...validBody, taxRate: "19" })).toThrow(
      "taxRate must be a valid number"
    );

    expect(() => validateCreateProductoDto({ ...validBody, idUnidadDeMedida: "1" })).toThrow(
      "idUnidadDeMedida must be a valid number"
    );

    expect(() =>
      validateCreateProductoDto({ ...validBody, idIdentificacionDelProducto: "2" })
    ).toThrow("idIdentificacionDelProducto must be a valid number");

    expect(() => validateCreateProductoDto({ ...validBody, iva: "19" })).toThrow(
      "iva must be a valid number"
    );

    expect(() => validateCreateProductoDto({ ...validBody, idTipoDeProducto: "3" })).toThrow(
      "idTipoDeProducto must be a valid number"
    );
  });

  it("lanza error si idTributo viene y no es numero", () => {
    expect(() => validateCreateProductoDto({ ...validBody, idTributo: "1" })).toThrow(
      "idTributo must be a valid number"
    );
  });

  it("lanza error si codeReference viene y no es string", () => {
    expect(() => validateCreateProductoDto({ ...validBody, codeReference: 123 })).toThrow(
      "codeReference must be a string"
    );
  });

  it("retorna dto normalizado cuando datos son validos sin opcionales", () => {
    const dto = validateCreateProductoDto({ ...validBody, nombreProducto: "  Producto A  " });

    expect(dto).toEqual({
      ...validBody,
      nombreProducto: "Producto A",
    });
  });

  it("retorna dto con opcionales normalizados cuando vienen en payload", () => {
    const dto = validateCreateProductoDto({
      ...validBody,
      idTributo: 5,
      codeReference: "  COD-001  ",
    });

    expect(dto).toEqual({
      ...validBody,
      idTributo: 5,
      codeReference: "COD-001",
    });
  });
});

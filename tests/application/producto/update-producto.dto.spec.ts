import { describe, expect, it } from "@jest/globals";
import { validateUpdateProductoDto } from "../../../src/application/dtos/update-producto.dto.js";

describe("validateUpdateProductoDto", () => {
  const validBody = {
    nombreProducto: "Producto B",
    cantidad: 5,
    descuento: 1,
    precio: 200,
    taxRate: 19,
    idUnidadDeMedida: 1,
    idIdentificacionDelProducto: 2,
    iva: 19,
    idTipoDeProducto: 3,
  };

  it("reutiliza las mismas validaciones del create dto", () => {
    expect(() => validateUpdateProductoDto({ ...validBody, precio: "200" })).toThrow(
      "precio must be a valid number"
    );
  });

  it("retorna dto valido cuando payload es correcto", () => {
    const dto = validateUpdateProductoDto(validBody);

    expect(dto).toEqual(validBody);
  });
});

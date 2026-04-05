export interface CreateProductoDto {
  nombreProducto: string;
  cantidad: number;
  descuento: number;
  precio: number;
  taxRate: number;
  idUnidadDeMedida: number;
  idIdentificacionDelProducto: number;
  iva: number;
  idTipoDeProducto: number;
  idTributo?: number;
  codeReference?: string;
}

function requireNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  return value;
}

export function validateCreateProductoDto(body: unknown): CreateProductoDto {
  if (typeof body !== "object" || body === null) {
    throw new Error("Request body is missing");
  }

  const {
    nombreProducto,
    cantidad,
    descuento,
    precio,
    taxRate,
    idUnidadDeMedida,
    idIdentificacionDelProducto,
    iva,
    idTipoDeProducto,
    idTributo,
    codeReference,
  } = body as Record<string, unknown>;

  if (typeof nombreProducto !== "string" || nombreProducto.trim() === "") {
    throw new Error("nombreProducto is required");
  }

  const dto: CreateProductoDto = {
    nombreProducto: nombreProducto.trim(),
    cantidad: requireNumber(cantidad, "cantidad"),
    descuento: requireNumber(descuento, "descuento"),
    precio: requireNumber(precio, "precio"),
    taxRate: requireNumber(taxRate, "taxRate"),
    idUnidadDeMedida: requireNumber(idUnidadDeMedida, "idUnidadDeMedida"),
    idIdentificacionDelProducto: requireNumber(idIdentificacionDelProducto, "idIdentificacionDelProducto"),
    iva: requireNumber(iva, "iva"),
    idTipoDeProducto: requireNumber(idTipoDeProducto, "idTipoDeProducto"),
  };

  if (idTributo !== undefined) {
    dto.idTributo = requireNumber(idTributo, "idTributo");
  }

  if (codeReference !== undefined) {
    if (typeof codeReference !== "string") {
      throw new Error("codeReference must be a string");
    }
    dto.codeReference = codeReference.trim();
  }

  return dto;
}

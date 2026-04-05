import type { Response } from "express";

const productoValidationErrors = new Set([
  "Request body is missing",
  "nombreProducto is required",
  "cantidad must be a valid number",
  "descuento must be a valid number",
  "precio must be a valid number",
  "taxRate must be a valid number",
  "idUnidadDeMedida must be a valid number",
  "idIdentificacionDelProducto must be a valid number",
  "iva must be a valid number",
  "idTipoDeProducto must be a valid number",
  "idTributo must be a valid number",
  "codeReference must be a string",
  "idProducto must be a positive integer",
]);

export function getSafeMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}

export function parseProductoId(paramId: string | string[] | undefined): number {
  const normalizedParam = Array.isArray(paramId) ? paramId[0] : paramId;
  const idProducto = Number(normalizedParam);
  if (!Number.isInteger(idProducto) || idProducto <= 0) {
    throw new Error("idProducto must be a positive integer");
  }
  return idProducto;
}

export function isProductoValidationError(message: string): boolean {
  return productoValidationErrors.has(message);
}

export function sendUnexpectedError(res: Response, logContext: string, error: unknown): Response {
  console.error(`${logContext} unexpected error:`, error);
  return res.status(500).json({ message: "Internal server error" });
}

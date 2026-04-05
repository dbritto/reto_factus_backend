import type { CreateProductoDto } from "./create-producto.dto.js";
import { validateCreateProductoDto } from "./create-producto.dto.js";

export type UpdateProductoDto = CreateProductoDto;

export function validateUpdateProductoDto(body: unknown): UpdateProductoDto {
  return validateCreateProductoDto(body);
}

import type { Request, Response } from "express";
import type { UpdateProductoUseCase } from "../../../application/use-cases/producto/update-producto.use_case.js";
import { validateUpdateProductoDto } from "../../../application/dtos/update-producto.dto.js";
import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import {
  getSafeMessage,
  isProductoValidationError,
  parseProductoId,
  sendUnexpectedError,
} from "./producto-action.utils.js";

export async function updateProductoAction(
  updateProductoUseCase: UpdateProductoUseCase,
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const idProducto = parseProductoId(req.params.idProducto);
    const dto = validateUpdateProductoDto(req.body);
    const result = await updateProductoUseCase.execute(idProducto, dto);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ProductoNotFoundException) {
      return res.status(404).json({ message: getSafeMessage(error, "Producto not found") });
    }

    const message = getSafeMessage(error, "Invalid update producto request");
    if (isProductoValidationError(message)) {
      return res.status(400).json({ message });
    }

    return sendUnexpectedError(res, "[ProductoController.update]", error);
  }
}

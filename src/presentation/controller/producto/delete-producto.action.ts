import type { Request, Response } from "express";
import type { DeleteProductoUseCase } from "../../../application/use-cases/producto/delete-producto.use_case.js";
import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import {
  getSafeMessage,
  isProductoValidationError,
  parseProductoId,
  sendUnexpectedError,
} from "./producto-action.utils.js";

export async function deleteProductoAction(
  deleteProductoUseCase: DeleteProductoUseCase,
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const idProducto = parseProductoId(req.params.idProducto);
    const deletedProducto = await deleteProductoUseCase.execute(idProducto);
    return res.status(200).json({
      status: 200,
      message: "Producto eliminado exitosamente",
      data: deletedProducto,
    });
  } catch (error) {
    if (error instanceof ProductoNotFoundException) {
      return res.status(404).json({ message: getSafeMessage(error, "Producto not found") });
    }

    const message = getSafeMessage(error, "Invalid delete producto request");
    if (isProductoValidationError(message)) {
      return res.status(400).json({ message });
    }

    return sendUnexpectedError(res, "[ProductoController.delete]", error);
  }
}

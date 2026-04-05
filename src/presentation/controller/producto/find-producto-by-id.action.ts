import type { Request, Response } from "express";
import type { GetProductoUseCase } from "../../../application/use-cases/producto/get-producto.use_case.js";
import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import {
  getSafeMessage,
  isProductoValidationError,
  parseProductoId,
  sendUnexpectedError,
} from "./producto-action.utils.js";

export async function findProductoByIdAction(
  getProductoUseCase: GetProductoUseCase,
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const idProducto = parseProductoId(req.params.idProducto);
    const result = await getProductoUseCase.execute(idProducto);
    return res.status(200).json({
      status: 200,
      message: "Producto obtenido exitosamente",
      data: result,
    });
  } catch (error) {
    if (error instanceof ProductoNotFoundException) {
      return res.status(404).json({
        status: 404,
        message: getSafeMessage(error, "Producto not found"),
        data: null,
      });
    }

    const message = getSafeMessage(error, "Invalid get producto request");
    if (isProductoValidationError(message)) {
      return res.status(400).json({
        status: 400,
        message,
        data: null,
      });
    }

    return sendUnexpectedError(res, "[ProductoController.findById]", error);
  }
}

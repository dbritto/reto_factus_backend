import type { Request, Response } from "express";
import type { CreateProductoUseCase } from "../../../application/use-cases/producto/create-producto.use_case.js";
import { validateCreateProductoDto } from "../../../application/dtos/create-producto.dto.js";
import {
  getSafeMessage,
  isProductoValidationError,
  sendUnexpectedError,
} from "./producto-action.utils.js";

export async function createProductoAction(
  createProductoUseCase: CreateProductoUseCase,
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const dto = validateCreateProductoDto(req.body);
    const result = await createProductoUseCase.execute(dto);
    return res.status(201).json({
      status: 201,
      message: "Producto creado exitosamente",
      data: result,
    });
  } catch (error) {
    const message = getSafeMessage(error, "Invalid create producto request");
    if (isProductoValidationError(message)) {
      return res.status(400).json({ message });
    }

    return sendUnexpectedError(res, "[ProductoController.create]", error);
  }
}

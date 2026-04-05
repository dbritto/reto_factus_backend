import type { Request, Response } from "express";
import type { ListProductosUseCase } from "../../../application/use-cases/producto/list-productos.use_case.js";
import { sendUnexpectedError } from "./producto-action.utils.js";

export async function findAllProductosAction(
  listProductosUseCase: ListProductosUseCase,
  _req: Request,
  res: Response
): Promise<Response> {
  try {
    const result = await listProductosUseCase.execute();
    const isEmpty = result.length === 0;

    return res.status(200).json({
      status: 200,
      message: isEmpty ? "No hay productos disponibles" : "Productos obtenidos exitosamente",
      data: result,
    });
  } catch (error) {
    return sendUnexpectedError(res, "[ProductoController.findAll]", error);
  }
}

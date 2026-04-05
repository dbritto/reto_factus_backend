import { Router } from "express";
import type { CreateProductoUseCase } from "../../application/use-cases/producto/create-producto.use_case.js";
import type { DeleteProductoUseCase } from "../../application/use-cases/producto/delete-producto.use_case.js";
import type { GetProductoUseCase } from "../../application/use-cases/producto/get-producto.use_case.js";
import type { ListProductosUseCase } from "../../application/use-cases/producto/list-productos.use_case.js";
import type { UpdateProductoUseCase } from "../../application/use-cases/producto/update-producto.use_case.js";
import { createProductoAction } from "../controller/producto/create-producto.action.js";
import { deleteProductoAction } from "../controller/producto/delete-producto.action.js";
import { findAllProductosAction } from "../controller/producto/find-all-productos.action.js";
import { findProductoByIdAction } from "../controller/producto/find-producto-by-id.action.js";
import { updateProductoAction } from "../controller/producto/update-producto.action.js";
import { authMiddleware, authorizePermissions } from "../middleware/auth.middleware.js";

const INVENTORY_READ_PERMISSION = "inventory:read";
const INVENTORY_UPDATE_PERMISSION = "inventory:update";

export interface ProductoRouteActions {
  createProductoUseCase: CreateProductoUseCase;
  getProductoUseCase: GetProductoUseCase;
  listProductosUseCase: ListProductosUseCase;
  updateProductoUseCase: UpdateProductoUseCase;
  deleteProductoUseCase: DeleteProductoUseCase;
}

export function buildProductoRouter(actions: ProductoRouteActions): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", authorizePermissions(INVENTORY_READ_PERMISSION), (req, res) => {
    void findAllProductosAction(actions.listProductosUseCase, req, res);
  });

  router.get("/:idProducto", authorizePermissions(INVENTORY_READ_PERMISSION), (req, res) => {
    void findProductoByIdAction(actions.getProductoUseCase, req, res);
  });

  router.post("/", authorizePermissions(INVENTORY_UPDATE_PERMISSION), (req, res) => {
    void createProductoAction(actions.createProductoUseCase, req, res);
  });

  router.put("/:idProducto", authorizePermissions(INVENTORY_UPDATE_PERMISSION), (req, res) => {
    void updateProductoAction(actions.updateProductoUseCase, req, res);
  });

  router.delete("/:idProducto", authorizePermissions(INVENTORY_UPDATE_PERMISSION), (req, res) => {
    void deleteProductoAction(actions.deleteProductoUseCase, req, res);
  });

  return router;
}

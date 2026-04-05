import type { ProductoRepository } from "../../domain/repositories/producto/producto.repository.js";
import type { Producto } from "../../domain/entities/producto/producto.entity.js";
import type { DatabaseClient } from "../database/database-client.interface.js";
import { createProducto } from "./producto/create-producto.repository.js";
import { findAllProductos, findProductoById } from "./producto/read-producto.repository.js";
import { updateProducto } from "./producto/update-producto.repository.js";
import { softDeleteProducto } from "./producto/delete-producto.repository.js";

export class PgProductoRepository implements ProductoRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(producto: Producto): Promise<Producto> {
    try {
      return await createProducto(this.db, producto);
    } catch (error) {
      throw new Error("Failed to create producto", { cause: error });
    }
  }

  async findById(idProducto: number): Promise<Producto | null> {
    try {
      return await findProductoById(this.db, idProducto);
    } catch (error) {
      throw new Error("Failed to find producto by id", { cause: error });
    }
  }

  async findAll(): Promise<Producto[]> {
    try {
      return await findAllProductos(this.db);
    } catch (error) {
      throw new Error("Failed to list productos", { cause: error });
    }
  }

  async update(producto: Producto): Promise<Producto | null> {
    try {
      return await updateProducto(this.db, producto);
    } catch (error) {
      throw new Error("Failed to update producto", { cause: error });
    }
  }

  async delete(idProducto: number): Promise<boolean> {
    try {
      return await softDeleteProducto(this.db, idProducto);
    } catch (error) {
      throw new Error("Failed to delete producto", { cause: error });
    }
  }
}

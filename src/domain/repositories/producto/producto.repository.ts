import { Producto } from "../../entities/producto/producto.entity.js";

export interface ProductoRepository {
  create(producto: Producto): Promise<Producto>;
  findById(idProducto: number): Promise<Producto | null>;
  findAll(): Promise<Producto[]>;
  update(producto: Producto): Promise<Producto | null>;
  delete(idProducto: number): Promise<boolean>;
}

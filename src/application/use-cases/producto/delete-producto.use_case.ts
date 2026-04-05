import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import type { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../domain/repositories/producto/producto.repository.js";

export class DeleteProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(idProducto: number): Promise<Producto> {
    const producto = await this.productoRepository.findById(idProducto);
    if (!producto) {
      throw new ProductoNotFoundException(idProducto);
    }

    const deleted = await this.productoRepository.delete(idProducto);
    if (!deleted) {
      throw new ProductoNotFoundException(idProducto);
    }

    return producto;
  }
}

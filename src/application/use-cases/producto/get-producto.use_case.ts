import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import type { ProductoRepository } from "../../../domain/repositories/producto/producto.repository.js";
import type { Producto } from "../../../domain/entities/producto/producto.entity.js";

export class GetProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(idProducto: number): Promise<Producto> {
    const producto = await this.productoRepository.findById(idProducto);
    if (!producto) {
      throw new ProductoNotFoundException(idProducto);
    }

    return producto;
  }
}

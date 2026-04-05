import type { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../domain/repositories/producto/producto.repository.js";

export class ListProductosUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(): Promise<Producto[]> {
    return this.productoRepository.findAll();
  }
}

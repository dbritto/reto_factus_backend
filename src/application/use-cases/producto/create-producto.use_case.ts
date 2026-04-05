import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../domain/repositories/producto/producto.repository.js";
import type { CreateProductoDto } from "../../dtos/create-producto.dto.js";

export class CreateProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(dto: CreateProductoDto): Promise<Producto> {
    const producto = new Producto(dto);
    return this.productoRepository.create(producto);
  }
}

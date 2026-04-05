import { ProductoNotFoundException } from "../../../domain/exceptions/producto.exceptions.js";
import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRepository } from "../../../domain/repositories/producto/producto.repository.js";
import type { UpdateProductoDto } from "../../dtos/update-producto.dto.js";

export class UpdateProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(idProducto: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = new Producto({ idProducto, ...dto });
    const updated = await this.productoRepository.update(producto);
    if (!updated) {
      throw new ProductoNotFoundException(idProducto);
    }

    return updated;
  }
}

import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRow } from "./producto.repository.types.js";

export function mapRowToProducto(row: ProductoRow): Producto {
  const maybeCreatedAt = row.created_at ? new Date(row.created_at) : null;
  const maybeUpdatedAt = row.updated_at ? new Date(row.updated_at) : null;

  return new Producto({
    idProducto: row.id_producto,
    nombreProducto: row.nombre_producto,
    cantidad: row.cantidad,
    descuento: row.descuento,
    precio: row.precio,
    taxRate: Number(row.tax_rate),
    idUnidadDeMedida: row.id_unidad_de_medida,
    idIdentificacionDelProducto: row.id_identificacion_del_producto,
    iva: row.iva,
    idTipoDeProducto: row.id_tipo_de_producto,
    idTributo: row.id_tributo,
    codeReference: row.code_reference,
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    ...(maybeCreatedAt ? { createdAt: maybeCreatedAt } : {}),
    ...(maybeUpdatedAt ? { updatedAt: maybeUpdatedAt } : {}),
  });
}

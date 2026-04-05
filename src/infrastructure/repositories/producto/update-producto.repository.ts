import type { DatabaseClient } from "../../database/database-client.interface.js";
import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRow } from "./producto.repository.types.js";
import { mapRowToProducto } from "./producto.repository.mapper.js";

export async function updateProducto(
  db: DatabaseClient,
  producto: Producto
): Promise<Producto | null> {
  if (!producto.idProducto) {
    throw new Error("idProducto es requerido para actualizar");
  }

  const rows = await db.query<ProductoRow>(
    `UPDATE producto
     SET
      nombre_producto = $1,
      cantidad = $2,
      descuento = $3,
      precio = $4,
      tax_rate = $5,
      id_unidad_de_medida = $6,
      id_identificacion_del_producto = $7,
      iva = $8,
      id_tipo_de_producto = $9,
      id_tributo = $10,
      code_reference = $11
     WHERE id_producto = $12 AND deleted_at IS NULL
     RETURNING
      id_producto,
      nombre_producto,
      cantidad,
      descuento,
      precio,
      tax_rate,
      id_unidad_de_medida,
      id_identificacion_del_producto,
      iva,
      id_tipo_de_producto,
      id_tributo,
      code_reference,
      created_at,
      updated_at,
      deleted_at`,
    [
      producto.nombreProducto,
      producto.cantidad,
      producto.descuento,
      producto.precio,
      producto.taxRate,
      producto.idUnidadDeMedida,
      producto.idIdentificacionDelProducto,
      producto.iva,
      producto.idTipoDeProducto,
      producto.idTributo,
      producto.codeReference,
      producto.idProducto,
    ]
  );

  const [updated] = rows;
  return updated ? mapRowToProducto(updated) : null;
}

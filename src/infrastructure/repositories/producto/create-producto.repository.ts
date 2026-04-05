import type { DatabaseClient } from "../../database/database-client.interface.js";
import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRow } from "./producto.repository.types.js";
import { mapRowToProducto } from "./producto.repository.mapper.js";

export async function createProducto(
  db: DatabaseClient,
  producto: Producto
): Promise<Producto> {
  const rows = await db.query<ProductoRow>(
    `INSERT INTO producto (
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
      code_reference
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
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
    ]
  );

  const [created] = rows;
  if (!created) {
    throw new Error("No se pudo crear el producto");
  }

  return mapRowToProducto(created);
}

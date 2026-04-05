import type { DatabaseClient } from "../../database/database-client.interface.js";
import { Producto } from "../../../domain/entities/producto/producto.entity.js";
import type { ProductoRow } from "./producto.repository.types.js";
import { mapRowToProducto } from "./producto.repository.mapper.js";

const SELECT_PRODUCTO_COLUMNS = `
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
  deleted_at
`;

export async function findProductoById(
  db: DatabaseClient,
  idProducto: number
): Promise<Producto | null> {
  const rows = await db.query<ProductoRow>(
    `SELECT ${SELECT_PRODUCTO_COLUMNS}
     FROM producto
     WHERE id_producto = $1 AND deleted_at IS NULL
     LIMIT 1`,
    [idProducto]
  );

  const [row] = rows;
  return row ? mapRowToProducto(row) : null;
}

export async function findAllProductos(db: DatabaseClient): Promise<Producto[]> {
  const rows = await db.query<ProductoRow>(
    `SELECT ${SELECT_PRODUCTO_COLUMNS}
     FROM producto
     WHERE deleted_at IS NULL
     ORDER BY id_producto ASC`
  );

  return rows.map(mapRowToProducto);
}

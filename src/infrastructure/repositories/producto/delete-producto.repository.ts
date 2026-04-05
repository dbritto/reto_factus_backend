import type { DatabaseClient } from "../../database/database-client.interface.js";

interface DeleteProductoRow {
  id_producto: number;
}

export async function softDeleteProducto(
  db: DatabaseClient,
  idProducto: number
): Promise<boolean> {
  const rows = await db.query<DeleteProductoRow>(
    `UPDATE producto
     SET deleted_at = NOW()
     WHERE id_producto = $1 AND deleted_at IS NULL
     RETURNING id_producto`,
    [idProducto]
  );

  return rows.length > 0;
}

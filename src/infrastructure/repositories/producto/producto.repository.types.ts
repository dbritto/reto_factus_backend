export interface ProductoRow {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  descuento: number;
  precio: number;
  tax_rate: number;
  id_unidad_de_medida: number;
  id_identificacion_del_producto: number;
  iva: number;
  id_tipo_de_producto: number;
  id_tributo: number;
  code_reference: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  deleted_at: Date | string | null;
}

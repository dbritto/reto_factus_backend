export interface ProductoProps {
	idProducto?: number;
	nombreProducto: string;
	cantidad: number;
	descuento: number;
	precio: number;
	taxRate: number;
	idUnidadDeMedida: number;
	idIdentificacionDelProducto: number;
	iva: number;
	idTipoDeProducto: number;
	idTributo?: number;
	codeReference?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}

export class Producto {
	public readonly idProducto: number | undefined;
	public readonly nombreProducto: string;
	public readonly cantidad: number;
	public readonly descuento: number;
	public readonly precio: number;
	public readonly taxRate: number;
	public readonly idUnidadDeMedida: number;
	public readonly idIdentificacionDelProducto: number;
	public readonly iva: number;
	public readonly idTipoDeProducto: number;
	public readonly idTributo: number;
	public readonly codeReference: string;
	public readonly createdAt: Date | undefined;
	public readonly updatedAt: Date | undefined;
	public readonly deletedAt: Date | null;

	constructor(props: ProductoProps) {
		this.idProducto = props.idProducto;
		this.nombreProducto = props.nombreProducto;
		this.cantidad = props.cantidad;
		this.descuento = props.descuento;
		this.precio = props.precio;
		this.taxRate = props.taxRate;
		this.idUnidadDeMedida = props.idUnidadDeMedida;
		this.idIdentificacionDelProducto = props.idIdentificacionDelProducto;
		this.iva = props.iva;
		this.idTipoDeProducto = props.idTipoDeProducto;
		this.idTributo = props.idTributo ?? 1;
		this.codeReference = props.codeReference ?? "";
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.deletedAt = props.deletedAt ?? null;
	}
}

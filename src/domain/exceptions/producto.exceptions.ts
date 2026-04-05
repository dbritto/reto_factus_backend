export class ProductoNotFoundException extends Error {
  constructor(idProducto: number) {
    super(`No se encontró ningún producto con el id '${idProducto}'.`);
    this.name = "ProductoNotFoundException";
    Object.setPrototypeOf(this, ProductoNotFoundException.prototype);
  }
}

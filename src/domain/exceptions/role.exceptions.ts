export class InvalidRoleException extends Error {
  constructor(reason: string) {
    super(`Rol inválido: ${reason}`);
    this.name = "InvalidRoleException";
    Object.setPrototypeOf(this, InvalidRoleException.prototype);
  }
}

export class UnauthorizedException extends Error {
  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message);
    this.name = "UnauthorizedException";
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

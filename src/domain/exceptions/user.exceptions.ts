export class InvalidEmailException extends Error {
  constructor(email: string) {
    super(`El formato del email '${email}' no es válido.`);
    this.name = "InvalidEmailException";
    Object.setPrototypeOf(this, InvalidEmailException.prototype);
  }
}

export class WeakPasswordException extends Error {
  constructor() {
    super("La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una mayúscula y un número.");
    this.name = "WeakPasswordException";
    Object.setPrototypeOf(this, WeakPasswordException.prototype);
  }
}

export class UserNotFoundException extends Error {
  constructor(identifier: string) {
    super(`No se encontró ningún usuario con el identificador '${identifier}'.`);
    this.name = "UserNotFoundException";
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`El correo electrónico '${email}' ya está registrado en el sistema.`);
    this.name = "UserAlreadyExistsException";
    Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
  }
}

export class InvalidCredentialsException extends Error {
  constructor() {
    super("El correo electrónico o la contraseña son incorrectos.");
    this.name = "InvalidCredentialsException";
    Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
  }
}

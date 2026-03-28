import {
  InvalidRoleException,
  UnauthorizedException,
} from "../../../src/domain/exceptions/role.exceptions.js";
import { describe, expect, it } from "@jest/globals";

describe("Role Exceptions", () => {
  it("deberia crear InvalidRoleException con message y name correctos", () => {
    const reason = "El rol debe tener al menos un permiso.";

    const error = new InvalidRoleException(reason);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidRoleException);
    expect(error.name).toBe("InvalidRoleException");
    expect(error.message).toBe("Rol inválido: El rol debe tener al menos un permiso.");
  });

  it("deberia crear UnauthorizedException con el mensaje por defecto", () => {
    const error = new UnauthorizedException();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.name).toBe("UnauthorizedException");
    expect(error.message).toBe("No tienes permisos para realizar esta acción.");
  });

  it("deberia crear UnauthorizedException con un mensaje personalizado", () => {
    const error = new UnauthorizedException("Acceso denegado para este recurso.");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UnauthorizedException);
    expect(error.name).toBe("UnauthorizedException");
    expect(error.message).toBe("Acceso denegado para este recurso.");
  });
});

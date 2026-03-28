import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from "../../../src/domain/exceptions/user.exceptions.js";
import { describe, expect, it } from "@jest/globals";

describe("User Exceptions", () => {
  it("deberia crear UserNotFoundException con message y name correctos", () => {
    const identifier = "user-123";

    const error = new UserNotFoundException(identifier);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UserNotFoundException);
    expect(error.name).toBe("UserNotFoundException");
    expect(error.message).toBe(
      "No se encontró ningún usuario con el identificador 'user-123'."
    );
  });

  it("deberia crear UserAlreadyExistsException con message y name correctos", () => {
    const email = "user@example.com";

    const error = new UserAlreadyExistsException(email);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UserAlreadyExistsException);
    expect(error.name).toBe("UserAlreadyExistsException");
    expect(error.message).toBe(
      "El correo electrónico 'user@example.com' ya está registrado en el sistema."
    );
  });

  it("deberia crear InvalidCredentialsException con message y name correctos", () => {
    const error = new InvalidCredentialsException();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidCredentialsException);
    expect(error.name).toBe("InvalidCredentialsException");
    expect(error.message).toBe(
      "El correo electrónico o la contraseña son incorrectos."
    );
  });
});

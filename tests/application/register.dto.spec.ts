import { describe, expect, it } from "@jest/globals";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";
import { validateRegisterDto } from "../../src/application/dtos/register.dto.js";

describe("validateRegisterDto", () => {
  it("lanza error si body no es objeto", () => {
    expect(() => validateRegisterDto(null)).toThrow("Request body is missing");
  });

  it("lanza error si name falta o es vacio", () => {
    expect(() =>
      validateRegisterDto({ email: "user@example.com", password: "Password123" })
    ).toThrow("name is required");

    expect(() =>
      validateRegisterDto({ name: "   ", email: "user@example.com", password: "Password123" })
    ).toThrow("name is required");
  });

  it("lanza error si email falta o es vacio", () => {
    expect(() => validateRegisterDto({ name: "John", password: "Password123" })).toThrow(
      "email is required"
    );

    expect(() => validateRegisterDto({ name: "John", email: "   ", password: "Password123" })).toThrow(
      "email is required"
    );
  });

  it("lanza error si password falta o es vacio", () => {
    expect(() => validateRegisterDto({ name: "John", email: "john@example.com" })).toThrow(
      "password is required"
    );

    expect(() => validateRegisterDto({ name: "John", email: "john@example.com", password: "   " })).toThrow(
      "password is required"
    );
  });

  it("lanza error si roles no es arreglo de strings", () => {
    expect(() =>
      validateRegisterDto({
        name: "John",
        email: "john@example.com",
        password: "Password123",
        roles: "admin",
      })
    ).toThrow("roles must be an array of strings");

    expect(() =>
      validateRegisterDto({
        name: "John",
        email: "john@example.com",
        password: "Password123",
        roles: ["admin", 1],
      })
    ).toThrow("roles must be an array of strings");
  });

  it("lanza error si roles contiene valores invalidos", () => {
    expect(() =>
      validateRegisterDto({
        name: "John",
        email: "john@example.com",
        password: "Password123",
        roles: ["admin", "manager"],
      })
    ).toThrow("roles contains invalid values");
  });

  it("retorna dto normalizado cuando roles es valido", () => {
    const dto = validateRegisterDto({
      name: "  John  ",
      email: "  john@example.com  ",
      password: "Password123",
      roles: [UserRole.ADMIN, UserRole.USER],
    });

    expect(dto).toEqual({
      name: "John",
      email: "john@example.com",
      password: "Password123",
      roles: [UserRole.ADMIN, UserRole.USER],
    });
  });

  it("retorna dto sin roles cuando roles no se envia", () => {
    const dto = validateRegisterDto({
      name: "  John  ",
      email: "  john@example.com  ",
      password: "Password123",
    });

    expect(dto).toEqual({
      name: "John",
      email: "john@example.com",
      password: "Password123",
    });
  });
});

import { describe, expect, it } from "@jest/globals";
import { validateLoginDto } from "../../src/application/dtos/login.dto.js";

describe("validateLoginDto", () => {
  it("lanza error si body no es objeto", () => {
    expect(() => validateLoginDto(null)).toThrow("Request body is missing");
  });

  it("lanza error si email falta o es vacio", () => {
    expect(() => validateLoginDto({ password: "Password123" })).toThrow("email is required");
    expect(() => validateLoginDto({ email: "   ", password: "Password123" })).toThrow(
      "email is required"
    );
  });

  it("lanza error si password falta o es vacio", () => {
    expect(() => validateLoginDto({ email: "user@example.com" })).toThrow("password is required");
    expect(() => validateLoginDto({ email: "user@example.com", password: "   " })).toThrow(
      "password is required"
    );
  });

  it("retorna dto con email trim", () => {
    const dto = validateLoginDto({
      email: "  user@example.com  ",
      password: "Password123",
    });

    expect(dto).toEqual({
      email: "user@example.com",
      password: "Password123",
    });
  });
});

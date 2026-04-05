import { describe, expect, it, jest } from "@jest/globals";
import {
  getSafeMessage,
  isProductoValidationError,
  parseProductoId,
  sendUnexpectedError,
} from "../../../src/presentation/controller/producto/producto-action.utils.js";

describe("producto-action.utils", () => {
  it("getSafeMessage retorna mensaje del error cuando existe", () => {
    const message = getSafeMessage(new Error("boom"), "fallback");
    expect(message).toBe("boom");
  });

  it("getSafeMessage retorna fallback cuando error no tiene mensaje", () => {
    const message = getSafeMessage(new Error("   "), "fallback");
    expect(message).toBe("fallback");
  });

  it("parseProductoId convierte id valido", () => {
    expect(parseProductoId("12")).toBe(12);
    expect(parseProductoId(["13"])).toBe(13);
  });

  it("parseProductoId lanza error para id invalido", () => {
    expect(() => parseProductoId(undefined)).toThrow("idProducto must be a positive integer");
    expect(() => parseProductoId("0")).toThrow("idProducto must be a positive integer");
    expect(() => parseProductoId("abc")).toThrow("idProducto must be a positive integer");
  });

  it("isProductoValidationError identifica mensajes permitidos", () => {
    expect(isProductoValidationError("nombreProducto is required")).toBe(true);
    expect(isProductoValidationError("mensaje random")).toBe(false);
  });

  it("sendUnexpectedError responde 500 y loguea error", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Parameters<typeof sendUnexpectedError>[0];
    const logSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const returned = sendUnexpectedError(res, "[ctx]", new Error("x"));

    expect(logSpy).toHaveBeenCalledWith("[ctx] unexpected error:", expect.any(Error));
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(500);
    expect((res.json as unknown as jest.Mock)).toHaveBeenCalledWith({ message: "Internal server error" });
    expect(returned).toBe(res);
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthPayload } from "../../src/domain/entities/auth/auth-payload.js";

const signMock = jest.fn<(payload: AuthPayload, secret: string, options: { expiresIn: number }) => string>();
const verifyMock = jest.fn<(token: string, secret: string) => AuthPayload>();

process.env.JWT_SECRET = "test-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
  },
}));

const { JwtService } = await import("../../src/infrastructure/auth/jwt.service.js");

describe("JwtService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verify retorna payload cuando el token es valido", () => {
    const payload: AuthPayload = { sub: "user-1", roles: ["user"] as AuthPayload["roles"] };
    verifyMock.mockReturnValue(payload);
    const service = new JwtService();

    const result = service.verify("access-token");

    expect(result).toEqual(payload);
    expect(verifyMock).toHaveBeenCalledWith("access-token", "test-secret");
  });

  it("verify lanza Error con mensaje esperado cuando falla", () => {
    verifyMock.mockImplementation(() => {
      throw new Error("jwt malformed");
    });
    const service = new JwtService();

    expect(() => service.verify("invalid-token")).toThrow("Invalid token");
  });

  it("verifyRefresh usa refresh secret y retorna payload", () => {
    const payload: AuthPayload = { sub: "user-2", roles: ["admin"] as AuthPayload["roles"] };
    verifyMock.mockReturnValue(payload);
    const service = new JwtService();

    const result = service.verifyRefresh("refresh-token");

    expect(result).toEqual(payload);
    expect(verifyMock).toHaveBeenCalledWith("refresh-token", "test-refresh-secret");
  });

  it("verifyRefresh lanza Error con mensaje esperado cuando falla", () => {
    verifyMock.mockImplementation(() => {
      throw new Error("jwt expired");
    });
    const service = new JwtService();

    expect(() => service.verifyRefresh("expired-refresh")).toThrow("Invalid refresh token");
  });

  it("generate crea access y refresh token con expiraciones correctas", () => {
    const payload: AuthPayload = { sub: "user-3", roles: ["user"] as AuthPayload["roles"] };
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000);

    signMock.mockImplementation((_payload, _secret, options) => {
      return options.expiresIn === 900 ? "access-signed" : "refresh-signed";
    });

    const service = new JwtService();

    const result = service.generate(payload);

    expect(signMock).toHaveBeenNthCalledWith(1, payload, "test-secret", { expiresIn: 900 });
    expect(signMock).toHaveBeenNthCalledWith(2, payload, "test-refresh-secret", {
      expiresIn: 604800,
    });
    expect(result).toEqual({
      accessToken: "access-signed",
      expiresIn: 900,
      expiresAt: new Date(901_000).toISOString(),
      refreshToken: "refresh-signed",
      refreshExpiresIn: 604800,
      refreshExpiresAt: new Date(604_801_000).toISOString(),
    });

    nowSpy.mockRestore();
  });
});

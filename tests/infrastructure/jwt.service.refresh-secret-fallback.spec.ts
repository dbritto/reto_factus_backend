import { describe, expect, it, jest } from "@jest/globals";
import type { AuthPayload } from "../../src/domain/entities/auth/auth-payload.js";

describe("JwtService refresh secret fallback", () => {
  it("usa JWT_SECRET cuando JWT_REFRESH_SECRET no esta definido", async () => {
    jest.resetModules();

    process.env.JWT_SECRET = "fallback-secret";
    delete process.env.JWT_REFRESH_SECRET;

    const verifyMock = jest.fn<(token: string, secret: string) => AuthPayload>();
    verifyMock.mockReturnValue({ sub: "user-1", roles: ["user"] as AuthPayload["roles"] });

    jest.unstable_mockModule("jsonwebtoken", () => ({
      default: {
        sign: jest.fn(),
        verify: verifyMock,
      },
    }));

    const { JwtService } = await import("../../src/infrastructure/auth/jwt.service.js");

    const service = new JwtService();
    service.verifyRefresh("refresh-token");

    expect(verifyMock).toHaveBeenCalledWith("refresh-token", "fallback-secret");
  });
});

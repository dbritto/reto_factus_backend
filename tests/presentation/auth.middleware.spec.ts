import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthPayload } from "../../src/domain/entities/auth/auth-payload.js";

const verifyMock = jest.fn<(token: string) => AuthPayload>();

jest.unstable_mockModule("../../src/infrastructure/auth/jwt.service.js", () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    verify: verifyMock,
  })),
}));

const { authMiddleware } = await import("../../src/presentation/middleware/auth.middleware.js");

type MockResponse = Response & {
  status: jest.Mock;
  json: jest.Mock;
};

function createMockResponse(): MockResponse {
  const res = {} as MockResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function createRequestWithAuthHeader(authorization?: string): Request {
  return {
    headers: authorization ? { authorization } : {},
  } as unknown as Request;
}

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 401 si no llega header de authorization", () => {
    const req = createRequestWithAuthHeader();
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 si el bearer no contiene token", () => {
    const req = createRequestWithAuthHeader("Bearer");
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("agrega req.user y llama next cuando el token es válido", () => {
    const req = createRequestWithAuthHeader("Bearer valid-token");
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();
    const payload: AuthPayload = { sub: "user-1", roles: ["user"] as AuthPayload["roles"] };

    verifyMock.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retorna 401 cuando verify lanza error", () => {
    const req = createRequestWithAuthHeader("Bearer invalid-token");
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();

    verifyMock.mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith("invalid-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });
});

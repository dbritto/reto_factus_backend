import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthPayload } from "../../src/domain/entities/auth/auth-payload.js";

const verifyMock = jest.fn<(token: string) => AuthPayload>();
const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<Array<{ permission: string }>>>();

jest.unstable_mockModule("../../src/infrastructure/auth/jwt.service.js", () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    verify: verifyMock,
  })),
}));

jest.unstable_mockModule("../../src/infrastructure/database/pg-database-client.js", () => ({
  PgDatabaseClient: jest.fn().mockImplementation(() => ({
    query: queryMock,
  })),
}));

const { authMiddleware, authorizePermissions } = await import("../../src/presentation/middleware/auth.middleware.js");

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

describe("authorizePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 401 si no existe req.user", async () => {
    const req = {} as Request;
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();

    await authorizePermissions("inventory:read")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 403 cuando no tiene permisos requeridos", async () => {
    const req = {
      user: { sub: "u1", roles: ["user"] as AuthPayload["roles"] },
    } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();
    queryMock.mockResolvedValue([{ permission: "orders:read" }]);

    await authorizePermissions("inventory:update")(req, res, next);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  it("llama next cuando tiene todos los permisos requeridos", async () => {
    const req = {
      user: { sub: "u2", roles: ["admin"] as AuthPayload["roles"] },
    } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();
    queryMock.mockResolvedValue([
      { permission: "inventory:read" },
      { permission: "inventory:update" },
    ]);

    await authorizePermissions("inventory:read", "inventory:update")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("retorna 500 cuando falla consulta de permisos", async () => {
    const req = {
      user: { sub: "u3", roles: ["admin"] as AuthPayload["roles"] },
    } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn<NextFunction>();
    queryMock.mockRejectedValue(new Error("db error"));

    await authorizePermissions("inventory:read")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    expect(next).not.toHaveBeenCalled();
  });
});

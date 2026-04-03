import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AuthController } from "../../src/presentation/controller/auth.controller.js";
import type { LoginUseCase } from "../../src/application/use-cases/auth/login.use_case.js";
import type { RegisterUseCase } from "../../src/application/use-cases/auth/register.use_case.js";
import type { RefreshTokenUseCase } from "../../src/application/use-cases/auth/refresh_token.use_case.js";
import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
} from "../../src/domain/exceptions/index.js";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";

type MockedUseCases = {
  loginExecute: jest.Mock<() => Promise<unknown>>;
  registerExecute: jest.Mock<() => Promise<unknown>>;
  refreshExecute: jest.Mock<() => Promise<unknown>>;
};

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

function createMockRequest(body: unknown): Request {
  return { body } as Request;
}

function buildController() {
  const mockedUseCases: MockedUseCases = {
    loginExecute: jest.fn<() => Promise<unknown>>(),
    registerExecute: jest.fn<() => Promise<unknown>>(),
    refreshExecute: jest.fn<() => Promise<unknown>>(),
  };

  const controller = new AuthController(
    { execute: mockedUseCases.loginExecute } as unknown as LoginUseCase,
    { execute: mockedUseCases.registerExecute } as unknown as RegisterUseCase,
    { execute: mockedUseCases.refreshExecute } as unknown as RefreshTokenUseCase
  );

  return { controller, mockedUseCases };
}

describe("AuthController", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("login", () => {
    it("retorna 200 con tokens cuando el login es exitoso", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({
        email: "  user@example.com ",
        password: "Password123",
      });
      const res = createMockResponse();
      const tokens = { accessToken: "access", refreshToken: "refresh" };

      mockedUseCases.loginExecute.mockResolvedValue(tokens);

      await controller.login(req, res);

      expect(mockedUseCases.loginExecute).toHaveBeenCalledWith("user@example.com", "Password123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tokens);
    });

    it("retorna 401 cuando las credenciales son inválidas", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({ email: "user@example.com", password: "wrong" });
      const res = createMockResponse();

      mockedUseCases.loginExecute.mockRejectedValue(new InvalidCredentialsException());

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "El correo electrónico o la contraseña son incorrectos.",
      });
    });

    it("retorna 400 si falla la validación del dto", async () => {
      const { controller } = buildController();
      const req = createMockRequest(null);
      const res = createMockResponse();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Request body is missing" });
    });

    it("retorna 500 ante errores inesperados", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({ email: "user@example.com", password: "Password123" });
      const res = createMockResponse();
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

      mockedUseCases.loginExecute.mockRejectedValue(new Error("boom"));

      await controller.login(req, res);

      expect(errorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("register", () => {
    it("retorna 201 cuando el registro es exitoso", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({
        name: "John",
        email: "john@example.com",
        password: "Password123",
        roles: [UserRole.ADMIN],
      });
      const res = createMockResponse();
      const payload = {
        message: "User registered successfully",
        email: "john@example.com",
        roles: [UserRole.ADMIN],
      };

      mockedUseCases.registerExecute.mockResolvedValue(payload);

      await controller.register(req, res);

      expect(mockedUseCases.registerExecute).toHaveBeenCalledWith(
        "John",
        "john@example.com",
        "Password123",
        [UserRole.ADMIN]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(payload);
    });

    it("retorna 409 cuando el usuario ya existe", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({
        name: "John",
        email: "john@example.com",
        password: "Password123",
      });
      const res = createMockResponse();

      mockedUseCases.registerExecute.mockRejectedValue(
        new UserAlreadyExistsException("john@example.com")
      );

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "El correo electrónico 'john@example.com' ya está registrado en el sistema.",
      });
    });

    it("retorna 400 para errores de validación", async () => {
      const { controller } = buildController();
      const req = createMockRequest({
        email: "john@example.com",
        password: "Password123",
      });
      const res = createMockResponse();

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "name is required" });
    });

    it("retorna 500 para errores inesperados sin mensaje seguro", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({
        name: "John",
        email: "john@example.com",
        password: "Password123",
      });
      const res = createMockResponse();
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

      mockedUseCases.registerExecute.mockRejectedValue("unknown error");

      await controller.register(req, res);

      expect(errorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("refresh", () => {
    it("retorna 200 cuando el refresh token es válido", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({ refreshToken: "refresh-token" });
      const res = createMockResponse();
      const tokens = { accessToken: "new-access", refreshToken: "new-refresh" };

      mockedUseCases.refreshExecute.mockResolvedValue(tokens);

      await controller.refresh(req, res);

      expect(mockedUseCases.refreshExecute).toHaveBeenCalledWith("refresh-token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tokens);
    });

    it("retorna 401 cuando el refresh token es inválido", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({ refreshToken: "invalid" });
      const res = createMockResponse();

      mockedUseCases.refreshExecute.mockRejectedValue(new InvalidCredentialsException());

      await controller.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "El correo electrónico o la contraseña son incorrectos.",
      });
    });

    it("retorna 400 cuando el dto de refresh es inválido", async () => {
      const { controller } = buildController();
      const req = createMockRequest({});
      const res = createMockResponse();

      await controller.refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "refreshToken is required" });
    });

    it("retorna 500 para errores inesperados", async () => {
      const { controller, mockedUseCases } = buildController();
      const req = createMockRequest({ refreshToken: "refresh-token" });
      const res = createMockResponse();
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

      mockedUseCases.refreshExecute.mockRejectedValue(new Error("boom"));

      await controller.refresh(req, res);

      expect(errorSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});

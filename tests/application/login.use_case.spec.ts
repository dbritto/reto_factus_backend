import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { User } from "../../src/domain/entities/usuario/user.entity.js";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";
import { InvalidCredentialsException } from "../../src/domain/exceptions/index.js";
import type { RefreshTokenRepository } from "../../src/domain/repositories/auth/refresh-token.repository.js";
import type { UserRepository } from "../../src/domain/repositories/usuario/user.repository.js";
import type { PasswordHasher } from "../../src/domain/services/password-hasher.interface.js";
import type { TokenService } from "../../src/domain/services/TokenService.js";
import { LoginUseCase } from "../../src/application/use-cases/auth/login.use_case.js";

describe("LoginUseCase", () => {
  const findByEmailMock = jest.fn<(email: string) => Promise<User | null>>();
  const saveRefreshMock = jest.fn<(userId: string, token: string, expiresAt: Date) => Promise<void>>();
  const compareMock = jest.fn<(plain: string, hashed: string) => Promise<boolean>>();
  const generateMock = jest.fn<
    (payload: { sub: string; roles: UserRole[] }) => {
      accessToken: string;
      expiresIn: number;
      expiresAt: string;
      refreshToken: string;
      refreshExpiresIn: number;
      refreshExpiresAt: string;
    }
  >();

  const userRepo = { findByEmail: findByEmailMock } as unknown as UserRepository;
  const refreshTokenRepo = { save: saveRefreshMock } as unknown as RefreshTokenRepository;
  const passwordHasher = { compare: compareMock } as unknown as PasswordHasher;
  const tokenService = { generate: generateMock } as unknown as TokenService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lanza InvalidCredentialsException cuando no existe usuario", async () => {
    findByEmailMock.mockResolvedValue(null);
    const useCase = new LoginUseCase(userRepo, refreshTokenRepo, passwordHasher, tokenService);

    await expect(useCase.execute("missing@example.com", "Password123")).rejects.toBeInstanceOf(
      InvalidCredentialsException
    );

    expect(compareMock).not.toHaveBeenCalled();
    expect(generateMock).not.toHaveBeenCalled();
    expect(saveRefreshMock).not.toHaveBeenCalled();
  });

  it("lanza InvalidCredentialsException cuando la contrasena no coincide", async () => {
    const user = new User({
      id: "user-1",
      name: "John",
      email: "john@example.com",
      password: "Password123",
      roles: [UserRole.USER],
    });
    findByEmailMock.mockResolvedValue(user);
    compareMock.mockResolvedValue(false);

    const useCase = new LoginUseCase(userRepo, refreshTokenRepo, passwordHasher, tokenService);

    await expect(useCase.execute("john@example.com", "wrong-pass")).rejects.toBeInstanceOf(
      InvalidCredentialsException
    );

    expect(compareMock).toHaveBeenCalledWith("wrong-pass", "Password123");
    expect(generateMock).not.toHaveBeenCalled();
    expect(saveRefreshMock).not.toHaveBeenCalled();
  });

  it("retorna tokens y guarda refresh token cuando login es exitoso", async () => {
    const user = new User({
      id: "user-2",
      name: "Jane",
      email: "jane@example.com",
      password: "Password123",
      roles: [UserRole.ADMIN],
    });

    const tokenPair = {
      accessToken: "access",
      expiresIn: 900,
      expiresAt: "2030-01-01T00:15:00.000Z",
      refreshToken: "refresh",
      refreshExpiresIn: 604800,
      refreshExpiresAt: "2030-01-08T00:00:00.000Z",
    };

    findByEmailMock.mockResolvedValue(user);
    compareMock.mockResolvedValue(true);
    generateMock.mockReturnValue(tokenPair);
    saveRefreshMock.mockResolvedValue();

    const useCase = new LoginUseCase(userRepo, refreshTokenRepo, passwordHasher, tokenService);

    const result = await useCase.execute("jane@example.com", "Password123");

    expect(generateMock).toHaveBeenCalledWith({ sub: "user-2", roles: [UserRole.ADMIN] });
    expect(saveRefreshMock).toHaveBeenCalledWith(
      "user-2",
      "refresh",
      new Date("2030-01-08T00:00:00.000Z")
    );
    expect(result).toEqual(tokenPair);
  });
});

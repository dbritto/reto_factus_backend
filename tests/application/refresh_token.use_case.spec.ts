import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RefreshTokenUseCase } from "../../src/application/use-cases/auth/refresh_token.use_case.js";
import { User } from "../../src/domain/entities/usuario/user.entity.js";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";
import { InvalidCredentialsException } from "../../src/domain/exceptions/index.js";
import type { RefreshTokenRepository } from "../../src/domain/repositories/auth/refresh-token.repository.js";
import type { UserRepository } from "../../src/domain/repositories/usuario/user.repository.js";
import type { TokenService } from "../../src/domain/services/TokenService.js";

describe("RefreshTokenUseCase", () => {
  const findValidByTokenMock = jest.fn<(token: string) => Promise<{
    userId: string;
    token: string;
    expiresAt: Date;
    revoked: boolean;
  } | null>>();
  const revokeByTokenMock = jest.fn<(token: string) => Promise<void>>();
  const saveRefreshMock = jest.fn<(userId: string, token: string, expiresAt: Date) => Promise<void>>();
  const findByIdMock = jest.fn<(id: string) => Promise<User | null>>();
  const verifyRefreshMock = jest.fn<(token: string) => { sub: string; roles: UserRole[] }>();
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

  const refreshTokenRepo = {
    findValidByToken: findValidByTokenMock,
    revokeByToken: revokeByTokenMock,
    save: saveRefreshMock,
  } as unknown as RefreshTokenRepository;

  const userRepo = {
    findById: findByIdMock,
  } as unknown as UserRepository;

  const tokenService = {
    verifyRefresh: verifyRefreshMock,
    generate: generateMock,
  } as unknown as TokenService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lanza InvalidCredentialsException cuando no existe token almacenado", async () => {
    findValidByTokenMock.mockResolvedValue(null);
    const useCase = new RefreshTokenUseCase(refreshTokenRepo, userRepo, tokenService);

    await expect(useCase.execute("rt-1")).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("lanza InvalidCredentialsException cuando payload y token no coinciden", async () => {
    findValidByTokenMock.mockResolvedValue({
      userId: "user-1",
      token: "rt-1",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
      revoked: false,
    });
    verifyRefreshMock.mockReturnValue({ sub: "user-2", roles: [UserRole.USER] });

    const useCase = new RefreshTokenUseCase(refreshTokenRepo, userRepo, tokenService);

    await expect(useCase.execute("rt-1")).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("lanza InvalidCredentialsException cuando no existe usuario", async () => {
    findValidByTokenMock.mockResolvedValue({
      userId: "user-1",
      token: "rt-1",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
      revoked: false,
    });
    verifyRefreshMock.mockReturnValue({ sub: "user-1", roles: [UserRole.USER] });
    findByIdMock.mockResolvedValue(null);

    const useCase = new RefreshTokenUseCase(refreshTokenRepo, userRepo, tokenService);

    await expect(useCase.execute("rt-1")).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("revoca token anterior, guarda nuevo refresh y retorna nuevos tokens", async () => {
    const user = new User({
      id: "user-9",
      name: "Jane",
      email: "jane@example.com",
      password: "Password123",
      roles: [UserRole.ADMIN],
    });

    const tokenPair = {
      accessToken: "new-access",
      expiresIn: 900,
      expiresAt: "2030-01-01T00:15:00.000Z",
      refreshToken: "new-refresh",
      refreshExpiresIn: 604800,
      refreshExpiresAt: "2030-01-08T00:00:00.000Z",
    };

    findValidByTokenMock.mockResolvedValue({
      userId: "user-9",
      token: "rt-old",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
      revoked: false,
    });
    verifyRefreshMock.mockReturnValue({ sub: "user-9", roles: [UserRole.ADMIN] });
    findByIdMock.mockResolvedValue(user);
    generateMock.mockReturnValue(tokenPair);
    revokeByTokenMock.mockResolvedValue();
    saveRefreshMock.mockResolvedValue();

    const useCase = new RefreshTokenUseCase(refreshTokenRepo, userRepo, tokenService);

    const result = await useCase.execute("rt-old");

    expect(generateMock).toHaveBeenCalledWith({ sub: "user-9", roles: [UserRole.ADMIN] });
    expect(revokeByTokenMock).toHaveBeenCalledWith("rt-old");
    expect(saveRefreshMock).toHaveBeenCalledWith(
      "user-9",
      "new-refresh",
      new Date("2030-01-08T00:00:00.000Z")
    );
    expect(result).toEqual(tokenPair);
  });
});

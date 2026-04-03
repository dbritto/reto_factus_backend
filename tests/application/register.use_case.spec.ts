import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RegisterUseCase } from "../../src/application/use-cases/auth/register.use_case.js";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";
import { UserAlreadyExistsException } from "../../src/domain/exceptions/index.js";
import type { UserRepository } from "../../src/domain/repositories/usuario/user.repository.js";
import type { PasswordHasher } from "../../src/domain/services/password-hasher.interface.js";

describe("RegisterUseCase", () => {
  const findByEmailMock = jest.fn<(email: string) => Promise<unknown>>();
  const saveUserMock = jest.fn<(user: { email: { getValue: () => string }; getRoles: () => UserRole[] }) => Promise<void>>();
  const hashMock = jest.fn<(password: string) => Promise<string>>();

  const userRepo = {
    findByEmail: findByEmailMock,
    save: saveUserMock,
  } as unknown as UserRepository;

  const passwordHasher = {
    hash: hashMock,
  } as unknown as PasswordHasher;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lanza UserAlreadyExistsException cuando el email ya existe", async () => {
    findByEmailMock.mockResolvedValue({ id: "existing" });
    const useCase = new RegisterUseCase(userRepo, passwordHasher);

    await expect(
      useCase.execute("John", "john@example.com", "Password123", [UserRole.USER])
    ).rejects.toBeInstanceOf(UserAlreadyExistsException);

    expect(hashMock).not.toHaveBeenCalled();
    expect(saveUserMock).not.toHaveBeenCalled();
  });

  it("registra usuario con roles explicitos", async () => {
    findByEmailMock.mockResolvedValue(null);
    hashMock.mockResolvedValue("ValidHashPass1");
    saveUserMock.mockResolvedValue();

    const useCase = new RegisterUseCase(userRepo, passwordHasher);

    const result = await useCase.execute("Admin", "admin@example.com", "Password123", [UserRole.ADMIN]);

    expect(hashMock).toHaveBeenCalledWith("Password123");
    expect(saveUserMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      message: "User registered successfully",
      email: "admin@example.com",
      roles: [UserRole.ADMIN],
    });
  });

  it("asigna rol user por defecto cuando no llegan roles", async () => {
    findByEmailMock.mockResolvedValue(null);
    hashMock.mockResolvedValue("ValidHashPass1");
    saveUserMock.mockResolvedValue();

    const useCase = new RegisterUseCase(userRepo, passwordHasher);

    const result = await useCase.execute("User", "user@example.com", "Password123");

    expect(result.roles).toEqual([UserRole.USER]);
  });
});

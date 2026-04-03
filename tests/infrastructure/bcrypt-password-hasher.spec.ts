import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const hashMock = jest.fn<(plain: string, rounds: number) => Promise<string>>();
const compareMock = jest.fn<(plain: string, hashed: string) => Promise<boolean>>();

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: hashMock,
    compare: compareMock,
  },
}));

const { BcryptPasswordHasher } = await import(
  "../../src/infrastructure/services/bcrypt-password-hasher.js"
);

describe("BcryptPasswordHasher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hash delega en bcrypt.hash con 10 rounds", async () => {
    hashMock.mockResolvedValue("hashed-value");
    const hasher = new BcryptPasswordHasher();

    const result = await hasher.hash("Password123");

    expect(result).toBe("hashed-value");
    expect(hashMock).toHaveBeenCalledWith("Password123", 10);
  });

  it("compare delega en bcrypt.compare", async () => {
    compareMock.mockResolvedValue(true);
    const hasher = new BcryptPasswordHasher();

    const result = await hasher.compare("Password123", "hashed-value");

    expect(result).toBe(true);
    expect(compareMock).toHaveBeenCalledWith("Password123", "hashed-value");
  });
});

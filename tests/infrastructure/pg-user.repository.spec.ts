import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { User } from "../../src/domain/entities/usuario/user.entity.js";
import { UserRole } from "../../src/domain/enums/user-role.enum.js";
import { InvalidRoleException } from "../../src/domain/exceptions/index.js";
import type { DatabaseClient } from "../../src/infrastructure/database/database-client.interface.js";
import { PgUserRepository } from "../../src/infrastructure/repositories/pg-user.repository.js";

function buildUser(props?: Partial<ConstructorParameters<typeof User>[0]>) {
  return new User({
    id: "user-1",
    name: "John",
    email: "john@example.com",
    password: "Password123",
    roles: [UserRole.USER],
    ...props,
  });
}

describe("PgUserRepository", () => {
  const queryMock = jest.fn<(sql: string, params?: unknown[]) => Promise<unknown[]>>();
  const db = {
    query: ((sql: string, params?: unknown[]) =>
      queryMock(sql, params)) as DatabaseClient["query"],
  } as DatabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("save inserta usuario y sincroniza roles", async () => {
    queryMock
      .mockResolvedValueOnce([{ id: "user-1" }])
      .mockResolvedValueOnce([{ id: "role-user" }])
      .mockResolvedValueOnce([]);

    const repo = new PgUserRepository(db);
    const user = buildUser();

    await repo.save(user);

    expect(queryMock).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["John", "john@example.com", "Password123"]
    );
    expect(queryMock).toHaveBeenNthCalledWith(
      2,
      "SELECT id FROM roles WHERE name = $1 LIMIT 1",
      ["user"]
    );
    expect(queryMock).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      ["user-1", "role-user"]
    );
  });

  it("save no sincroniza roles si el insert no retorna id", async () => {
    queryMock.mockResolvedValueOnce([]);

    const repo = new PgUserRepository(db);

    await repo.save(buildUser());

    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("save lanza InvalidRoleException cuando un rol no existe", async () => {
    queryMock
      .mockResolvedValueOnce([{ id: "user-1" }])
      .mockResolvedValueOnce([]);

    const repo = new PgUserRepository(db);

    await expect(repo.save(buildUser({ roles: [UserRole.ADMIN] }))).rejects.toBeInstanceOf(
      InvalidRoleException
    );
  });

  it("update actualiza usuario, limpia roles y sincroniza", async () => {
    queryMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "role-admin" }])
      .mockResolvedValueOnce([]);

    const repo = new PgUserRepository(db);

    await repo.update(buildUser({ roles: [UserRole.ADMIN] }));

    expect(queryMock).toHaveBeenNthCalledWith(
      1,
      "UPDATE users SET name = $1, email = $2, password = $3, updated_at = NOW() WHERE id = $4 AND deleted_at IS NULL",
      ["John", "john@example.com", "Password123", "user-1"]
    );
    expect(queryMock).toHaveBeenNthCalledWith(2, "DELETE FROM user_roles WHERE user_id = $1", [
      "user-1",
    ]);
    expect(queryMock).toHaveBeenNthCalledWith(
      3,
      "SELECT id FROM roles WHERE name = $1 LIMIT 1",
      ["admin"]
    );
  });

  it("findByEmail retorna User cuando existe fila", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id: "user-9",
        name: "Jane",
        email: "jane@example.com",
        password: "Password123",
        roles: ["admin"],
      },
    ]);

    const repo = new PgUserRepository(db);
    const result = await repo.findByEmail("jane@example.com");

    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining("u.email = $1"), [
      "jane@example.com",
    ]);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Jane");
    expect(result?.email.getValue()).toBe("jane@example.com");
    expect(result?.hasRole(UserRole.ADMIN)).toBe(true);
  });

  it("findByEmail retorna null cuando no existe", async () => {
    queryMock.mockResolvedValueOnce([]);

    const repo = new PgUserRepository(db);
    const result = await repo.findByEmail("missing@example.com");

    expect(result).toBeNull();
  });

  it("findById retorna User cuando existe fila", async () => {
    queryMock.mockResolvedValueOnce([
      {
        id: "user-10",
        name: "Mike",
        email: "mike@example.com",
        password: "Password123",
        roles: ["user"],
      },
    ]);

    const repo = new PgUserRepository(db);
    const result = await repo.findById("user-10");

    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining("u.id = $1"), ["user-10"]);
    expect(result?.id).toBe("user-10");
  });

  it("delete hace borrado logico", async () => {
    queryMock.mockResolvedValueOnce([]);
    const repo = new PgUserRepository(db);

    await repo.delete("user-11");

    expect(queryMock).toHaveBeenCalledWith(
      "UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
      ["user-11"]
    );
  });
});

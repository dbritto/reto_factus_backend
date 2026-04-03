import { describe, expect, it } from "@jest/globals";
import { Role } from "../../../src/domain/entities/usuario/role.entity.js";
import { InvalidRoleException } from "../../../src/domain/exceptions/role.exceptions.js";

describe("Role Entity", () => {
  it('deberia crear un rol valido con permisos', () => {
    // 1 - Arrange
    const roleProps = {
      id: "role-1",
      name: "admin",
      permissions: ["read", "write", "delete"],
    };

    // 2 - Act
    const role = new Role(roleProps.id, roleProps.name, roleProps.permissions);

    // 3 - Assert
    expect(role.id).toBe(roleProps.id);
    expect(role.name).toBe(roleProps.name);
    expect(role.getPermissions()).toEqual(roleProps.permissions);
  });

  it('deberia validar si el rol tiene un permiso', () => {
    // 1 - Arrange
    const role = new Role("role-2", "editor", ["read", "write"]);

    // 2 - Act & Assert
    expect(role.hasPermission("read")).toBe(true);
    expect(role.hasPermission("delete")).toBe(false);
  });

  it('deberia devolver una copia de permisos y no permitir mutacion externa', () => {
    // 1 - Arrange
    const role = new Role("role-3", "user", ["read"]);

    // 2 - Act
    const permissions = role.getPermissions();
    permissions.push("delete");

    // 3 - Assert
    expect(permissions).toEqual(["read", "delete"]);
    expect(role.getPermissions()).toEqual(["read"]);
  });

  it('deberia lanzar excepcion si el nombre del rol esta vacio', () => {
    // 1 - Arrange, 2 - Act & Assert
    expect(() => new Role("role-4", "   ", ["read"])).toThrow(
      InvalidRoleException
    );
    expect(() => new Role("role-4", "   ", ["read"])).toThrow(
      "Rol inválido: El nombre del rol no puede estar vacío."
    );
  });

  it('deberia lanzar excepcion si no se proporcionan permisos', () => {
    // 1 - Arrange, 2 - Act & Assert
    expect(() => new Role("role-5", "admin", [])).toThrow(
      InvalidRoleException
    );
    expect(() => new Role("role-5", "admin", [])).toThrow(
      "Rol inválido: El rol debe tener al menos un permiso."
    );
  });
});

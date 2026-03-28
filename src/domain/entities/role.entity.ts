import { InvalidRoleException } from "../exceptions/role.exceptions.js";

export class Role {

    constructor(
        public readonly id: string,
        public readonly name: string, // Ejemplo: "admin", "user", "editor"
        private readonly permissions: string[] // Ejemplo: ["read", "write", "delete"]
    ) {
        if (name.trim() === "") {
            throw new InvalidRoleException("El nombre del rol no puede estar vacío.");
        }
        if (!permissions || permissions.length === 0) {
            throw new InvalidRoleException("El rol debe tener al menos un permiso.");
        }
    }

    public hasPermission(permission: string): boolean {
        return this.permissions.includes(permission);
    }

    public getPermissions(): string[] {
        return [...this.permissions];
    }

}
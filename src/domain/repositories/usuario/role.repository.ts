import { Role } from "../../entities/usuario/role.entity.js";

export interface RoleRepository {
    save(role: Role): Promise<void>;
    update(role: Role): Promise<void>;
    findByName(name: string): Promise<Role | null>;
    findById(id: string): Promise<Role | null>;
    delete(id: string): Promise<void>;
}

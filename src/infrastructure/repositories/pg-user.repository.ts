// src/infrastructure/repositories/pg-user.repository.ts
import type { DatabaseClient } from "../database/database-client.interface.js";
import type { UserRepository } from "../../domain/repositories/usuario/user.repository.js";
import { User } from "../../domain/entities/usuario/user.entity.js";
import { InvalidRoleException } from "../../domain/exceptions/index.js";

interface UserRow {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: string[];
}

const SELECT_USER_WITH_ROLES = `
    SELECT u.id, u.name, u.email, u.password,
           COALESCE(array_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '{}') AS roles
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.deleted_at IS NULL
`;

export class PgUserRepository implements UserRepository {
    constructor(private readonly db: DatabaseClient) {}

    async save(user: User): Promise<void> {
        const rows = await this.db.query<{ id: string }>(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
            [user.name, user.email.getValue(), user.getPasswordValue()]
        );
        const [newUser] = rows;
        if (!newUser) return;
        await this.syncRoles(newUser.id, user.getRoles().map(r => String(r)));
    }

    async update(user: User): Promise<void> {
        await this.db.query(
            "UPDATE users SET name = $1, email = $2, password = $3, updated_at = NOW() WHERE id = $4 AND deleted_at IS NULL",
            [user.name, user.email.getValue(), user.getPasswordValue(), user.id]
        );
        await this.db.query("DELETE FROM user_roles WHERE user_id = $1", [user.id]);
        await this.syncRoles(user.id!, user.getRoles().map(r => String(r)));
    }

    async findByEmail(email: string): Promise<User | null> {
        const rows = await this.db.query<UserRow>(
            `${SELECT_USER_WITH_ROLES} AND u.email = $1 GROUP BY u.id LIMIT 1`,
            [email]
        );
        return this.toUser(rows[0]);
    }

    async findById(id: string): Promise<User | null> {
        const rows = await this.db.query<UserRow>(
            `${SELECT_USER_WITH_ROLES} AND u.id = $1 GROUP BY u.id LIMIT 1`,
            [id]
        );
        return this.toUser(rows[0]);
    }

    async delete(id: string): Promise<void> {
        await this.db.query(
            "UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
            [id]
        );
    }

    private toUser(row: UserRow | undefined): User | null {
        if (!row) return null;
        return new User({ id: row.id, name: row.name, email: row.email, password: row.password, roles: row.roles });
    }

    private async syncRoles(userId: string, roleNames: string[]): Promise<void> {
        for (const roleName of roleNames) {
            const roleRows = await this.db.query<{ id: string }>(
                "SELECT id FROM roles WHERE name = $1 LIMIT 1",
                [roleName]
            );
            const [role] = roleRows;
            if (!role) {
                throw new InvalidRoleException(`El rol '${roleName}' no existe en la tabla roles.`);
            }
            await this.db.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                [userId, role.id]
            );
        }
    }
}

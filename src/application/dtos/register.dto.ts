import { UserRole } from "../../domain/enums/user-role.enum.js";

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    roles?: UserRole[];
}

export function validateRegisterDto(body: unknown): RegisterDto {
    if (typeof body !== "object" || body === null) {
        throw new Error("Request body is missing");
    }

    const { name, email, password, roles } = body as Record<string, unknown>;

    if (typeof name !== "string" || name.trim() === "") {
        throw new Error("name is required");
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new Error("email is required");
    }

    if (typeof password !== "string" || password.trim() === "") {
        throw new Error("password is required");
    }

    if (roles !== undefined) {
        if (!Array.isArray(roles) || roles.some((role) => typeof role !== "string")) {
            throw new Error("roles must be an array of strings");
        }

        const normalizedRoles = roles.map((role) => String(role)) as UserRole[];
        const validRoles = new Set(Object.values(UserRole));
        const hasInvalidRole = normalizedRoles.some((role) => !validRoles.has(role));
        if (hasInvalidRole) {
            throw new Error("roles contains invalid values");
        }

        return {
            name: name.trim(),
            email: email.trim(),
            password,
            roles: normalizedRoles,
        };
    }

    return { name: name.trim(), email: email.trim(), password };
}
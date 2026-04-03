// src/application/dtos/login.dto.ts

export interface LoginDto {
    email: string;
    password: string;
}

export function validateLoginDto(body: unknown): LoginDto {
    if (typeof body !== "object" || body === null) {
        throw new Error("Request body is missing");
    }

    const { email, password } = body as Record<string, unknown>;

    if (typeof email !== "string" || email.trim() === "") {
        throw new Error("email is required");
    }

    if (typeof password !== "string" || password.trim() === "") {
        throw new Error("password is required");
    }

    return { email: email.trim(), password };
}

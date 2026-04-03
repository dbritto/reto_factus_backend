// src/infrastructure/services/bcrypt-password-hasher.ts
import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../domain/services/password-hasher.interface.js";

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}

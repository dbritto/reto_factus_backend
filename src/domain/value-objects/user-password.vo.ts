// src/domain/value-objects/user-password.vo.ts
import { WeakPasswordException } from "../exceptions/user.exceptions.js";

export class UserPassword {
    private readonly value: string;

    constructor(password: string) {
        if (!this.validate(password)) {
            throw new WeakPasswordException();
        }
        this.value = password;
    }

    private validate(password: string): boolean {
        // Accept plain passwords that satisfy policy OR persisted bcrypt hashes.
        const plainPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const bcryptHashRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
        return plainPasswordRegex.test(password) || bcryptHashRegex.test(password);
    }

    public getValue(): string {
        return this.value;
    }
}
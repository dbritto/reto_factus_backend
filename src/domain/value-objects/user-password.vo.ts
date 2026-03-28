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
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    public getValue(): string {
        return this.value;
    }
}
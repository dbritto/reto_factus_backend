import { InvalidEmailException } from "../exceptions/user.exceptions.js";

export class UserEmail {
    private readonly value: string;

    constructor(email: string) {
        if (!this.validate(email)) {
            throw new InvalidEmailException(email);
        }
        this.value = email;
    }

    private validate(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public getValue(): string {
        return this.value;
    }
}
import { User } from "../../../domain/entities/usuario/user.entity.js";
import { UserRole } from "../../../domain/enums/user-role.enum.js";
import { UserAlreadyExistsException } from "../../../domain/exceptions/index.js";
import type { UserRepository } from "../../../domain/repositories/usuario/user.repository.js";
import type { PasswordHasher } from "../../../domain/services/password-hasher.interface.js";

export class RegisterUseCase {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly passwordHasher: PasswordHasher
    ) { }

    async execute(name: string, email: string, password: string, roles?: UserRole[]) {
        const existing = await this.userRepo.findByEmail(email);
        if (existing) {
            throw new UserAlreadyExistsException(email);
        }

        const hashedPassword = await this.passwordHasher.hash(password);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            roles: roles ?? [UserRole.USER],
        });

        await this.userRepo.save(user);

        return {
            message: "User registered successfully",
            email: user.email.getValue(),
            roles: user.getRoles(),
        };
    }
}
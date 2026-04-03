// src/application/auth/login.use-case.ts
import type { UserRepository } from "../../../domain/repositories/usuario/user.repository.js";
import type { RefreshTokenRepository } from "../../../domain/repositories/auth/refresh-token.repository.js";
import type { PasswordHasher } from "../../../domain/services/password-hasher.interface.js";
import type { TokenService } from "../../../domain/services/TokenService.js";
import { InvalidCredentialsException } from "../../../domain/exceptions/index.js";

export class LoginUseCase {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly refreshTokenRepo: RefreshTokenRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService
    ) { }

    async execute(email: string, password: string) {
        // 1. Buscar usuario por email
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsException();
        }

        // 2. Verificar contraseña con hash
        const isValid = await this.passwordHasher.compare(password, user.getPasswordValue());
        if (!isValid) {
            throw new InvalidCredentialsException();
        }

        // 3. Generar token
        const tokens = this.tokenService.generate({
            sub: user.id!,
            roles: user.getRoles(),
        });

        await this.refreshTokenRepo.save(user.id!, tokens.refreshToken, new Date(tokens.refreshExpiresAt));

        return tokens;
    }
}
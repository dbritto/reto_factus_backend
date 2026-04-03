import { InvalidCredentialsException } from "../../../domain/exceptions/index.js";
import type { RefreshTokenRepository } from "../../../domain/repositories/auth/refresh-token.repository.js";
import type { TokenService } from "../../../domain/services/TokenService.js";
import type { UserRepository } from "../../../domain/repositories/usuario/user.repository.js";

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(refreshToken: string) {
    const storedToken = await this.refreshTokenRepo.findValidByToken(refreshToken);
    if (!storedToken) {
      throw new InvalidCredentialsException();
    }

    const payload = this.tokenService.verifyRefresh(refreshToken);
    if (payload.sub !== storedToken.userId) {
      throw new InvalidCredentialsException();
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const tokens = this.tokenService.generate({
      sub: user.id!,
      roles: user.getRoles(),
    });

    await this.refreshTokenRepo.revokeByToken(refreshToken);
    await this.refreshTokenRepo.save(user.id!, tokens.refreshToken, new Date(tokens.refreshExpiresAt));

    return tokens;
  }
}

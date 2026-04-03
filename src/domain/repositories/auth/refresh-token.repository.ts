export interface RefreshTokenRecord {
  userId: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
}

export interface RefreshTokenRepository {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
  findValidByToken(token: string): Promise<RefreshTokenRecord | null>;
  revokeByToken(token: string): Promise<void>;
}

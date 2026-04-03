import type { RefreshTokenRecord, RefreshTokenRepository } from "../../domain/repositories/auth/refresh-token.repository.js";
import type { DatabaseClient } from "../database/database-client.interface.js";

interface RefreshTokenRow {
  user_id: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
}

export class PgRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly db: DatabaseClient) {}

  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  }

  async findValidByToken(token: string): Promise<RefreshTokenRecord | null> {
    const rows = await this.db.query<RefreshTokenRow>(
      `SELECT user_id, token, expires_at, revoked
       FROM refresh_tokens
       WHERE token = $1
         AND revoked = false
         AND expires_at > NOW()
       LIMIT 1`,
      [token]
    );

    const [row] = rows;
    if (!row) return null;

    return {
      userId: row.user_id,
      token: row.token,
      expiresAt: new Date(row.expires_at),
      revoked: row.revoked,
    };
  }

  async revokeByToken(token: string): Promise<void> {
    await this.db.query(
      `UPDATE refresh_tokens
       SET revoked = true,
           revoked_at = NOW()
       WHERE token = $1
         AND revoked = false`,
      [token]
    );
  }
}

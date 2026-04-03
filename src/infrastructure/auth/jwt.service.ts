// src/infrastructure/auth/jwt.service.ts
import jwt from "jsonwebtoken";
import type { TokenService } from "../../domain/services/TokenService.js";
import type { AuthPayload } from "../../domain/entities/auth/auth-payload.js";

const SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || SECRET;
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export class JwtService implements TokenService {
  verify(token: string): AuthPayload {
    try {
      return jwt.verify(token, SECRET) as AuthPayload;
    } catch (error) {
      throw new Error("Invalid token", { cause: error });
    }
  }

  verifyRefresh(token: string): AuthPayload {
    try {
      return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
    } catch (error) {
      throw new Error("Invalid refresh token", { cause: error });
    }
  }

  generate(payload: AuthPayload) {
    const accessToken = jwt.sign(payload, SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    });

    const now = Date.now();
    const expiresAt = new Date(now + ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000).toISOString();
    const refreshExpiresAt = new Date(now + REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000).toISOString();

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      expiresAt,
      refreshToken,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      refreshExpiresAt,
    };
  }
}
// src/domain/services/TokenService.ts
import type { AuthPayload } from "../entities/auth/auth-payload.js";

export interface AccessTokenResult {
    accessToken: string;
    expiresIn: number;
    expiresAt: string;
}

export interface TokenPairResult extends AccessTokenResult {
    refreshToken: string;
    refreshExpiresIn: number;
    refreshExpiresAt: string;
}

export interface TokenService {
    generate(payload: AuthPayload): TokenPairResult;
    verify(token: string): AuthPayload;
    verifyRefresh(token: string): AuthPayload;
}
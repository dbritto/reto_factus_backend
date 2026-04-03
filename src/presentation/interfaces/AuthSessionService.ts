// src/application/interfaces/AuthSessionService.ts
export interface AuthSessionService {
    createSession(userId: string, roles: string[]): Promise<string>;
    invalidateSession(token: string): Promise<void>;
}
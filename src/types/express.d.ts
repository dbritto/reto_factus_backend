import type { AuthPayload } from "../domain/entities/auth/auth-payload.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};

// src/domain/auth/auth-payload.ts
import { UserRole } from "../../enums/user-role.enum.js";

export interface AuthPayload {
  sub: string;        // userId (estándar JWT)
  roles: UserRole[];  // ["admin", "user"]
}
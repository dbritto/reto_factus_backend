// src/presentation/middleware/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../../infrastructure/auth/jwt.service.js";
import { PgDatabaseClient } from "../../infrastructure/database/pg-database-client.js";

interface PermissionRow {
  permission: string;
}

const dbClient = new PgDatabaseClient();
const ROLE_PERMISSIONS_SQL = `
  SELECT DISTINCT p.permission
  FROM roles r
  CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.permissions::jsonb, '[]'::jsonb)) AS p(permission)
  WHERE r.name = ANY($1::text[])
`;

const jwtService = new JwtService();

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwtService.verify(token);

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function loadPermissionsForRoles(roles: string[]): Promise<Set<string>> {
  if (roles.length === 0) {
    return new Set<string>();
  }

  const rows = await dbClient.query<PermissionRow>(ROLE_PERMISSIONS_SQL, [roles]);
  return new Set(rows.map((row) => row.permission));
}

export function authorizePermissions(...requiredPermissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const permissions = await loadPermissionsForRoles(req.user.roles.map((role) => String(role)));
      const isAuthorized = requiredPermissions.every((permission) => permissions.has(permission));

      if (!isAuthorized) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("[authMiddleware.authorizePermissions] authorization error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
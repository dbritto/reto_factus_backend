// src/presentation/middleware/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../../infrastructure/auth/jwt.service.js";

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
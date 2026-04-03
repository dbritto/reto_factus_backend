import type { Request, Response } from "express";
import { LoginUseCase } from "../../application/use-cases/auth/login.use_case.js";
import { RegisterUseCase } from "../../application/use-cases/auth/register.use_case.js";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh_token.use_case.js";
import { validateLoginDto } from "../../application/dtos/login.dto.js";
import { validateRefreshTokenDto } from "../../application/dtos/refresh-token.dto.js";
import { validateRegisterDto } from "../../application/dtos/register.dto.js";
import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
} from "../../domain/exceptions/index.js";

const loginValidationErrors = new Set([
  "Request body is missing",
  "email is required",
  "password is required",
  "refreshToken is required",
]);

function getSafeMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    return message.length > 0 ? message : fallback;
  }
  return fallback;
}

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto = validateLoginDto(req.body);
      const result = await this.loginUseCase.execute(dto.email, dto.password);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: getSafeMessage(error, "Invalid credentials") });
      }

      const message = getSafeMessage(error, "Invalid login request");
      if (loginValidationErrors.has(message)) {
        return res.status(400).json({ message });
      }

      console.error("[AuthController.login] unexpected error:", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const dto = validateRegisterDto(req.body);
      const result = await this.registerUseCase.execute(
        dto.name,
        dto.email,
        dto.password,
        dto.roles
      );
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return res.status(409).json({ message: getSafeMessage(error, "User already exists") });
      }

      const message = getSafeMessage(error, "Invalid register request");
      if (message !== "Invalid register request") {
        return res.status(400).json({ message });
      }

      console.error("[AuthController.register] unexpected error:", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    try {
      const dto = validateRefreshTokenDto(req.body);
      const result = await this.refreshTokenUseCase.execute(dto.refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(401).json({ message: getSafeMessage(error, "Invalid refresh token") });
      }

      const message = getSafeMessage(error, "Invalid refresh request");
      if (loginValidationErrors.has(message)) {
        return res.status(400).json({ message });
      }

      console.error("[AuthController.refresh] unexpected error:", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

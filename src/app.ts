import "dotenv/config";
import express from "express";
import { PgDatabaseClient } from "./infrastructure/database/pg-database-client.js";
import { PgRefreshTokenRepository } from "./infrastructure/repositories/pg-refresh-token.repository.js";
import { PgUserRepository } from "./infrastructure/repositories/pg-user.repository.js";
import { BcryptPasswordHasher } from "./infrastructure/services/bcrypt-password-hasher.js";
import { JwtService } from "./infrastructure/auth/jwt.service.js";
import { LoginUseCase } from "./application/use-cases/auth/login.use_case.js";
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh_token.use_case.js";
import { RegisterUseCase } from "./application/use-cases/auth/register.use_case.js";
import { AuthController } from "./presentation/controller/auth.controller.js";
import { buildAuthRouter } from "./presentation/routes/auth.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

const dbClient = new PgDatabaseClient();
const userRepository = new PgUserRepository(dbClient);
const refreshTokenRepository = new PgRefreshTokenRepository(dbClient);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtService();

const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, passwordHasher, tokenService);
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, userRepository, tokenService);
const authController = new AuthController(loginUseCase, registerUseCase, refreshTokenUseCase);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", buildAuthRouter(authController));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

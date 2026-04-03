import express from "express";
import { PgDatabaseClient } from "./src/infrastructure/database/pg-database-client.js";
import { PgUserRepository } from "./src/infrastructure/repositories/pg-user.repository.js";
import { BcryptPasswordHasher } from "./src/infrastructure/services/bcrypt-password-hasher.js";
import { JwtService } from "./src/infrastructure/auth/jwt.service.js";
import { LoginUseCase } from "./src/application/use-cases/auth/login.use_case.js";
import { RegisterUseCase } from "./src/application/use-cases/auth/register.use_case.js";
import { AuthController } from "./src/presentation/controller/auth.controller.js";
import { buildAuthRouter } from "./src/presentation/routes/auth.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

const dbClient = new PgDatabaseClient();
const userRepository = new PgUserRepository(dbClient);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtService();

const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const authController = new AuthController(loginUseCase, registerUseCase);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", buildAuthRouter(authController));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
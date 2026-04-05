import "dotenv/config";
import express from "express";
import { PgDatabaseClient } from "./infrastructure/database/pg-database-client.js";
import { PgRefreshTokenRepository } from "./infrastructure/repositories/pg-refresh-token.repository.js";
import { PgProductoRepository } from "./infrastructure/repositories/pg-producto.repository.js";
import { PgUserRepository } from "./infrastructure/repositories/pg-user.repository.js";
import { BcryptPasswordHasher } from "./infrastructure/services/bcrypt-password-hasher.js";
import { JwtService } from "./infrastructure/auth/jwt.service.js";
import { LoginUseCase } from "./application/use-cases/auth/login.use_case.js";
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh_token.use_case.js";
import { RegisterUseCase } from "./application/use-cases/auth/register.use_case.js";
import { CreateProductoUseCase } from "./application/use-cases/producto/create-producto.use_case.js";
import { DeleteProductoUseCase } from "./application/use-cases/producto/delete-producto.use_case.js";
import { GetProductoUseCase } from "./application/use-cases/producto/get-producto.use_case.js";
import { ListProductosUseCase } from "./application/use-cases/producto/list-productos.use_case.js";
import { UpdateProductoUseCase } from "./application/use-cases/producto/update-producto.use_case.js";
import { AuthController } from "./presentation/controller/auth.controller.js";
import { buildAuthRouter } from "./presentation/routes/auth.routes.js";
import { buildProductoRouter } from "./presentation/routes/producto.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

const dbClient = new PgDatabaseClient();
const userRepository = new PgUserRepository(dbClient);
const productoRepository = new PgProductoRepository(dbClient);
const refreshTokenRepository = new PgRefreshTokenRepository(dbClient);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtService();

const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, passwordHasher, tokenService);
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, userRepository, tokenService);
const createProductoUseCase = new CreateProductoUseCase(productoRepository);
const getProductoUseCase = new GetProductoUseCase(productoRepository);
const listProductosUseCase = new ListProductosUseCase(productoRepository);
const updateProductoUseCase = new UpdateProductoUseCase(productoRepository);
const deleteProductoUseCase = new DeleteProductoUseCase(productoRepository);
const authController = new AuthController(loginUseCase, registerUseCase, refreshTokenUseCase);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", buildAuthRouter(authController));
app.use("/api/productos", buildProductoRouter({
  createProductoUseCase,
  getProductoUseCase,
  listProductosUseCase,
  updateProductoUseCase,
  deleteProductoUseCase,
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

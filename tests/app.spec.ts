import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("app bootstrap", () => {
  const originalEnv = { ...process.env };

  type ExpressMock = jest.Mock & { json: jest.Mock };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("usa el puerto 3000 por defecto cuando PORT no esta definido", async () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_USER = "postgres";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "factus";
    process.env.JWT_SECRET = "jwt-secret";
    delete process.env.PORT;

    const appMock = {
      disable: jest.fn(),
      use: jest.fn(),
      get: jest.fn(),
      listen: jest.fn((port: unknown, cb?: unknown) => {
        if (typeof cb === "function") {
          cb();
        }
        return { port };
      }),
    };
    const expressMock = jest.fn(() => appMock) as unknown as ExpressMock;
    expressMock.json = jest.fn(() => ({}));

    jest.unstable_mockModule("dotenv/config", () => ({}));
    jest.unstable_mockModule("express", () => ({ default: expressMock }));
    jest.unstable_mockModule("../src/infrastructure/database/pg-database-client.js", () => ({
      PgDatabaseClient: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-user.repository.js", () => ({
      PgUserRepository: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-refresh-token.repository.js", () => ({
      PgRefreshTokenRepository: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-producto.repository.js", () => ({
      PgProductoRepository: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/infrastructure/services/bcrypt-password-hasher.js", () => ({
      BcryptPasswordHasher: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/infrastructure/auth/jwt.service.js", () => ({
      JwtService: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/login.use_case.js", () => ({
      LoginUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/register.use_case.js", () => ({
      RegisterUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/refresh_token.use_case.js", () => ({
      RefreshTokenUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/create-producto.use_case.js", () => ({
      CreateProductoUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/get-producto.use_case.js", () => ({
      GetProductoUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/list-productos.use_case.js", () => ({
      ListProductosUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/update-producto.use_case.js", () => ({
      UpdateProductoUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/delete-producto.use_case.js", () => ({
      DeleteProductoUseCase: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/presentation/controller/auth.controller.js", () => ({
      AuthController: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/presentation/routes/auth.routes.js", () => ({
      buildAuthRouter: jest.fn(() => ({})),
    }));
    jest.unstable_mockModule("../src/presentation/routes/producto.routes.js", () => ({
      buildProductoRouter: jest.fn(() => ({})),
    }));

    await import("../src/app.js");

    expect(appMock.listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it("configura express, rutas y listen cuando el entorno es valido", async () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_USER = "postgres";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "factus";
    process.env.JWT_SECRET = "jwt-secret";
    process.env.PORT = "4001";

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    const appMock = {
      disable: jest.fn(),
      use: jest.fn(),
      get: jest.fn(),
      listen: jest.fn((port, cb) => {
        if (typeof cb === "function") {
          cb();
        }
        return { port };
      }),
    };

    const jsonMiddleware = { name: "json-middleware" };
    const expressMock = jest.fn(() => appMock) as unknown as ExpressMock;
    expressMock.json = jest.fn(() => jsonMiddleware);

    const dbClientInstance = { name: "db-client" };
    const userRepoInstance = { name: "user-repo" };
    const refreshRepoInstance = { name: "refresh-repo" };
    const productoRepoInstance = { name: "producto-repo" };
    const hasherInstance = { name: "hasher" };
    const tokenServiceInstance = { name: "token-service" };
    const loginUseCaseInstance = { name: "login-uc" };
    const registerUseCaseInstance = { name: "register-uc" };
    const refreshUseCaseInstance = { name: "refresh-uc" };
    const createProductoUseCaseInstance = { name: "create-producto-uc" };
    const getProductoUseCaseInstance = { name: "get-producto-uc" };
    const listProductosUseCaseInstance = { name: "list-productos-uc" };
    const updateProductoUseCaseInstance = { name: "update-producto-uc" };
    const deleteProductoUseCaseInstance = { name: "delete-producto-uc" };
    const authControllerInstance = { name: "auth-controller" };
    const authRouter = { name: "auth-router" };
    const productoRouter = { name: "producto-router" };

    const PgDatabaseClientMock: jest.Mock = jest.fn(() => dbClientInstance);
    const PgUserRepositoryMock: jest.Mock = jest.fn(() => userRepoInstance);
    const PgRefreshTokenRepositoryMock: jest.Mock = jest.fn(() => refreshRepoInstance);
    const PgProductoRepositoryMock: jest.Mock = jest.fn(() => productoRepoInstance);
    const BcryptPasswordHasherMock: jest.Mock = jest.fn(() => hasherInstance);
    const JwtServiceMock: jest.Mock = jest.fn(() => tokenServiceInstance);
    const LoginUseCaseMock: jest.Mock = jest.fn(() => loginUseCaseInstance);
    const RegisterUseCaseMock: jest.Mock = jest.fn(() => registerUseCaseInstance);
    const RefreshTokenUseCaseMock: jest.Mock = jest.fn(() => refreshUseCaseInstance);
    const CreateProductoUseCaseMock: jest.Mock = jest.fn(() => createProductoUseCaseInstance);
    const GetProductoUseCaseMock: jest.Mock = jest.fn(() => getProductoUseCaseInstance);
    const ListProductosUseCaseMock: jest.Mock = jest.fn(() => listProductosUseCaseInstance);
    const UpdateProductoUseCaseMock: jest.Mock = jest.fn(() => updateProductoUseCaseInstance);
    const DeleteProductoUseCaseMock: jest.Mock = jest.fn(() => deleteProductoUseCaseInstance);
    const AuthControllerMock: jest.Mock = jest.fn(() => authControllerInstance);
    const buildAuthRouterMock: jest.Mock = jest.fn(() => authRouter);
    const buildProductoRouterMock: jest.Mock = jest.fn(() => productoRouter);

    jest.unstable_mockModule("dotenv/config", () => ({}));
    jest.unstable_mockModule("express", () => ({ default: expressMock }));
    jest.unstable_mockModule("../src/infrastructure/database/pg-database-client.js", () => ({
      PgDatabaseClient: PgDatabaseClientMock,
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-user.repository.js", () => ({
      PgUserRepository: PgUserRepositoryMock,
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-refresh-token.repository.js", () => ({
      PgRefreshTokenRepository: PgRefreshTokenRepositoryMock,
    }));
    jest.unstable_mockModule("../src/infrastructure/repositories/pg-producto.repository.js", () => ({
      PgProductoRepository: PgProductoRepositoryMock,
    }));
    jest.unstable_mockModule("../src/infrastructure/services/bcrypt-password-hasher.js", () => ({
      BcryptPasswordHasher: BcryptPasswordHasherMock,
    }));
    jest.unstable_mockModule("../src/infrastructure/auth/jwt.service.js", () => ({
      JwtService: JwtServiceMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/login.use_case.js", () => ({
      LoginUseCase: LoginUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/register.use_case.js", () => ({
      RegisterUseCase: RegisterUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/auth/refresh_token.use_case.js", () => ({
      RefreshTokenUseCase: RefreshTokenUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/create-producto.use_case.js", () => ({
      CreateProductoUseCase: CreateProductoUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/get-producto.use_case.js", () => ({
      GetProductoUseCase: GetProductoUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/list-productos.use_case.js", () => ({
      ListProductosUseCase: ListProductosUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/update-producto.use_case.js", () => ({
      UpdateProductoUseCase: UpdateProductoUseCaseMock,
    }));
    jest.unstable_mockModule("../src/application/use-cases/producto/delete-producto.use_case.js", () => ({
      DeleteProductoUseCase: DeleteProductoUseCaseMock,
    }));
    jest.unstable_mockModule("../src/presentation/controller/auth.controller.js", () => ({
      AuthController: AuthControllerMock,
    }));
    jest.unstable_mockModule("../src/presentation/routes/auth.routes.js", () => ({
      buildAuthRouter: buildAuthRouterMock,
    }));
    jest.unstable_mockModule("../src/presentation/routes/producto.routes.js", () => ({
      buildProductoRouter: buildProductoRouterMock,
    }));

    await import("../src/app.js");

    expect(expressMock).toHaveBeenCalledTimes(1);
    expect(expressMock.json).toHaveBeenCalledTimes(1);
    expect(appMock.disable).toHaveBeenCalledWith("x-powered-by");
    expect(appMock.use).toHaveBeenCalledWith(jsonMiddleware);
    expect(appMock.get).toHaveBeenCalledWith("/", expect.any(Function));

    expect(PgDatabaseClientMock).toHaveBeenCalledTimes(1);
    expect(PgUserRepositoryMock).toHaveBeenCalledWith(dbClientInstance);
    expect(PgRefreshTokenRepositoryMock).toHaveBeenCalledWith(dbClientInstance);
    expect(PgProductoRepositoryMock).toHaveBeenCalledWith(dbClientInstance);
    expect(BcryptPasswordHasherMock).toHaveBeenCalledTimes(1);
    expect(JwtServiceMock).toHaveBeenCalledTimes(1);

    expect(LoginUseCaseMock).toHaveBeenCalledWith(
      userRepoInstance,
      refreshRepoInstance,
      hasherInstance,
      tokenServiceInstance
    );
    expect(RegisterUseCaseMock).toHaveBeenCalledWith(userRepoInstance, hasherInstance);
    expect(RefreshTokenUseCaseMock).toHaveBeenCalledWith(
      refreshRepoInstance,
      userRepoInstance,
      tokenServiceInstance
    );
    expect(CreateProductoUseCaseMock).toHaveBeenCalledWith(productoRepoInstance);
    expect(GetProductoUseCaseMock).toHaveBeenCalledWith(productoRepoInstance);
    expect(ListProductosUseCaseMock).toHaveBeenCalledWith(productoRepoInstance);
    expect(UpdateProductoUseCaseMock).toHaveBeenCalledWith(productoRepoInstance);
    expect(DeleteProductoUseCaseMock).toHaveBeenCalledWith(productoRepoInstance);
    expect(AuthControllerMock).toHaveBeenCalledWith(
      loginUseCaseInstance,
      registerUseCaseInstance,
      refreshUseCaseInstance
    );

    expect(buildAuthRouterMock).toHaveBeenCalledWith(authControllerInstance);
    expect(appMock.use).toHaveBeenCalledWith("/api/auth", authRouter);
    expect(buildProductoRouterMock).toHaveBeenCalledWith({
      createProductoUseCase: createProductoUseCaseInstance,
      getProductoUseCase: getProductoUseCaseInstance,
      listProductosUseCase: listProductosUseCaseInstance,
      updateProductoUseCase: updateProductoUseCaseInstance,
      deleteProductoUseCase: deleteProductoUseCaseInstance,
    });
    expect(appMock.use).toHaveBeenCalledWith("/api/productos", productoRouter);
    expect(appMock.listen).toHaveBeenCalledWith("4001", expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith("Server is running on port 4001");
  });
});

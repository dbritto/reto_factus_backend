import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const authMiddlewareMock = jest.fn((req: Request, res: Response, next: () => void) => next());
const authorizePermissionsMock = jest.fn(
  () => (req: Request, res: Response, next: () => void) => next()
);

const createProductoActionMock = jest.fn();
const findAllProductosActionMock = jest.fn();
const findProductoByIdActionMock = jest.fn();
const updateProductoActionMock = jest.fn();
const deleteProductoActionMock = jest.fn();

jest.unstable_mockModule("../../src/presentation/middleware/auth.middleware.js", () => ({
  authMiddleware: authMiddlewareMock,
  authorizePermissions: authorizePermissionsMock,
}));

jest.unstable_mockModule("../../src/presentation/controller/producto/create-producto.action.js", () => ({
  createProductoAction: createProductoActionMock,
}));

jest.unstable_mockModule("../../src/presentation/controller/producto/find-all-productos.action.js", () => ({
  findAllProductosAction: findAllProductosActionMock,
}));

jest.unstable_mockModule("../../src/presentation/controller/producto/find-producto-by-id.action.js", () => ({
  findProductoByIdAction: findProductoByIdActionMock,
}));

jest.unstable_mockModule("../../src/presentation/controller/producto/update-producto.action.js", () => ({
  updateProductoAction: updateProductoActionMock,
}));

jest.unstable_mockModule("../../src/presentation/controller/producto/delete-producto.action.js", () => ({
  deleteProductoAction: deleteProductoActionMock,
}));

const { buildProductoRouter } = await import("../../src/presentation/routes/producto.routes.js");

type RouteMethod = "get" | "post" | "put" | "delete";

type RouterLayer = {
  name?: string;
  handle?: unknown;
  route?: {
    path: string;
    methods: Record<string, boolean>;
    stack: Array<{ handle: (req: Request, res: Response) => void }>;
  };
};

function getRouteHandler(
  router: { stack: RouterLayer[] },
  path: string,
  method: RouteMethod
): (req: Request, res: Response) => void {
  const layer = router.stack.find(
    (item) => item.route?.path === path && item.route.methods[method]
  );

  if (!layer?.route) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  const last = layer.route.stack[layer.route.stack.length - 1];
  if (!last) {
    throw new Error(`Route ${method.toUpperCase()} ${path} has no handler`);
  }

  return last.handle;
}

describe("buildProductoRouter", () => {
  const actions = {
    createProductoUseCase: { execute: jest.fn() },
    getProductoUseCase: { execute: jest.fn() },
    listProductosUseCase: { execute: jest.fn() },
    updateProductoUseCase: { execute: jest.fn() },
    deleteProductoUseCase: { execute: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authorizePermissionsMock.mockImplementation(
      () => (req: Request, res: Response, next: () => void) => next()
    );
  });

  it("registra las rutas CRUD de producto", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };

    const registered = router.stack
      .filter((layer) => layer.route)
      .map((layer) => {
        const route = layer.route!;
        const method = Object.keys(route.methods).find((m) => route.methods[m]);
        return `${method}:${route.path}`;
      })
      .sort();

    expect(registered).toEqual([
      "delete:/:idProducto",
      "get:/",
      "get:/:idProducto",
      "post:/",
      "put:/:idProducto",
    ]);
  });

  it("aplica middleware de permisos esperado por endpoint", () => {
    buildProductoRouter(actions as never);

    expect(authorizePermissionsMock).toHaveBeenNthCalledWith(1, "inventory:read");
    expect(authorizePermissionsMock).toHaveBeenNthCalledWith(2, "inventory:read");
    expect(authorizePermissionsMock).toHaveBeenNthCalledWith(3, "inventory:update");
    expect(authorizePermissionsMock).toHaveBeenNthCalledWith(4, "inventory:update");
    expect(authorizePermissionsMock).toHaveBeenNthCalledWith(5, "inventory:update");
  });

  it("delegua GET / a findAllProductosAction", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/", "get");
    const req = {} as Request;
    const res = {} as Response;

    handler(req, res);

    expect(findAllProductosActionMock).toHaveBeenCalledWith(actions.listProductosUseCase, req, res);
  });

  it("delegua GET /:idProducto a findProductoByIdAction", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/:idProducto", "get");
    const req = {} as Request;
    const res = {} as Response;

    handler(req, res);

    expect(findProductoByIdActionMock).toHaveBeenCalledWith(actions.getProductoUseCase, req, res);
  });

  it("delegua POST / a createProductoAction", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/", "post");
    const req = {} as Request;
    const res = {} as Response;

    handler(req, res);

    expect(createProductoActionMock).toHaveBeenCalledWith(actions.createProductoUseCase, req, res);
  });

  it("delegua PUT /:idProducto a updateProductoAction", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/:idProducto", "put");
    const req = {} as Request;
    const res = {} as Response;

    handler(req, res);

    expect(updateProductoActionMock).toHaveBeenCalledWith(actions.updateProductoUseCase, req, res);
  });

  it("delegua DELETE /:idProducto a deleteProductoAction", () => {
    const router = buildProductoRouter(actions as never) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/:idProducto", "delete");
    const req = {} as Request;
    const res = {} as Response;

    handler(req, res);

    expect(deleteProductoActionMock).toHaveBeenCalledWith(actions.deleteProductoUseCase, req, res);
  });
});

import type { Request, Response } from "express";
import { describe, expect, it, jest } from "@jest/globals";
import type { AuthController } from "../../src/presentation/controller/auth.controller.js";
import { buildAuthRouter } from "../../src/presentation/routes/auth.routes.js";

type RouterLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
    stack: Array<{ handle: (req: Request, res: Response) => void }>;
  };
};

function getRouteHandler(
  router: { stack: RouterLayer[] },
  path: string,
  method: "post"
): (req: Request, res: Response) => void {
  const layer = router.stack.find(
    (item) => item.route?.path === path && item.route.methods[method]
  );

  if (!layer?.route) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  return layer.route.stack[0].handle;
}

describe("buildAuthRouter", () => {
  it("registra las rutas POST de login, register y refresh", () => {
    const controller = {
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
    } as unknown as AuthController;

    const router = buildAuthRouter(controller) as unknown as { stack: RouterLayer[] };

    const paths = router.stack
      .filter((layer) => layer.route)
      .map((layer) => layer.route?.path)
      .sort();

    expect(paths).toEqual(["/login", "/refresh", "/register"]);
  });

  it("delegua POST /login al método login del controller", () => {
    const req = {} as Request;
    const res = {} as Response;

    const controller = {
      login: jest.fn(() => Promise.resolve(res)),
      register: jest.fn(() => Promise.resolve(res)),
      refresh: jest.fn(() => Promise.resolve(res)),
    } as unknown as AuthController;

    const router = buildAuthRouter(controller) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/login", "post");

    handler(req, res);

    expect(controller.login).toHaveBeenCalledWith(req, res);
  });

  it("delegua POST /register al método register del controller", () => {
    const req = {} as Request;
    const res = {} as Response;

    const controller = {
      login: jest.fn(() => Promise.resolve(res)),
      register: jest.fn(() => Promise.resolve(res)),
      refresh: jest.fn(() => Promise.resolve(res)),
    } as unknown as AuthController;

    const router = buildAuthRouter(controller) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/register", "post");

    handler(req, res);

    expect(controller.register).toHaveBeenCalledWith(req, res);
  });

  it("delegua POST /refresh al método refresh del controller", () => {
    const req = {} as Request;
    const res = {} as Response;

    const controller = {
      login: jest.fn(() => Promise.resolve(res)),
      register: jest.fn(() => Promise.resolve(res)),
      refresh: jest.fn(() => Promise.resolve(res)),
    } as unknown as AuthController;

    const router = buildAuthRouter(controller) as unknown as { stack: RouterLayer[] };
    const handler = getRouteHandler(router, "/refresh", "post");

    handler(req, res);

    expect(controller.refresh).toHaveBeenCalledWith(req, res);
  });
});

import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

export function buildAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post("/login", (req, res) => {
    void authController.login(req, res);
  });

  router.post("/register", (req, res) => {
    void authController.register(req, res);
  });

  router.post("/refresh", (req, res) => {
    void authController.refresh(req, res);
  });

  return router;
}

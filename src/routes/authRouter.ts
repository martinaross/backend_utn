import { Router } from "express";
import AuthController from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimitMiddleware";

const authRouter = Router();

authRouter.post("/register", authLimiter, AuthController.register);
authRouter.post("/login", authLimiter, AuthController.login);

export default authRouter;

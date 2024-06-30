import { Router } from "express";
import { loginController } from "./controllers/loginController";

export const authRouter = Router()

authRouter.post('/login', loginController)
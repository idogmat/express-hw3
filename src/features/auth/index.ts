import { Router } from "express";
import { createController } from "./controllers/createController";
import { loginController } from "./controllers/loginController";

export const authRouter = Router()

authRouter.post('/sign-in', createController)
authRouter.post('/login', loginController)
authRouter.get('/users', loginController)
authRouter.post('/login', loginController)
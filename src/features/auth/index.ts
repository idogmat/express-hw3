import { Router } from "express";
import { loginController } from "./controllers/loginController";
import { confirmRegistrationController } from "./controllers/confirmRegistrationController";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/confirm-email', confirmRegistrationController)
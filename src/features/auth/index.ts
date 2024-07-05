import { Router } from "express";
import { loginController } from "./controllers/loginController";
import { confirmRegistrationController } from "./controllers/confirmRegistrationController";
import { codelValidator, resendEmailValidators, userCreateValidators } from "./middlewares/validators";
import { registrationController } from "./controllers/registrationController";
import { resendEmailController } from "./controllers/resendEmailController";
import { authMeController } from "./controllers/authMeController";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/registration', ...userCreateValidators, registrationController)
authRouter.post('/registration-confirmation', codelValidator, inputCheckErrorsMiddleware, confirmRegistrationController)
authRouter.post('/registration-email-resending', ...resendEmailValidators, resendEmailController)
authRouter.get('/me', tokenAuthorizationMiddleware, authMeController)
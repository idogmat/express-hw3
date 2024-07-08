import { Router } from "express";
import { loginController } from "./controllers/loginController";
import { confirmRegistrationController } from "./controllers/confirmRegistrationController";
import { codelValidator, resendEmailValidators, userCreateValidators } from "./middlewares/validators";
import { registrationController } from "./controllers/registrationController";
import { resendEmailController } from "./controllers/resendEmailController";
import { authMeController } from "./controllers/authMeController";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { reftershTokenController } from "./controllers/reftershTokenController";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";
import { logoutController } from "./controllers/logoutController";

export const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/logout', tokenRefreshMiddleware, logoutController)
authRouter.post('/refresh-token', tokenRefreshMiddleware, reftershTokenController)
authRouter.post('/registration', ...userCreateValidators, registrationController)
authRouter.post('/registration-confirmation', codelValidator, inputCheckErrorsMiddleware, confirmRegistrationController)
authRouter.post('/registration-email-resending', ...resendEmailValidators, resendEmailController)
authRouter.get('/me', tokenAuthorizationMiddleware, authMeController)
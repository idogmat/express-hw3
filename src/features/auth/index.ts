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
import { requestLimitGuard } from "../../global-middlewares/requestLimitGuard";

export const authRouter = Router()

authRouter.post('/login', requestLimitGuard, loginController)
authRouter.post('/logout', tokenRefreshMiddleware, logoutController)
authRouter.post('/refresh-token', tokenRefreshMiddleware, reftershTokenController)
authRouter.post('/registration', requestLimitGuard, ...userCreateValidators, registrationController)
authRouter.post('/registration-confirmation',requestLimitGuard, codelValidator, inputCheckErrorsMiddleware, confirmRegistrationController)
authRouter.post('/registration-email-resending', requestLimitGuard, ...resendEmailValidators, resendEmailController)
authRouter.get('/me', tokenAuthorizationMiddleware, authMeController)
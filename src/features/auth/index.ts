import { Router } from "express";
import {
  codelValidator,
  recoveryEmailValidators,
  resendEmailValidators,
  setNewPasswordValidators,
  userCreateValidators,
} from "./middlewares/validators";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";
import { requestLimitGuard } from "../../global-middlewares/requestLimitGuard";
import { authController } from "../composition-root";

export const authRouter = Router();

authRouter.post("/login", requestLimitGuard, authController.login.bind(authController));

authRouter.post("/logout", tokenRefreshMiddleware, authController.logout.bind(authController));

authRouter.post(
  "/refresh-token",
  tokenRefreshMiddleware,
  authController.reftershToken.bind(authController),
);

authRouter.post(
  "/registration",
  requestLimitGuard,
  ...userCreateValidators,
  authController.registration.bind(authController),
);

authRouter.post(
  "/registration-confirmation",
  requestLimitGuard,
  codelValidator,
  inputCheckErrorsMiddleware,
  authController.confirmRegistration.bind(authController),
);

authRouter.post(
  "/registration-email-resending",
  requestLimitGuard,
  ...resendEmailValidators,
  authController.resendEmail.bind(authController),
);

authRouter.get("/me", tokenAuthorizationMiddleware, authController.authMe.bind(authController));

authRouter.post(
  "/password-recovery",
  requestLimitGuard,
  ...recoveryEmailValidators,
  authController.passwordRecovery.bind(authController),
);

authRouter.post(
  "/new-password",
  requestLimitGuard,
  ...setNewPasswordValidators,
  authController.setNewPassword.bind(authController),
);

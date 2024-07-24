import { Router } from "express";
import { AuthController } from "./authController";
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

export const authRouter = Router();

authRouter.post("/login", requestLimitGuard, AuthController.login);

authRouter.post("/logout", tokenRefreshMiddleware, AuthController.logout);

authRouter.post(
  "/refresh-token",
  tokenRefreshMiddleware,
  AuthController.reftershToken,
);

authRouter.post(
  "/registration",
  requestLimitGuard,
  ...userCreateValidators,
  AuthController.registration,
);

authRouter.post(
  "/registration-confirmation",
  requestLimitGuard,
  codelValidator,
  inputCheckErrorsMiddleware,
  AuthController.confirmRegistration,
);

authRouter.post(
  "/registration-email-resending",
  requestLimitGuard,
  ...resendEmailValidators,
  AuthController.resendEmail,
);

authRouter.get("/me", tokenAuthorizationMiddleware, AuthController.authMe);

authRouter.post(
  "/password-recovery",
  requestLimitGuard,
  ...recoveryEmailValidators,
  AuthController.passwordRecovery,
);

authRouter.post(
  "/new-password",
  requestLimitGuard,
  ...setNewPasswordValidators,
  AuthController.setNewPassword,
);

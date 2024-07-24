import { Router } from "express";
import { UserController } from "./userController";
import { userCreateValidators } from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, UserController.get);
usersRouter.post(
  "/",
  adminMiddleware,
  ...userCreateValidators,
  UserController.create,
);
usersRouter.delete("/:id", adminMiddleware, UserController.delete);

import { Router } from "express";
import { userCreateValidators } from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { container } from "../composition-root";
import { UserController } from "./userController";

export const usersRouter = Router();

const userController = container.resolve(UserController);

usersRouter.get("/", adminMiddleware, userController.get.bind(userController));
usersRouter.post(
  "/",
  adminMiddleware,
  ...userCreateValidators,
  userController.create.bind(userController),
);
usersRouter.delete(
  "/:id",
  adminMiddleware,
  userController.delete.bind(userController),
);

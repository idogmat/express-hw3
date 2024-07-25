import { Router } from "express";
import { userCreateValidators } from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { userController } from "../composition-root";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, userController.get.bind(userController));
usersRouter.post(
  "/",
  adminMiddleware,
  ...userCreateValidators,
  userController.create.bind(userController),
);
usersRouter.delete("/:id", adminMiddleware, userController.delete.bind(userController));

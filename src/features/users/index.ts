import { Router } from "express";
import { createController } from "./controllers/createController";
import { getController } from "./controllers/getController";
import { userCreateValidators } from "./middlewares/validators";
import { deleteController } from "./controllers/deleteController";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, getController);
usersRouter.post(
  "/",
  adminMiddleware,
  ...userCreateValidators,
  createController,
);
usersRouter.delete("/:id", adminMiddleware, deleteController);

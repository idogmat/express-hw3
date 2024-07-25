import { Router } from "express";
import { deviceController } from "./deviceController";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";

export const devicesRouter = Router();

devicesRouter.get("/", tokenRefreshMiddleware, deviceController.getDevice);
devicesRouter.delete("/:id", tokenRefreshMiddleware, deviceController.deleteDevice);
devicesRouter.delete("/", tokenRefreshMiddleware, deviceController.deleteAllDevices);
// devicesRouter.delete('/', tokenAuthorizationMiddleware, findCommentValidator, deleteCommentController)
// devicesRouter.put('/:id', tokenAuthorizationMiddleware, commentValidators, putCommentController)

import { Router } from "express";
import { DeviceController } from "./deviceController";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";

export const devicesRouter = Router();

devicesRouter.get("/", tokenRefreshMiddleware, DeviceController.getDevice);
devicesRouter.delete("/:id", tokenRefreshMiddleware, DeviceController.deleteDevice);
devicesRouter.delete("/", tokenRefreshMiddleware, DeviceController.deleteAllDevices);
// devicesRouter.delete('/', tokenAuthorizationMiddleware, findCommentValidator, deleteCommentController)
// devicesRouter.put('/:id', tokenAuthorizationMiddleware, commentValidators, putCommentController)

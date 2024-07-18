import { Router } from "express";
import { getDeviceController } from "./controller/getDeviceController";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";
import { deleteDeviceController } from "./controller/deleteDeviceController";
import { deleteAllDevicesController } from "./controller/deleteAllDevicesController";

export const devicesRouter = Router();

devicesRouter.get("/", tokenRefreshMiddleware, getDeviceController);
devicesRouter.delete("/:id", tokenRefreshMiddleware, deleteDeviceController);
devicesRouter.delete("/", tokenRefreshMiddleware, deleteAllDevicesController);
// devicesRouter.delete('/', tokenAuthorizationMiddleware, findCommentValidator, deleteCommentController)
// devicesRouter.put('/:id', tokenAuthorizationMiddleware, commentValidators, putCommentController)

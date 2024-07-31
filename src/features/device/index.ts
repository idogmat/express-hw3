import { Router } from "express";
import { DeviceController } from "./deviceController";
import { tokenRefreshMiddleware } from "../../global-middlewares/tokenRefreshMiddleware";
import { container } from "../composition-root";

export const devicesRouter = Router();

const deviceController = container.resolve(DeviceController);

devicesRouter.get(
  "/",
  tokenRefreshMiddleware,
  deviceController.getDevice.bind(deviceController),
);
devicesRouter.delete(
  "/:id",
  tokenRefreshMiddleware,
  deviceController.deleteDevice.bind(deviceController),
);
devicesRouter.delete(
  "/",
  tokenRefreshMiddleware,
  deviceController.deleteAllDevices.bind(deviceController),
);
// devicesRouter.delete('/', tokenAuthorizationMiddleware, findCommentValidator, deleteCommentController)
// devicesRouter.put('/:id', tokenAuthorizationMiddleware, commentValidators, putCommentController)

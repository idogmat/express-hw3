import { Router } from "express";
import { fileController } from "./fileController";
import multer from "multer";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";

export const fileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

fileRouter.post(
  "/",
  // upload.single('file'),
  tokenAuthorizationMiddleware,
  upload.any(),
  fileController.load,
);

fileRouter.post(
  "/gfs",
  tokenAuthorizationMiddleware,
  upload.single('file'),
  fileController.loadGfs,
);

fileRouter.get("/", tokenAuthorizationMiddleware, fileController.get);
fileRouter.get("/gfs", tokenAuthorizationMiddleware, fileController.getGfs);

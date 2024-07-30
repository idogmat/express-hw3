import { Router } from "express";
import { fileController } from "./fileController";
import multer from "multer";



export const fileRouter = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

fileRouter.post(
  "/",
  // upload.single('file'),
  upload.any(),
  fileController.load,
);

fileRouter.get(
  "/",
  fileController.get,
);

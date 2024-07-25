import { Router } from "express";
import { commentController } from "./commentController";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";
import {
  commentValidators,
  findCommentValidator,
} from "./middlewares/validators";

export const commentsRouter = Router();

commentsRouter.get("/:id", commentController.get);
commentsRouter.delete(
  "/:id",
  tokenAuthorizationMiddleware,
  findCommentValidator,
  commentController.delete,
);
commentsRouter.put(
  "/:id",
  tokenAuthorizationMiddleware,
  commentValidators,
  commentController.update,
);

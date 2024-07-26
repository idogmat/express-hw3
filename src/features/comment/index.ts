import { Router } from "express";
import { commentController } from "./commentController";
import { tokenAuthorizationMiddleware, tokenAuthorizationWithoutThrowErrorMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";
import {
  commentValidators,
  findCommentValidator,
  statusValidators,
} from "./middlewares/validators";

export const commentsRouter = Router();

commentsRouter.get("/:id", tokenAuthorizationWithoutThrowErrorMiddleware, commentController.get);
commentsRouter.delete(
  "/:id",
  tokenAuthorizationMiddleware,
  findCommentValidator,
  commentController.delete,
);
commentsRouter.put(
  "/:id",
  tokenAuthorizationMiddleware,
  ...commentValidators,
  commentController.update,
);

commentsRouter.put(
  "/:id/like-status",
  tokenAuthorizationMiddleware,
  ...statusValidators,
  commentController.setLike,
);

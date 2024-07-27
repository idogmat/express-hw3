import { Router } from "express";
import { CommentController } from "./commentController";
import {
  tokenAuthorizationMiddleware,
  tokenAuthorizationWithoutThrowErrorMiddleware,
} from "../../global-middlewares/tokenAuthorizationMiddleware ";
import {
  commentValidators,
  findCommentValidator,
  statusValidators,
} from "./middlewares/validators";
import { container } from "../composition-root";

export const commentsRouter = Router();

const commentController = container.resolve(CommentController);

commentsRouter.get(
  "/:id",
  tokenAuthorizationWithoutThrowErrorMiddleware,
  commentController.get.bind(commentController),
);
commentsRouter.delete(
  "/:id",
  tokenAuthorizationMiddleware,
  findCommentValidator,
  commentController.delete.bind(commentController),
);
commentsRouter.put(
  "/:id",
  tokenAuthorizationMiddleware,
  ...commentValidators,
  commentController.update.bind(commentController),
);

commentsRouter.put(
  "/:id/like-status",
  tokenAuthorizationMiddleware,
  ...statusValidators,
  commentController.setLike.bind(commentController),
);

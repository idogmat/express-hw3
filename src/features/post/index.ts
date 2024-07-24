import { Router } from "express";
import { PostController } from "./postController";
import {
  commentContentValidator,
  findPostValidator,
  postCreateValidators,
  putUpdateValidators,
} from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { tokenAuthorizationMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";

export const postsRouter = Router();

postsRouter.post(
  "/",
  adminMiddleware,
  ...postCreateValidators,
  PostController.createPost,
);

postsRouter.get("/", PostController.getPosts);
postsRouter.get("/:id", findPostValidator, PostController.find);
postsRouter.delete(
  "/:id",
  adminMiddleware,
  findPostValidator,
  PostController.deletePost,
);
postsRouter.put(
  "/:id",
  adminMiddleware,
  ...putUpdateValidators,
  PostController.updatePost,
);
postsRouter.get(
  "/:id/comments",
  findPostValidator,
  PostController.getCommentsInPost,
);
postsRouter.post(
  "/:id/comments",
  tokenAuthorizationMiddleware,
  commentContentValidator,
  inputCheckErrorsMiddleware,
  findPostValidator,
  PostController.createCommentInPost,
);

import { Router } from "express";
import { postController } from "./postController";
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
  postController.createPost,
);

postsRouter.get("/", postController.getPosts);
postsRouter.get("/:id", findPostValidator, postController.find);
postsRouter.delete(
  "/:id",
  adminMiddleware,
  findPostValidator,
  postController.deletePost,
);
postsRouter.put(
  "/:id",
  adminMiddleware,
  ...putUpdateValidators,
  postController.updatePost,
);
postsRouter.get(
  "/:id/comments",
  findPostValidator,
  postController.getCommentsInPost,
);
postsRouter.post(
  "/:id/comments",
  tokenAuthorizationMiddleware,
  commentContentValidator,
  inputCheckErrorsMiddleware,
  findPostValidator,
  postController.createCommentInPost,
);

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
import {
  tokenAuthorizationMiddleware,
  tokenAuthorizationWithoutThrowErrorMiddleware,
} from "../../global-middlewares/tokenAuthorizationMiddleware ";
import { container } from "../composition-root";
import { statusValidators } from "../comment/middlewares/validators";

export const postsRouter = Router();

const postController = container.resolve(PostController);

postsRouter.post(
  "/",
  adminMiddleware,
  ...postCreateValidators,
  postController.createPost.bind(postController),
);

postsRouter.get("/", tokenAuthorizationWithoutThrowErrorMiddleware, postController.getPosts.bind(postController));
postsRouter.get(
  "/:id",
  findPostValidator,
  tokenAuthorizationWithoutThrowErrorMiddleware,
  postController.find.bind(postController),
);
postsRouter.delete(
  "/:id",
  adminMiddleware,
  findPostValidator,
  postController.deletePost.bind(postController),
);
postsRouter.put(
  "/:id",
  adminMiddleware,
  ...putUpdateValidators,
  postController.updatePost.bind(postController),
);
postsRouter.get(
  "/:id/comments",
  findPostValidator,
  tokenAuthorizationWithoutThrowErrorMiddleware,
  postController.getCommentsInPost.bind(postController),
);
postsRouter.post(
  "/:id/comments",
  tokenAuthorizationMiddleware,
  commentContentValidator,
  inputCheckErrorsMiddleware,
  findPostValidator,
  postController.createCommentInPost.bind(postController),
);

postsRouter.put(
  "/:id/like-status",
  tokenAuthorizationMiddleware,
  ...statusValidators,
  postController.setLike.bind(postController),
);

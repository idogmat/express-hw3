import { Router } from "express";
import {
  blogCreateValidators,
  blogIdParamsValidator,
} from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { postCreateValidatorsWithBlogId } from "../post/middlewares/validators";
import { BlogController } from "./blogController";
import { container } from "../composition-root";
import { tokenAuthorizationWithoutThrowErrorMiddleware } from "../../global-middlewares/tokenAuthorizationMiddleware ";

export const blogsRouter = Router();

const blogController = container.resolve(BlogController);

blogsRouter.post(
  "/",
  adminMiddleware,
  ...blogCreateValidators,
  blogController.create.bind(blogController),
);
blogsRouter.get("/", blogController.get.bind(blogController));
blogsRouter.get(
  "/:id/posts",
  tokenAuthorizationWithoutThrowErrorMiddleware,
  blogController.getPostsInBlog.bind(blogController),
);
blogsRouter.post(
  "/:id/posts",
  adminMiddleware,
  ...postCreateValidatorsWithBlogId,
  blogController.createPostInBlog.bind(blogController),
);
blogsRouter.get(
  "/:id",
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  blogController.find.bind(blogController),
);
blogsRouter.delete(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  blogController.delete.bind(blogController),
);
blogsRouter.put(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  ...blogCreateValidators,
  blogController.update.bind(blogController),
);

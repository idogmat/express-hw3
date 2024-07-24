import { Router } from "express";
import {
  blogCreateValidators,
  blogIdParamsValidator,
} from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { postCreateValidatorsWithBlogId } from "../post/middlewares/validators";
import { BlogController } from "./blogController";

export const blogsRouter = Router();

blogsRouter.post(
  "/",
  adminMiddleware,
  ...blogCreateValidators,
  BlogController.create,
);
blogsRouter.get("/", BlogController.get);
blogsRouter.get("/:id/posts", BlogController.getPostsInBlog);
blogsRouter.post(
  "/:id/posts",
  adminMiddleware,
  ...postCreateValidatorsWithBlogId,
  BlogController.createPostInBlog,
);
blogsRouter.get(
  "/:id",
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  BlogController.find,
);
blogsRouter.delete(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  BlogController.delete,
);
blogsRouter.put(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  ...blogCreateValidators,
  BlogController.update,
);

import { Router } from "express";
import {
  blogCreateValidators,
  blogIdParamsValidator,
} from "./middlewares/validators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { postCreateValidatorsWithBlogId } from "../post/middlewares/validators";
import { blogController } from "./blogController";

export const blogsRouter = Router();

blogsRouter.post(
  "/",
  adminMiddleware,
  ...blogCreateValidators,
  blogController.create,
);
blogsRouter.get("/", blogController.get);
blogsRouter.get("/:id/posts", blogController.getPostsInBlog);
blogsRouter.post(
  "/:id/posts",
  adminMiddleware,
  ...postCreateValidatorsWithBlogId,
  blogController.createPostInBlog,
);
blogsRouter.get(
  "/:id",
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  blogController.find,
);
blogsRouter.delete(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
  blogController.delete,
);
blogsRouter.put(
  "/:id",
  adminMiddleware,
  blogIdParamsValidator,
  ...blogCreateValidators,
  blogController.update,
);

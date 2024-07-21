import { Response, Request } from "express";
import {
  BlogInputModel,
  BlogViewModel,
} from "../../../input-output-types/blogs-types";
import { BlogRepository } from "../blogRepository";

export const createBlogController = async (
  req: Request<{}, {}, BlogInputModel>,
  res: Response<BlogViewModel>,
) => {
  const newBlogId = await BlogRepository.create(req.body);
  const newBlog = await BlogRepository.findAndMap(newBlogId.toString());
  newBlog ? res.status(201).json(newBlog) : res.sendStatus(400);
};

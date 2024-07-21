import { Request, Response } from "express";
import { BlogRepository } from "../blogRepository";
import { isValidObjectId } from "../../../utils/query-helper";
import {
  PostInputModel,
  PostViewModel,
} from "../../../input-output-types/posts-types";

interface IBlogId {
  id: string;
}

export const postPostsInBlogController = async (
  req: Request<IBlogId, {}, PostInputModel>,
  res: Response<PostViewModel>,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const data = await BlogRepository.postPostsInBlog(id, req.body);
  data ? res.status(201).json(data) : res.sendStatus(400);
};

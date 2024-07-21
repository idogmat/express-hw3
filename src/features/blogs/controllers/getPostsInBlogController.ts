import { Request, Response } from "express";
import { BlogRepository } from "../blogRepository";
import {
  IQuery,
  isValidObjectId,
  normolizedQuery,
} from "../../../utils/query-helper";

interface IBlogId {
  id: string;
}

export const getPostsInBlogController = async (
  req: Request<IBlogId, {}, {}, IQuery>,
  res: Response<any>,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const query = normolizedQuery(req.query);
  const data = await BlogRepository.getPostsInBlog(id, query);
  data ? res.status(200).json(data) : res.sendStatus(404);
};

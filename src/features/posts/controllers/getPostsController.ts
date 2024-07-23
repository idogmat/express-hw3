import { Request, Response } from "express";
import { normolizedQuery } from "../../../utils/query-helper";
import { IBlogWithPostsViewModelAfterQuery } from "../../../input-output-types";
import { PostRepository } from "../postRepository";

export const getPostsController = async (
  req: Request,
  res: Response<IBlogWithPostsViewModelAfterQuery>,
) => {
  const query = normolizedQuery(req.query);
  const data = await PostRepository.getAll(query);
  res.status(200).json(data);
};

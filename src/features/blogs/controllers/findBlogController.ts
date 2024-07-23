import { Request, Response } from "express";
import { BlogViewModel } from "../../../input-output-types/blog-types";
import { BlogRepository } from "../blogRepository";
import { isValidObjectId } from "../../../utils/query-helper";

export const findBlogController = async (
  req: Request<{ id: string }>,
  res: Response<BlogViewModel | {}>,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const data = await BlogRepository.find(id);
  if (data) res.status(200).json(data);
  else res.sendStatus(404);
};

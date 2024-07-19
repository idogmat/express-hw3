import { Request, Response } from "express";
import { BlogInputModel } from "../../../input-output-types/blogs-types";
import { BlogRepository } from "../blogRepository";
import { isValidObjectId } from "../../../utils/query-helper";

export const putBlogController = async (
  req: Request<{ id: string }, {}, BlogInputModel>,
  res: Response,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const result = await BlogRepository.put({ ...req.body }, id);
  // console.log(result, 'final')
  if (result) res.sendStatus(204);
  else res.sendStatus(404);
};

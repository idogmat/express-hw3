import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";
import { isValidObjectId } from "../../../utils/query-helper";

export const delBlogController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const result = await blogsRepository.del(id);
  if (result) res.sendStatus(204);
  else res.sendStatus(404);
};

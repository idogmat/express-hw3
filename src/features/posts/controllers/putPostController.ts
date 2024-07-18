import { Request, Response } from "express";
import { PostInputModel } from "../../../input-output-types/posts-types";
import { postsRepository } from "../postsRepository";
import { isValidObjectId } from "../../../utils/query-helper";

export const putPostController = async (
  req: Request<{ id: string }, any, PostInputModel>,
  res: Response,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const result = await postsRepository.put({ ...req.body }, id);
  if (result) res.sendStatus(204);
  else res.sendStatus(404);
};

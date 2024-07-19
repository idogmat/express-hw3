import { Request, Response } from "express";
import { isValidObjectId } from "../../../utils/query-helper";
import { PostRepository } from "../postRepository";

export const delPostController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = isValidObjectId(req.params.id);
  if (!id) {
    res.sendStatus(404);
    return;
  }
  const result = await PostRepository.delete(id);
  if (result) res.sendStatus(204);
  else res.sendStatus(404);
};

import { Request, Response } from "express";
import { PostViewModel } from "../../../input-output-types/posts-types";
import { Types } from "mongoose";
import { PostRepository } from "../postRepository";

export const findPostController = async (
  req: Request<{ id: string }>,
  res: Response<PostViewModel | {}>,
) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) {
    res.sendStatus(404);
    return;
  }
  const data = await PostRepository.find(id);
  if (data) res.status(200).json(data);
  else res.sendStatus(404);
};

import { Request, Response } from "express";
import { CommentViewModel } from "../../../input-output-types/comment-types";
import { Types } from "mongoose";
import { CommentRepository } from "../commentRepository";

export const getCommentController = async (
  req: Request<{ id: string }>,
  res: Response<CommentViewModel>,
) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(404);
  } else {
    const comment = await CommentRepository.find(req.params.id);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.sendStatus(404);
    }
  }
};

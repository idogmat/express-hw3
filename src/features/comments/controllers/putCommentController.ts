import { Response, Request } from "express";
import { CommentInputModel } from "../../../input-output-types/comment-types";
import { Types } from "mongoose";
import { CommentRepository } from "../commentRepository";

export const putCommentController = async (
  req: Request<{ id: string }, any, CommentInputModel>,
  res: Response,
) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(404);
  } else {
    const comment = await CommentRepository.put(
      req.params.id,
      req.userId,
      req.body.content,
    );
    if (comment === "Forbidden") {
      res.sendStatus(403);
    } else if (comment) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
};

import { Response, Request } from "express";
import { PostViewModel } from "../../../input-output-types/posts-types";
import { CommentInputModel } from "../../../input-output-types/comment-types";
import { commentsRepository } from "../commentsRepository";
import { Types } from "mongoose";

export const putCommentController = async (
  req: Request<{ id: string }, any, CommentInputModel>,
  res: Response,
) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(404);
  } else {
    const comment = await commentsRepository.put(
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

import { Response, Request } from "express";
import {
  CommentInputModel,
  CommentViewModel,
} from "../../../input-output-types/comment-types";
import { commentsRepository } from "../../comments/commentsRepository";

export const createCommentInPostController = async (
  req: Request<{ id: string }, any, CommentInputModel>,
  res: Response<CommentViewModel | unknown>,
) => {
  const newCommentId = await commentsRepository.create(
    req.body.content,
    req.params.id,
    req.userId,
  );
  if (!newCommentId) {
    res.sendStatus(400);
    return;
  }
  const newComment = await commentsRepository.find(newCommentId as any);

  res.status(201).json(newComment);
};

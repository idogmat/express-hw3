import { Response, Request } from "express";
import {
  CommentInputModel,
  CommentViewModel,
} from "../../../input-output-types/comment-types";
import { CommentRepository } from "../../comments/commentRepository";

export const createCommentInPostController = async (
  req: Request<{ id: string }, any, CommentInputModel>,
  res: Response<CommentViewModel | unknown>,
) => {
  const newCommentId = await CommentRepository.create(
    req.body.content,
    req.params.id,
    req.userId,
  );
  if (!newCommentId) {
    res.sendStatus(400);
    return;
  }
  const newComment = await CommentRepository.find(newCommentId.toString());

  res.status(201).json(newComment);
};

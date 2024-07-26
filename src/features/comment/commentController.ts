import { Request, Response } from "express";
import { Types } from "mongoose";
import { CommentRepository } from "./commentRepository";
import { CommentInputModel, CommentViewModel } from "../../input-output-types";
import { CommentLikeStatus } from "../../input-output-types/comment-types";

class CommentController {
  async delete(
    req: Request<{ id: string }>,
    res: Response,
  ) {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
    } else {
      const comment = await CommentRepository.delete(req.params.id, req.userId);
      if (comment === "Forbidden") {
        res.sendStatus(403);
      } else if (comment) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    }
  };

  async get(
    req: Request<{ id: string }>,
    res: Response<CommentViewModel>,
  ) {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
    } else {
      const comment = await CommentRepository.find(req.params.id);
      if (comment) {
        const result = CommentRepository.map(comment, req.userId)
        res.status(200).json(result);
      } else {
        res.sendStatus(404);
      }
    }
  };
  
  async update(
    req: Request<{ id: string }, any, CommentInputModel>,
    res: Response,
  ) {
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

  async setLike(req: Request<{ id: string }, any, CommentLikeStatus>,
    res: Response,
  ) {
    const id = req.userId
    const comment = await CommentRepository.find(req.params.id);
    if (comment) {
      const field = req.body.likeStatus
      const result = await CommentRepository.setLike(req.params.id, id, field)
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)

    }
  }
}

export const commentController = new CommentController();
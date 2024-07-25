import { Request, Response } from "express";
import { Types } from "mongoose";
import { CommentRepository } from "./commentRepository";
import { CommentInputModel, CommentViewModel } from "../../input-output-types";

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
        res.status(200).json(comment);
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
}

export const commentController = new CommentController();
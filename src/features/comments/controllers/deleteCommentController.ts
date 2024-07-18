import { Request, Response } from 'express'
import { CommentViewModel } from '../../../input-output-types/comment-types'
import { Types } from "mongoose";
import { commentsRepository } from '../commentsRepository'

export const deleteCommentController = async (req: Request<{id: string}>, res: Response) => {
  if(!Types.ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  } else {
    const comment = await commentsRepository.delete(req.params.id, req.userId)
    if (comment === "Forbidden") {
      res.sendStatus(403)
    } else if(comment) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }
}
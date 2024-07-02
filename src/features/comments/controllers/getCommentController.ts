import { Request, Response } from 'express'
import { normolizedQuery } from '../../../utils/query-helper'
import { IBlogWithPostsViewModelAfterQuery } from '../../../input-output-types/query-types-output'
import { CommentViewModel } from '../../../input-output-types/comment-types'
import { ObjectId } from 'mongodb'
import { commentsRepository } from '../commentsRepository'

export const getCommentController = async (req: Request<{id: string}>, res: Response<CommentViewModel>) => {
  if(!ObjectId.isValid(req.params.id)) {
    res.sendStatus(404)
  } else {
    const comment = await commentsRepository.find(req.params.id)
    if (comment) {
      res.status(200).json(comment)
    } else {
      res.sendStatus(404)
    }
  }
}
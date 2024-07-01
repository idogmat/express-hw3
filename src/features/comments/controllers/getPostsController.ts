import { Request, Response } from 'express'
import { normolizedQuery } from '../../../utils/query-helper'
import { IBlogWithPostsViewModelAfterQuery } from '../../../input-output-types/query-types-output'

export const getCommentController = async (req: Request, res: Response<IBlogWithPostsViewModelAfterQuery>) => {
  const query = normolizedQuery(req.query)
  res.status(200)
}
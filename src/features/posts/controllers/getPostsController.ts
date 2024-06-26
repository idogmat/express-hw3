import { Request, Response } from 'express'
import { postsRepository } from '../postsRepository'
import { normolizedQuery } from '../../../utils/query-helper'
import { IBlogWithPostsViewModelAfterQuery } from '../../../input-output-types/blogs-types'

export const getPostsController = async (req: Request, res: Response<IBlogWithPostsViewModelAfterQuery>) => {
  const query = normolizedQuery(req.query)
  const data = await postsRepository.getAll(query)
  res.status(200).json(data)
}
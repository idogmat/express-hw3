import { Request, Response } from 'express'
import { BlogViewModel, IBlogViewModelAfterQuery } from '../../../input-output-types/blogs-types'
import { blogsRepository } from '../blogsRepository'
import { IQuery, normolizedQuery } from '../../../utils/query-helper'


export const getBlogsController = async (req: Request<{}, {}, {}, IQuery>, res: Response<any>) => {
  const query = normolizedQuery(req.query)
  const data = await blogsRepository.getAll(query);
  res.status(200).json(data)
}
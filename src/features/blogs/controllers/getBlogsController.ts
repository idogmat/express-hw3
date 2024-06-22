import {Request, Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const getBlogsController = async (req: Request, res: Response<BlogViewModel[]>) => {
  const data = await blogsRepository.getAll();
  res.status(200).json(data as any)
}
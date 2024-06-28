import { Response, Request } from 'express'
import { BlogInputModel, BlogViewModel } from '../../../input-output-types/blogs-types'
import { blogsRepository } from '../blogsRepository'

export const createBlogController = async (req: Request<{}, {}, BlogInputModel>, res: Response<BlogViewModel>) => {
  const newBlogId = await blogsRepository.create(req.body)
  const newBlog = await blogsRepository.findAndMap(newBlogId as any)
  newBlog
    ? res.status(201).json(newBlog)
    : res.sendStatus(400)
}
import {Request, Response} from 'express'
import {BlogInputModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'

export const putBlogController = (req: Request<{id: string}, any, BlogInputModel>, res: Response) => {
  const result = blogsRepository.put({...req.body}, req.params.id);
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
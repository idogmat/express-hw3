import {Request, Response} from 'express'
import {blogsRepository} from '../blogsRepository'

export const delBlogController = async (req: Request<{id: string}>, res: Response) => {
  const result = await blogsRepository.del(req.params.id)
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
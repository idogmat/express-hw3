import {Request, Response} from 'express'
import {blogsRepository} from '../blogsRepository'
import mongoose from 'mongoose'

export const delBlogController = async (req: Request<{id: string}>, res: Response) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const result = await blogsRepository.del(id)
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
import {Request, Response} from 'express'
import {BlogInputModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import mongoose from 'mongoose'

export const putBlogController = async (req: Request<{id: string}, {}, BlogInputModel>, res: Response) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const result = await blogsRepository.put({...req.body}, id);
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
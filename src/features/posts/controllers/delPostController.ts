import {Request, Response} from 'express'
import {postsRepository} from '../postsRepository'
import mongoose from 'mongoose'

export const delPostController = async (req: Request<{id: string}>, res: Response) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const result = await postsRepository.del(id)
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
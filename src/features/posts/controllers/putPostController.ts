import {Request, Response} from 'express'
import {PostInputModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import mongoose from 'mongoose'

export const putPostController = async (req: Request<{id: string}, any, PostInputModel>, res: Response) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const result = await postsRepository.put({...req.body}, id);
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
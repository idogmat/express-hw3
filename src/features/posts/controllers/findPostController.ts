import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'
import mongoose from 'mongoose'

export const findPostController = async (req: Request<{id: string}>, res: Response<PostViewModel | {}>) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const data = await postsRepository.find(id)
  res.status(200).json(data as any)
}
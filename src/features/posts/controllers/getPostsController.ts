import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'

export const getPostsController = async (req: Request, res: Response<PostViewModel[]>) => {
  const data = await postsRepository.getAll()
  res.status(200).json(data as any)
}
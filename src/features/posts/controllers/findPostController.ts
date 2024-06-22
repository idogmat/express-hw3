import {Request, Response} from 'express'
import {PostViewModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'

export const findPostController = async (req: Request<{id: string}>, res: Response<PostViewModel | {}>) => {
  const data = await postsRepository.find(req.params.id)
  res.status(200).json(data as any)
}
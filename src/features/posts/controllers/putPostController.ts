import {Request, Response} from 'express'
import {PostInputModel} from '../../../input-output-types/posts-types'
import {postsRepository} from '../postsRepository'

export const putPostController = async (req: Request<{id: string}, any, PostInputModel>, res: Response) => {
  const result = await postsRepository.put({...req.body}, req.params.id);
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
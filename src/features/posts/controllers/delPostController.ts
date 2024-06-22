import {Request, Response} from 'express'
import {postsRepository} from '../postsRepository'

export const delPostController = async (req: Request<{id: string}>, res: Response) => {
  const result = await postsRepository.del(req.params.id)
  if (result) res.sendStatus(204)
    else res.sendStatus(404)
}
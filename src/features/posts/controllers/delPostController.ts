import {Request, Response} from 'express'
import {postsRepository} from '../postsRepository'

export const delPostController = (req: Request<{id: string}>, res: Response) => {
  if (postsRepository.del(req.params.id)) res.sendStatus(204)
    else res.sendStatus(404)
}
import { Request, Response } from 'express'
import { IQuery, isValidObjectId } from '../../../utils/query-helper'
import { UserRepository } from '../usersRepository';


export const deleteController = async (req: Request<{id: string}, {}, {}, IQuery>, res: Response<any>) => {
  const id = isValidObjectId(req.params.id)
  if (!id) {
    res.sendStatus(404)
    return
  }
  const data = await UserRepository.delete(id);
  if (data) res.sendStatus(204)
    else res.sendStatus(404)
  
}
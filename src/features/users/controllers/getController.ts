import { Request, Response } from 'express'
import { IQuery, normolizedQuery } from '../../../utils/query-helper'
import { usersRepository } from '../usersRepository';


export const getController = async (req: Request<{}, {}, {}, IQuery>, res: Response<any>) => {
  const query = normolizedQuery(req.query)
  const data = await usersRepository.getAll(query);
  res.status(200).json(data)
}
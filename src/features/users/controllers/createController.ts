import { Response, Request } from 'express'
import { usersRepository } from '../usersRepository';
import { authService } from '../../../utils/authService';
export interface ICreateUserFields {
  login: string;
  email: string;
  password: string
}

export const createController = async (req: Request<{}, {}, ICreateUserFields>, res: Response<any>) => {
  const { login, email, password } = req.body
  const user = await authService.createUser({ login, email, password })
  const result = await usersRepository.create(user)
  console.log(result)
  if (result) res.status(201).json(usersRepository.map(result))
  else res.sendStatus(400)
}
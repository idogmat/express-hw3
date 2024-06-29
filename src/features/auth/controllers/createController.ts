import { Response, Request } from 'express'
import { authService } from '../../../utils/authService';
export interface IAuthFields {
  login: string;
  email: string;
  password: string
}

export const createController = async (req: Request<{}, {}, IAuthFields>, res: Response<any>) => {
  const { login, email, password } = req.body
  const result = await authService.createUser({ login, email, password })
  if (result) res.sendStatus(200)
  else res.sendStatus(400)
}
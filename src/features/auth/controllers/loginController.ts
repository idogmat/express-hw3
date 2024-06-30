import { Response, Request } from 'express'
import { authService } from '../../../utils/authService';
export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const loginController = async (req: Request<{}, {}, ILoginFields>, res: Response<any>) => {
  const { loginOrEmail, password } = req.body
  const result = await authService.checkCredentiald(loginOrEmail, password)
  if (result) res.sendStatus(204)
  else res.sendStatus(401)
}
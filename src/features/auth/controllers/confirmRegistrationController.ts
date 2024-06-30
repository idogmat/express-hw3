import { Response, Request } from 'express'
import { authService } from '../../../utils/authService';
import { jwtService } from '../../../utils/jwtService';
export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const confirmRegistrationController = async (req: Request<{}, {}, {}>, res: Response<any>) => {


  return res.sendStatus(401)
}
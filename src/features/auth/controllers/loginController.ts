import { Response, Request } from 'express'
import { authService } from '../../../utils/authService';
import { jwtService } from '../../../utils/jwtService';
export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const loginController = async (req: Request<{}, {}, ILoginFields>, res: Response<any>) => {
  const { loginOrEmail, password } = req.body
  const { result, id } = await authService.checkCredentiald(loginOrEmail, password)
  if (!result) {
    res.sendStatus(401)
    return
  }
  const acccessToken = await jwtService.createAccessToken(id)
  const refreshToken = await jwtService.createRefreshToken(id)
  console.log(acccessToken)
  console.log(refreshToken)
  // const acccessTokenDecod = await jwtService.decodeToken(acccessToken)
  // const refreshTokenDecod = await jwtService.decodeToken(refreshToken)
  // console.log(acccessTokenDecod)
  // console.log(refreshTokenDecod)
  if (result) res.sendStatus(204)
    else res.sendStatus(401)
}
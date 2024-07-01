import { Response, Request, NextFunction } from 'express'
import { SETTINGS } from '../settings'
import { jwtService } from '../utils/jwtService'
import 'dotenv/config'
import { JwtPayload } from 'jsonwebtoken'

export const tokenAuthorizationMiddleware = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
  
  const auth = req?.headers?.['authorization'] as string
  console.log(auth)
  if (!auth) {
    res
      .status(401)
      .json({})
    return
  }
  const token = auth.split(' ')

  if (token?.length !== 2 || token[0] !== 'Bearer') {
    res
      .status(401)
      .json({})
    return
  }
  const info = await jwtService.verifyToken(token[1], 'accsess')
  if (!info) {
    res
    .status(401)
    .json({})
  return
  }
  if (info instanceof Object) {
    req.userId = info!.userId
  }
  next()
}
import { Response, Request, NextFunction } from 'express'
import { jwtService } from '../utils/jwtService'
import 'dotenv/config'

// FIXME *
export enum StatusEnum {
  SUCCESS = 'success',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized'
}



export const tokenRefreshMiddleware = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
  const refreshToken = req?.cookies?.refreshToken
  if (!refreshToken) {
    res
      .status(401)
      .json({})
    return
  }
  const info = await jwtService.verifyToken(refreshToken, 'refresh')
  console.log(info)
  if (!info) {
    res
    .status(401)
    .json({})
  return
  }


  if (info instanceof Object) {
    if (info?.exp && info?.exp*1000 >= Date.now()) {
      req.userId = info.userId
    } else {
      res
      .status(401)
      .json({})
    return
    }
    
  }
  next()
}
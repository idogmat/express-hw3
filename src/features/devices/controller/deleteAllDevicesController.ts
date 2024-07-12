import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { deviceCollection } from '../../../app'
import { jwtService } from '../../../utils/jwtService'
import { devicesRepository } from '../devicesRepository'
import { JwtPayload } from 'jsonwebtoken'

export const deleteAllDevicesController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  console.log(refreshToken)
  const decoded = await jwtService.decodeToken(refreshToken)
  if (!decoded) return res.sendStatus(401)
  const deleted = await devicesRepository.deleteAllSessions((decoded as JwtPayload).browser)
  return res.sendStatus(204)
}
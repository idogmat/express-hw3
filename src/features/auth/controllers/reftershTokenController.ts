import { Response, Request } from 'express'
import { jwtService } from '../../../utils/jwtService';
import { deviceCollection, userCollection } from '../../../app';
import { ObjectId } from 'mongodb';
import { devicesRepository } from '../../devices/devicesRepository';

export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const reftershTokenController = async (req: Request<{}, {}, {}>, res: Response<any>): Promise<any> => {
  const id = req.userId
  const oldRefreshToken = req.cookies.refreshToken
  const browser = req.get('user-agent');
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if (ObjectId.isValid(id)) {
    const session = await deviceCollection.findOne({refreshToken: oldRefreshToken})
    console.log(session)
    if (!session) return res.sendStatus(401)
    const accessToken = await jwtService.createAccessToken(id)
    const refreshToken = await jwtService.createRefreshToken(id, browser, session.deviceId.toString())
    const result = await devicesRepository.update(session._id, refreshToken)
    console.log(result)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    res.status(200).json({accessToken})
  } else {
    res.sendStatus(401)
  }
}
import { Response, Request } from 'express'
import { authService } from '../../../utils/authService';
import { jwtService } from '../../../utils/jwtService';
import { deviceCollection, userCollection } from '../../../app';
import { ObjectId, WithoutId } from 'mongodb';
import { DeviceInputModel } from '../../../input-output-types/device-types';
import { devicesRepository } from '../../devices/devicesRepository';

export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const loginController = async (req: Request<{}, {}, ILoginFields>, res: Response<any>): Promise<any> => {
  if (!req.body.password || !req.body.loginOrEmail) return res.sendStatus(400);
  const loginOrEmail = req.body.loginOrEmail;
  const browser = req.get('user-agent');
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const password = req.body.password;
  const { result, id } = await authService.checkCredential(loginOrEmail, password)
  if (!result) {
    res.sendStatus(401)
    return
  }
  const accessToken = await jwtService.createAccessToken(id)
  const refreshToken = await jwtService.createRefreshToken(id, browser)
  const session = await deviceCollection.findOne({ userId: id, title: browser, ip: ip?.toString() })
  if (session) {
    await devicesRepository.update(session._id, refreshToken)
  } else {
    const device = {
      title: browser || '',
      userId: id,
      ip: ip?.toString() || '',
      deviceId: new ObjectId(),
      lastActiveDate: new Date(),
      refreshToken,
    }
    const resi = await devicesRepository.create(device)
    console.log(resi)
  }
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  if (result) res.status(200).json({ accessToken })
  else res.sendStatus(401)
}
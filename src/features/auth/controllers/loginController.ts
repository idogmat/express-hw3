import { Response, Request } from 'express'
import { AuthService } from '../../../services/auth.service';
import { JwtService } from '../../../services/jwt.service';
import { deviceCollection } from '../../../app';
import mongoose, { ObjectId } from "mongoose";
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
  const { result, id } = await AuthService.checkCredential(loginOrEmail, password)
  if (!result) {
    res.sendStatus(401)
    return
  }
  const accessToken = await JwtService.createAccessToken(id)
  const session = await deviceCollection.findOne({ userId: id, title: browser, ip: ip?.toString() })
  if (session) {
    const refreshToken = await JwtService.createRefreshToken(id, browser, session.deviceId.toString())
    await devicesRepository.update(session._id.toHexString(), refreshToken)
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  } else {
    const deviceId = new mongoose.Types.ObjectId().toString();
    const refreshToken = await JwtService.createRefreshToken(id, browser, deviceId.toString())
    const device = {
      title: browser || '',
      userId: id,
      ip: ip?.toString() || '',
      deviceId,
      lastActiveDate: (new Date()).toISOString(),
      refreshToken,
    }
    const resi = await devicesRepository.create(device)
    console.log(resi)
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  }
  if (result) res.status(200).json({ accessToken })
  else res.sendStatus(401)
}
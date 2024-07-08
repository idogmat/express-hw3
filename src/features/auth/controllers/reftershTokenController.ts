import { Response, Request } from 'express'
import { jwtService } from '../../../utils/jwtService';
import { userCollection } from '../../../app';
import { ObjectId } from 'mongodb';

export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const reftershTokenController = async (req: Request<{}, {}, {}>, res: Response<any>): Promise<any> => {
  const id = req.userId
  const oldRefreshToken = req.cookies.refreshToken
  if (ObjectId.isValid(id)) {
    const foundToken = await userCollection.findOne({_id: new ObjectId(id), refreshToken: oldRefreshToken})
  if (!foundToken) return res.sendStatus(401)
  const accessToken = await jwtService.createAccessToken(id)
  const refreshToken = await jwtService.createRefreshToken(id)
  const result = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: { refreshToken }},
    {returnDocument: 'after'}
  )
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    res.status(200).json({accessToken})
  } else {
    res.sendStatus(401)
  }
}
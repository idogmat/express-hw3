import { Response, Request } from 'express'
import { userCollection } from '../../../app';
import { ObjectId } from 'mongodb';

export interface ILoginFields {
  loginOrEmail: string;
  password: string
}

export const logoutController = async (req: Request<{}, {}, ILoginFields>, res: Response<any>): Promise<any> => {
  const id = req.userId
  const oldRefreshToken = req.cookies.refreshToken
  if (ObjectId.isValid(id)) {
    const foundToken = await userCollection.findOne({_id: new ObjectId(id), refreshToken: oldRefreshToken})
  if (!foundToken) return res.sendStatus(401)
    const result = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: { refreshToken: '' }},
      {returnDocument: 'after'}
    )
    res.clearCookie('refreshToken', {httpOnly: true, secure: true})
    res.status(204).json({})
  } else {
    res.sendStatus(401)
  }
}
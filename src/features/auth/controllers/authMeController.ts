import { Response, Request } from 'express'
import { userCollection } from '../../../app';
import { ObjectId } from 'mongodb';
import { usersRepository } from '../../users/usersRepository';

export const authMeController = async (req: Request<{}, {}>, res: Response<any>) => {
  const user = await userCollection.findOne({_id: new ObjectId(req.userId)});
  if (user) return res.status(200).json(usersRepository.authMap(user))
    else return res.sendStatus(401)
}
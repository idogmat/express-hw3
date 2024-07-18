import { Response, Request } from 'express'
import { userCollection } from '../../../app';
import { ObjectId, Types } from "mongoose";
import { UserRepository} from '../../users/usersRepository';

export const authMeController = async (req: Request<{}, {}>, res: Response<any>) => {
  const user = await userCollection.findOne({_id: new Types.ObjectId(req.userId)});
  if (user) return res.status(200).json(UserRepository.authMap(user))
    else return res.sendStatus(401)
}
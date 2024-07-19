import { Response, Request } from "express";
import { Types } from "mongoose";
import { UserRepository } from "../../users/userRepository";
import { userCollection } from "../../../db/db";

export const authMeController = async (
  req: Request<{}, {}>,
  res: Response<any>,
) => {
  const user = await userCollection.findOne({
    _id: new Types.ObjectId(req.userId),
  });
  if (user) return res.status(200).json(UserRepository.authMap(user));
  else return res.sendStatus(401);
};

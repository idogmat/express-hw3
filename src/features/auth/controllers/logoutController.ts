import { Response, Request } from "express";
import { deviceCollection, userCollection } from "../../../app";
import { Types } from "mongoose";

export interface ILoginFields {
  loginOrEmail: string;
  password: string;
}

export const logoutController = async (
  req: Request<{}, {}, ILoginFields>,
  res: Response<any>,
): Promise<any> => {
  const id = req.userId;
  const oldRefreshToken = req.cookies.refreshToken;
  if (Types.ObjectId.isValid(id)) {
    const foundToken = await deviceCollection.findOne({
      refreshToken: oldRefreshToken,
    });
    if (!foundToken) return res.sendStatus(401);
    const result = await deviceCollection.deleteOne({ _id: foundToken._id });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.status(204).json({});
  } else {
    res.sendStatus(401);
  }
};

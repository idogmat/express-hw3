import { Response, Request } from "express";
import { JwtService } from "../../../services/jwt.service";
import { deviceCollection, userCollection } from "../../../app";
import { Types } from "mongoose";
import { devicesRepository } from "../../devices/devicesRepository";

export interface ILoginFields {
  loginOrEmail: string;
  password: string;
}

export const reftershTokenController = async (
  req: Request<{}, {}, {}>,
  res: Response<any>,
): Promise<any> => {
  const id = req.userId;
  const oldRefreshToken = req.cookies.refreshToken;
  const browser = req.get("user-agent");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (Types.ObjectId.isValid(id)) {
    const session = await deviceCollection.findOne({
      refreshToken: oldRefreshToken,
    });
    console.log(session);
    if (!session) return res.sendStatus(401);
    const accessToken = await JwtService.createAccessToken(id);
    const refreshToken = await JwtService.createRefreshToken(
      id,
      browser,
      session.deviceId.toString(),
    );
    const result = await devicesRepository.update(
      session._id.toString(),
      refreshToken,
    );
    console.log(result);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

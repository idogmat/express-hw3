import { Request, Response } from "express";
import { JwtService } from "../../../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";
import { DevicesRepository } from "../devicesRepository";

export const deleteAllDevicesController = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  const decoded = await JwtService.verifyToken(refreshToken, "refresh");
  if (!decoded) return res.sendStatus(401);
  const deleted = await DevicesRepository.deleteAllSessions(
    (decoded as JwtPayload).deviceId,
  );
  return res.sendStatus(204);
};

import { Request, Response } from "express";
import { JwtService } from "../../../services/jwt.service";
import { devicesRepository } from "../devicesRepository";
import { JwtPayload } from "jsonwebtoken";

export const deleteAllDevicesController = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  const decoded = await JwtService.verifyToken(refreshToken, "refresh");
  if (!decoded) return res.sendStatus(401);
  const deleted = await devicesRepository.deleteAllSessions(
    (decoded as JwtPayload).deviceId,
  );
  return res.sendStatus(204);
};

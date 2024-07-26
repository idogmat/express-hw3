import { Request, Response } from "express";
import { DeviceQueryRepository } from "./deviceQueryRepository";
import { DeviceRepository } from "./deviceRepository";
import { Types } from "mongoose";
import { JwtService } from "../../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";

class DeviceController {
  async getDevice(req: Request, res: Response) {
    const userSessions = await DeviceQueryRepository.get(req.userId);
    res.status(200).json(userSessions);
  };
  
  async deleteDevice(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response | void> {
    if (!Types.ObjectId.isValid(req.params.id)) return res.sendStatus(404);
    const userSessions = await DeviceRepository.findSession(req.params.id);
    console.log(userSessions, "userSessions");
    if (!userSessions) return res.sendStatus(404);
    if (userSessions.userId.toString() !== req.userId) return res.sendStatus(403);
    const deleted = await DeviceRepository.deleteSession(
      userSessions._id.toString(),
    );
    console.log(deleted, "deleted");
    res.sendStatus(204);
  };

  async deleteAllDevices(
    req: Request,
    res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    const decoded = await JwtService.verifyToken(refreshToken, "refresh");
    if (!decoded) return res.sendStatus(401);
    const deleted = await DeviceRepository.deleteAllSessions(
      (decoded as JwtPayload).deviceId,
    );
    return res.sendStatus(204);
  };
}

export const deviceController = new DeviceController();
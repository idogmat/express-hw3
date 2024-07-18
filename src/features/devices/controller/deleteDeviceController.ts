import { Request, Response } from "express";
import { Types } from "mongoose";
import { devicesRepository } from "../devicesRepository";

interface IDevice {
  id: string;
}

export const deleteDeviceController = async (
  req: Request<IDevice>,
  res: Response,
): Promise<Response | void> => {
  console.log(req.params.id);
  if (!Types.ObjectId.isValid(req.params.id)) return res.sendStatus(404);
  const userSessions = await devicesRepository.findSession(req.params.id);
  console.log(userSessions, "userSessions");
  if (!userSessions) return res.sendStatus(404);
  if (userSessions.userId.toString() !== req.userId) return res.sendStatus(403);
  const deleted = await devicesRepository.deleteSession(
    userSessions._id.toString(),
  );
  console.log(deleted, "deleted");
  res.sendStatus(204);
};

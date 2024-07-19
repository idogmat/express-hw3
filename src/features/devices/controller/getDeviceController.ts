import { Request, Response } from "express";
import { DevicesQueryRepository } from "../devicesQueryRepository";

export const getDeviceController = async (req: Request, res: Response) => {
  const userSessions = await DevicesQueryRepository.get(req.userId);
  console.log(userSessions, "userSessions");
  res.status(200).json(userSessions);
};

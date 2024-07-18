import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { deviceCollection } from "../../../app";
import { devicesQueryRepository } from "../devicesQueryRepository";

export const getDeviceController = async (req: Request, res: Response) => {
  const userSessions = await devicesQueryRepository.get(req.userId);
  console.log(userSessions, "userSessions");
  res.status(200).json(userSessions);
};

import { ObjectId } from "mongoose";

export type DeviceInputModel = {
  userId: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: ObjectId;
  refreshToken: string;
};

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

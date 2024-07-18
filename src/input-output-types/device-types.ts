import { ObjectId } from "mongodb"

export type DeviceInputModel = {
  userId: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: ObjectId;
  refreshToken: string;
}

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
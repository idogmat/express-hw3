import { ObjectId } from "mongodb"
import { CommentatorInfoType } from "../db/db";

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
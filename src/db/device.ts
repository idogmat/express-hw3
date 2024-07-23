import mongoose, { Model, ObjectId } from "mongoose";

export type DeviceTypeDB = {
  _id: ObjectId;
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  refreshToken: string;
};

// device
export const DeviceSchema = new mongoose.Schema<
  DeviceTypeDB,
  Model<DeviceTypeDB>
>({
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  deviceId: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

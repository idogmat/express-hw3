import { deviceCollection } from "../../app";
import { DeviceTypeDB, DeviceTypeDBWithoutId } from "../../db/db";
import { Types, ObjectId } from "mongoose";
import { DeviceViewModel } from "../../input-output-types/device-types";

export const devicesRepository = {
  async create(device: DeviceTypeDBWithoutId) {
    const result = await deviceCollection.insertOne(device as DeviceTypeDB);
    return result.insertedId;
  },
  async update(id: string, refreshToken: string) {
    const result = await deviceCollection.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: { refreshToken, lastActiveDate: new Date().toISOString() } },
      { returnDocument: "after" },
    );
    return result?.refreshToken === refreshToken;
  },
  async findSession(deviceId: string) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({
      deviceId: deviceId,
    });
    return device;
  },
  async deleteSession(id: string) {
    const device = await deviceCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return device?.deletedCount;
  },
  async deleteAllSessions(id: string) {
    const device = await deviceCollection.deleteMany({ deviceId: { $ne: id } });
    return device?.deletedCount;
  },
};

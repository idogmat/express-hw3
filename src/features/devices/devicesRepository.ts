import { deviceCollection } from "../../app";
import { DeviceTypeDB, DeviceTypeDBWithoutId } from "../../db/db";
import { ObjectId } from 'mongodb';
import { DeviceViewModel } from "../../input-output-types/device-types";

export const devicesRepository = {
  async create(device: DeviceTypeDBWithoutId) {
    const result = await deviceCollection.insertOne(device as DeviceTypeDB);
    return result.insertedId;
  },
  async update(id: ObjectId, refreshToken: string) {
    const result = await deviceCollection.findOneAndUpdate(
      {_id: id},
      {$set: {refreshToken, lastActiveDate: (new Date()).toISOString()}},
      { returnDocument: "after"}
    )
    return result?.refreshToken === refreshToken;
  },
  async findSession(deviceId: string | ObjectId) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({ deviceId: new ObjectId(deviceId) })
    return device
  },
  async deleteSession(id: ObjectId) {
    const device = await deviceCollection.deleteOne({ _id: id });
    return device?.deletedCount
  },
  async deleteAllSessions(id: string,) {
    const device = await deviceCollection.deleteMany({ deviceId: {$ne: new ObjectId(id)} });
    return device?.deletedCount
  },
}
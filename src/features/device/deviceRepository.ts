import "reflect-metadata";
import { WithoutId } from "mongodb";
import { deviceCollection, DeviceTypeDB } from "../../db";
import { Types } from "mongoose";

export class DeviceRepository {
  static async create(device: WithoutId<DeviceTypeDB>) {
    const model = await new deviceCollection(device);
    const result = await model.save();
    return result._id;
  }

  static async update(id: string, refreshToken: string) {
    const result = await deviceCollection.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: { refreshToken, lastActiveDate: new Date().toISOString() } },
      { returnDocument: "after" },
    );
    return result?.refreshToken === refreshToken;
  }

  static async findSession(deviceId: string) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({
      deviceId: deviceId,
    });
    return device;
  }

  static async deleteSession(id: string) {
    const device = await deviceCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return device?.deletedCount;
  }

  static async deleteAllSessions(id: string) {
    const device = await deviceCollection.deleteMany({ deviceId: { $ne: id } });
    return device?.deletedCount;
  }
}

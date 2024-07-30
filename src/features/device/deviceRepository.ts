import "reflect-metadata";
import { deviceCollection, DeviceTypeDB } from "../../db";
import { Types } from "mongoose";
import { injectable } from "inversify";


@injectable()
export class DeviceRepository {
  async create(device: Omit<DeviceTypeDB, '_id'>) {
    const model = await new deviceCollection(device);
    const result = await model.save();
    return result._id;
  }

  async update(id: string, refreshToken: string) {
    const result = await deviceCollection.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: { refreshToken, lastActiveDate: new Date().toISOString() } },
      { returnDocument: "after" },
    );
    return result?.refreshToken === refreshToken;
  }

  async findSession(deviceId: string) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({
      deviceId: deviceId,
    });
    return device;
  }

  async deleteSession(id: string) {
    const device = await deviceCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return device?.deletedCount;
  }

  async deleteAllSessions(id: string) {
    const device = await deviceCollection.deleteMany({ deviceId: { $ne: id } });
    return device?.deletedCount;
  }
}

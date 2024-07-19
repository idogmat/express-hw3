import { deviceCollection, DeviceTypeDB } from "../../db/db";
import { Types } from "mongoose";
import { DeviceViewModel } from "../../input-output-types/device-types";

export class DevicesQueryRepository {
  static async get(userId: string): Promise<DeviceViewModel[]> {
    const devices = await deviceCollection.find<DeviceTypeDB>({ userId });
    return devices.map((d) => this.map(d));
  }

  static async find(id: string) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({
      _id: new Types.ObjectId(id),
    });
    if (device?._id) {
      return this.map(device);
    } else {
      return false;
    }
  }

  static map(device: DeviceTypeDB): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId.toString(),
    };
  }
}

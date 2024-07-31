import { deviceCollection, DeviceTypeDB } from "../../db";
import { Types } from "mongoose";
import { DeviceViewModel } from "../../input-output-types";
import { injectable } from "inversify";

@injectable()
export class DeviceQueryRepository {
  async get(userId: string): Promise<DeviceViewModel[]> {
    const devices = await deviceCollection.find<DeviceTypeDB>({ userId });
    return devices.map((d) => this.map(d));
  }

  async find(id: string) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({
      _id: new Types.ObjectId(id),
    });
    if (device?._id) {
      return this.map(device);
    } else {
      return false;
    }
  }

  map(device: DeviceTypeDB): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId.toString(),
    };
  }
}

import { deviceCollection } from "../../app";
import { DeviceTypeDB } from "../../db/db";
import { ObjectId } from 'mongodb';
import { DeviceViewModel } from "../../input-output-types/device-types";

export const devicesQueryRepository = {
  async get(userId: string): Promise<DeviceViewModel[]> {
    const devices = await deviceCollection.find<DeviceTypeDB>({ userId }).toArray()    
    return devices.map(d => this.map(d));
  },
  async find(id: string | ObjectId) {
    const device = await deviceCollection.findOne<DeviceTypeDB>({ _id: new ObjectId(id) })
    if (device?._id) {
      return this.map(device)
    } else {
      return false
    }
  },
  map(device: DeviceTypeDB): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId.toString(),
    }
  }
}
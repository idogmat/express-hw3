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
      {$set: {refreshToken, lastActiveDate: new Date()}},
      { returnDocument: "after"}
    )
    return result?.refreshToken === refreshToken;
  } 
}
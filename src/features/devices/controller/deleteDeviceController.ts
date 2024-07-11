import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { deviceCollection } from '../../../app'

export const deleteDeviceController = async (req: Request, res: Response) => {
  const userSessions = await deviceCollection.find({userId: req.userId}).toArray();
  console.log(userSessions)
  res.status(200).json(userSessions)
}
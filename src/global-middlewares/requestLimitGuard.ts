import { NextFunction, Request, Response } from "express";
import { logCollection } from "../app";
import { Types, ObjectId } from "mongoose";


export const requestLimitGuard = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const _id = new Types.ObjectId(req.logId)
  const request = await logCollection.findOne({ _id });

  console.log(request)
  if (request && request.count > 5 && new Date(request.date) >= new Date(Date.now() - 10000)) {
    return res.sendStatus(429)
  }
  next()
}
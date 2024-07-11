import { NextFunction, Request, Response } from "express";
import { logCollection } from "../app";
import { ObjectId } from "mongodb";


export const requestLimitGuard = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const _id = new ObjectId(req.logId)
  const request = await logCollection.findOne({ _id });

  console.log(request)
  if (request && request.count >= 5 && new Date(request.date) >= new Date(Date.now() - 10000)) {
    return res.sendStatus(429)
  }

  // if (request && new Date(request.date) >= new Date(Date.now() - 10000)) {
  //   await logCollection.findOneAndUpdate({
  //     IP: (ip || '').toString(),
  //     URL: req.baseUrl || req.originalUrl,
  //   }, { $inc: { count: 1 } })
  // }
  // await logCollection.deleteMany({
  //   IP: (ip || '').toString(),
  //   URL: req.baseUrl || req.originalUrl,
  // })

  next()
}
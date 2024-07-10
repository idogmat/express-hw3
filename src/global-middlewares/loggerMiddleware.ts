import { NextFunction, Request, Response } from "express";
import { logCollection } from "../app";

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  // await logCollection.insertOne()
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const browser = req.get("user-agent")
  const request = await logCollection.findOne({ IP: (ip || '').toString(), URL: req.baseUrl || req.originalUrl })
  let logId = ''
  if (request && new Date(request.date) >= new Date(Date.now() - 10000)) {
    await logCollection.findOneAndUpdate({ _id: request._id },
      {
        $inc: { count: 1 },
        // $set: { date: new Date(new Date()) }
      })
    logId = request._id.toString()
  } else if (request && new Date(request.date) < new Date(Date.now() - 10000)){
    await logCollection.findOneAndUpdate({ _id: request._id },
      {
        $set: { count: 1, date: new Date(new Date()) },
      })
    logId = request._id.toString()
  } else {
    const request = await logCollection.insertOne({
      IP: (ip || '').toString(),
      URL: req.baseUrl || req.originalUrl,
      date: new Date(new Date()),
      count: 1,
    })
    logId = request.insertedId.toString()
  }
  req.logId = logId
  next()
}
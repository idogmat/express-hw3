import "reflect-metadata";
import { Request, Response } from "express";
import { fileCollection } from "../../db";

export class FileController {
  async load(req: Request, res: Response<any>): Promise<any> {
    const files = req.files;
    console.log(files);
    if (Array.isArray(files) && files?.[0]) {
      const result = await fileCollection.findOne({ userId: req.userId });
      if (result) {
        await fileCollection.findByIdAndUpdate(result._id, {
          ...files[0],
          userId: req.userId,
        });
      } else {
        await fileCollection.create({ ...files[0], userId: req.userId });
      }
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  }

  async get(req: Request, res: Response<any>): Promise<any> {
    const result = await fileCollection.findOne({ userId: req.userId });
    if (result && result.buffer) {
      res.set({
        "Content-Type": "image/png", // Указываем тип содержимого
        "Content-Disposition": `attachment; filename="${result.originalname}"`, // Указываем, что это файл для скачивания
      });
      res.send(result.buffer as any);
    } else {
      res.sendStatus(200);
    }
  }
}

export const fileController = new FileController();

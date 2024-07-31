import "reflect-metadata";
import { Request, Response } from "express";
import { fileCollection } from "../../db";
import { gfs } from "../../app";

export class FileController {
  async load(req: Request, res: Response<any>): Promise<any> {
    const files = req.files;
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
        "Content-Type": result.mimetype, // Указываем тип содержимого
        "Content-Disposition": `attachment; filename="${result.originalname}"`, // Указываем, что это файл для скачивания
      });
      res.send(result.buffer as any);
    } else {
      res.sendStatus(200);
    }
  }

  async loadGfs(req: Request, res: Response<any>): Promise<any> {
    const result = req.file;
    console.log(result);
    if (result && gfs) {
      const uploadStream = gfs.openUploadStream(result.originalname, {
        contentType: result.mimetype,
        metadata: {
          userId: req.userId
        }
      });
      try {
        const end = await uploadStream.end(result?.buffer);
      } catch (error) {
         res.sendStatus(403);
      }
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  }

  async getGfs(req: Request, res: Response<any>): Promise<any> {
    let file = null;
    const cursor = await gfs?.find({})
    for await (const doc of cursor!) {
      if (doc?.metadata?.userId === req.userId) {
        file = doc
      }
   }
    if (file && file._id) {
      const ready = await gfs?.openDownloadStream(file._id)
      ready!.on('error', (err: any) => {
        return res.status(404).json({ message: 'Файл не найден', error: err });
      });
      return ready!.pipe(res); // Передаем данные файла в ответ
    } else {
      res.sendStatus(200);
    }
  }
}


export const fileController = new FileController();

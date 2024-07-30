import "reflect-metadata";
import { Request, Response } from "express";
import { fileCollection } from "../../db";


export class FileController {
  async load(
    req: Request,
    res: Response<any>,
  ): Promise<any> {
    const files = req.files
    console.log(files)
    if (Array.isArray(files) && files?.[0]) {
      await fileCollection.create(files[0])
      res.set({
        'Content-Type': 'image/png', // Указываем тип содержимого
        'Content-Disposition': `attachment; filename="${files[0].fieldname}"`, // Указываем, что это файл для скачивания
      });
    
      // Отправляем содержимое файла
      // const result = await fileCollection.find()
      // console.log(result)
      return res.send(files[0].buffer as any);
    }
    console.log(req.files)
    res.sendStatus(200)
  }

  async get(
    req: Request,
    res: Response<any>,
  ): Promise<any> {
    const result = await fileCollection.find()
    // console.log(files)
    if (Array.isArray(result) && result?.[0]) {
      res.set({
        'Content-Type': 'image/png', // Указываем тип содержимого
        'Content-Disposition': `attachment; filename="${result[0].originalname}"`, // Указываем, что это файл для скачивания
      });
    
      // Отправляем содержимое файла
      return res.send(result[0].buffer as any);
    }
    res.sendStatus(200)
  }
}

export const fileController = new FileController()

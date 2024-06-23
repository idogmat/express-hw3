import {Request, Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import mongoose from 'mongoose'

export const findBlogController = async (req: Request<{id: string}>, res: Response<BlogViewModel | {}>) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
    const data = await blogsRepository.find(id)
      res.status(200).json(data);

}
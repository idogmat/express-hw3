import {Request, Response} from 'express'
import {BlogViewModel} from '../../../input-output-types/blogs-types'
import {blogsRepository} from '../blogsRepository'
import mongoose from 'mongoose'
import { isValidObjectId } from '../../../utils/query-helper'

export const findBlogController = async (req: Request<{id: string}>, res: Response<BlogViewModel | {}>) => {
  const id = isValidObjectId(req.params.id)
  if (!id) {
    res.sendStatus(404)
    return
  }
    const data = await blogsRepository.find(id)
    if (data) res.status(200).json(data)
      else res.sendStatus(404)

}
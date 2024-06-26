import { Request, Response } from 'express'
import { BlogViewModel, IBlogViewModelAfterQuery, IBlogWithPostsViewModelAfterQuery } from '../../../input-output-types/blogs-types'
import { blogsRepository } from '../blogsRepository'
import { IQuery, isValidObjectId, normolizedQuery } from '../../../utils/query-helper'
import mongoose from 'mongoose'

interface IBlogId {
  id: mongoose.Types.ObjectId | string
}

export const getPostsInBlogController = async (req: Request<IBlogId, {}, {}, IQuery>, res: Response<IBlogWithPostsViewModelAfterQuery>) => {
  const id = isValidObjectId(req.params.id)
  if (!id) {
    res.sendStatus(404)
    return
  }
  const query = normolizedQuery(req.query)
  console.log(query)
  const data = await blogsRepository.getPostsInBlog(id, query);
  data 
  ? res.status(200).json(data) 
  : res.sendStatus(404)
}
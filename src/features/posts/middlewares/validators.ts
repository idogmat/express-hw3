import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { PostInputModel } from '../../../input-output-types/posts-types'
import { blogCollection, postCollection } from '../../../db/db'

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid


// --POSTS
export const titleValidator = body('title').isString().withMessage('not string')
  .trim().isLength({ min: 1, max: 30 }).withMessage('more then 30 or 0')

export const shortDescriptionValidator = body('shortDescription').isString().withMessage('not string')
  .trim().isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0')

export const contentValidator = body('content').isString().withMessage('not string')
  .trim().isLength({ min: 1, max: 1000 }).withMessage('more then 1000 or 0')

export const blogIdValidator = body('blogId').isString().trim().withMessage('not string').isLength({ min: 1, max: 500 }).withMessage('no blog').custom( async value => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return Promise.reject('blog not found');
  }
  const id = new mongoose.Types.ObjectId(value)
  const blog = await blogCollection.findById(id)
  if (!blog?._id) {
    return Promise.reject('blog not found');
  }
  return true
})

export const findPostValidator = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({})
    return;
  }
  const id = new mongoose.Types.ObjectId(req.params.id)
  const post = await postCollection.findById(id)
  if (!post) {
    res
      .status(404)
      .json({})
    return;
  }

  next()
}


export const postCreateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputCheckErrorsMiddleware,
]

export const putUpdateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  findPostValidator,
  inputCheckErrorsMiddleware,
]
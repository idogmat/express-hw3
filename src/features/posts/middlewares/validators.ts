import {body} from 'express-validator'
import {inputCheckErrorsMiddleware} from '../../../global-middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Request, Response} from 'express'
import { blogCollection, postCollection } from '../../../app'
import mongoose from 'mongoose'
import { PostInputModel } from '../../../input-output-types/posts-types'

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid


// --POSTS
export const titleValidator = body('title').isString().withMessage('not string')
.trim().isLength({min: 1, max: 30}).withMessage('more then 30 or 0')

export const shortDescriptionValidator = body('shortDescription').isString().withMessage('not string')
.trim().isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const contentValidator = body('content').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0')

export const blogIdValidator = body('blogId').isString().trim().withMessage('not string').isLength({min: 1, max: 500}).withMessage('no blog')

export const blogIdCheckIncludes = async (req: Request<PostInputModel>, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.blogId)) {
    res
      .status(404)
      .json({})
    return;
  }  
  const blog = await blogCollection.findById(req.body.blogId)
    if (!blog) {

        res
            .status(404)
            .json({})
        return
    }
    
    next()
  }

export const findPostValidator = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({})
    return;
  }  
  const post = await postCollection.findById(req.params.id)
    if (!post) {

        res
            .status(404)
            .json({})
        return
    }

    next()
}


export const postCreateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputCheckErrorsMiddleware,
  blogIdCheckIncludes,
]

export const putUpdateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputCheckErrorsMiddleware,
]
import {body} from 'express-validator'
import {inputCheckErrorsMiddleware} from '../../../global-middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Request, Response} from 'express'
import { blogCollection } from '../../../app'
import mongoose from 'mongoose'

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

// --BLOGS

export const nameValidator = body('name').isString().withMessage('not string')
.trim().isLength({min: 1, max: 15}).withMessage('more then 15 or 0')

export const descriptionValidator = body('description').isString().withMessage('not string')
.trim().isLength({min: 1, max: 500}).withMessage('more then 500 or 0')

export const websiteUrlValidator = body('websiteUrl').isString().withMessage('not string')
.trim().isLength({min: 1, max: 100}).custom(url => {
const regex = /^(http|https):\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  return regex.test(url);
}).withMessage('not valid websiteUrl')

export const findBlogValidator = (req: Request<{id: string}>, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({})
    return;
  }
  const blog = blogCollection.findById(req.params.id)
  if (!blog) {
    res
      .status(404)
      .json({})
    return;
  }

  next()
}


export const blogCreateValidators = [
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    inputCheckErrorsMiddleware,
]
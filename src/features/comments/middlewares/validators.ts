import { body, param } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import { blogCollection } from '../../../app'
import { ObjectId } from 'mongodb'


// --COMMENTS

export const contentValidator = body('content').isString().withMessage('not string')
  .trim().isLength({ min: 20, max: 300 }).withMessage('more then 300 or less then 20')


export const blogCreateValidators = [
  contentValidator,
  inputCheckErrorsMiddleware,
]
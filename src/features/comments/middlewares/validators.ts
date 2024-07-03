import { body, param } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import { blogCollection, commentCollection } from '../../../app'
import { ObjectId } from 'mongodb'
import { NextFunction, Request, Response } from 'express'


// --COMMENTS

export const contentValidator = body('content').isString().withMessage('not string')
  .trim().isLength({ min: 20, max: 300 }).withMessage('more then 300 or less then 20')


export const findCommentValidator = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  if (!ObjectId.isValid(req.params.id)) {
    res
      .status(404)
      .json({})
    return;
  }
  const post = await commentCollection.findOne({ _id: new ObjectId(req.params.id) })
  if (!post) {
    res
      .status(404)
      .json({})
    return;
  }

  next()
}

export const commentValidators = [
  contentValidator,
  inputCheckErrorsMiddleware,
]
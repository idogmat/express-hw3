import { body } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { PostInputModel } from '../../../input-output-types/posts-types'
import { blogIdParamsValidator } from '../../blogs/middlewares/validators'
import { blogCollection, postCollection } from '../../../app'
import { ObjectId } from 'mongodb'

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid


// --POSTS
export const loginValidator = body('login').isString().withMessage('not string')
  .trim().isLength({ min: 3, max: 10 }).withMessage('more then 30 or 0').custom(login =>{
    const regex = /^[a-zA-Z0-9_-]*$/;
    if (!regex.test(login)) {
      return Promise.reject('not valid')
    }
    return true
  })

export const passwordValidator = body('password').isString().withMessage('not string')
  .trim().isLength({ min: 6, max: 20 }).withMessage('more then 100 or 0')

export const emailValidator = body('email').isString().withMessage('not string')
  .trim().isEmail().withMessage('not valid email')

export const userCreateValidators = [
  loginValidator,
  passwordValidator,
  emailValidator,
  inputCheckErrorsMiddleware,
]


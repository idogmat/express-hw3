import { body, param, query } from 'express-validator'
import { inputCheckErrorsMiddleware } from '../../../global-middlewares/inputCheckErrorsMiddleware'
import { blogCollection } from '../../../app'
import { ObjectId } from 'mongodb'


export const codeParamsValidator = query('code').isString().trim().withMessage('not string').isLength({ min: 1, max: 500 }).withMessage('not found')

export const emailConfirmCreateValidators = [
  codeParamsValidator,
  inputCheckErrorsMiddleware,
]

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

export const resendEmailValidator = [
  emailValidator,
  inputCheckErrorsMiddleware,
]

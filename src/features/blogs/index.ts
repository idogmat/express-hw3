import {Router} from 'express'
import {createBlogController} from './controllers/createBlogController'
import {getBlogsController} from './controllers/getBlogsController'
import {findBlogController} from './controllers/findBlogController'
import {delBlogController} from './controllers/delBlogController'
import {putBlogController} from './controllers/putBlogController'
import {blogCreateValidators, findBlogValidator} from './middlewares/validators'
import {adminMiddleware} from '../../global-middlewares/admin-middleware'
import { inputCheckErrorsMiddleware } from '../../global-middlewares/inputCheckErrorsMiddleware'

export const blogsRouter = Router()

blogsRouter.post('/',adminMiddleware, ...blogCreateValidators, createBlogController)
blogsRouter.get('/', getBlogsController, inputCheckErrorsMiddleware)
blogsRouter.get('/:id', findBlogValidator, inputCheckErrorsMiddleware, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, inputCheckErrorsMiddleware, delBlogController)
blogsRouter.put('/:id', adminMiddleware, findBlogValidator, ...blogCreateValidators, putBlogController)

// не забудьте добавить роут в апп
import {Router} from 'express'
import {createBlogController} from './controllers/createBlogController'
import {getBlogsController} from './controllers/getBlogsController'
import {findBlogController} from './controllers/findBlogController'
import {delBlogController} from './controllers/delBlogController'
import {putBlogController} from './controllers/putBlogController'
import {blogCreateValidators, blogIdParamsValidator } from './middlewares/validators'
import {adminMiddleware} from '../../global-middlewares/admin-middleware'
import { inputCheckErrorsMiddleware } from '../../global-middlewares/inputCheckErrorsMiddleware'

export const blogsRouter = Router()

blogsRouter.post('/',adminMiddleware, ...blogCreateValidators, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', blogIdParamsValidator, inputCheckErrorsMiddleware, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, blogIdParamsValidator, inputCheckErrorsMiddleware, delBlogController)
blogsRouter.put('/:id', adminMiddleware, blogIdParamsValidator, ...blogCreateValidators, putBlogController)

// не забудьте добавить роут в апп
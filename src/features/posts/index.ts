import {Router} from 'express'
import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostsController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/delPostController'
import {putPostController} from './controllers/putPostController'
import { findPostValidator, postCreateValidators} from './middlewares/validators'
import {adminMiddleware} from '../../global-middlewares/admin-middleware'
import { inputCheckErrorsMiddleware } from '../../global-middlewares/inputCheckErrorsMiddleware'

export const postsRouter = Router()

postsRouter.post('/',
  ...postCreateValidators,
  createPostController);

postsRouter.get('/', inputCheckErrorsMiddleware, getPostsController)
postsRouter.get('/:id', findPostValidator, inputCheckErrorsMiddleware, findPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, inputCheckErrorsMiddleware, delPostController)
postsRouter.put('/:id', adminMiddleware, findPostValidator, ...postCreateValidators, inputCheckErrorsMiddleware, putPostController)

// не забудьте добавить роут в апп
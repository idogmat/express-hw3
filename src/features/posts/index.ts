import { Router } from 'express'
import { createPostController } from './controllers/createPostController'
import { getPostsController } from './controllers/getPostsController'
import { findPostController } from './controllers/findPostController'
import { delPostController } from './controllers/delPostController'
import { putPostController } from './controllers/putPostController'
import { blogIdValidator, findPostValidator, postCreateValidators, putUpdateValidators } from './middlewares/validators'
import { adminMiddleware } from '../../global-middlewares/admin-middleware'
import { inputCheckErrorsMiddleware, inputCheckErrorsMiddlewareParms } from '../../global-middlewares/inputCheckErrorsMiddleware'

export const postsRouter = Router()

postsRouter.post('/',
  adminMiddleware,
  ...postCreateValidators,
  createPostController);

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, delPostController)
postsRouter.put('/:id', adminMiddleware, ...putUpdateValidators, putPostController)

// не забудьте добавить роут в апп
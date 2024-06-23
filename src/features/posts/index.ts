import { Router } from 'express'
import { createPostController } from './controllers/createPostController'
import { getPostsController } from './controllers/getPostsController'
import { findPostController } from './controllers/findPostController'
import { delPostController } from './controllers/delPostController'
import { putPostController } from './controllers/putPostController'
import { blogIdValidator, postCreateValidators, putUpdateValidators } from './middlewares/validators'
import { adminMiddleware } from '../../global-middlewares/admin-middleware'
import { inputCheckErrorsMiddleware } from '../../global-middlewares/inputCheckErrorsMiddleware'

export const postsRouter = Router()

postsRouter.post('/',
  adminMiddleware,
  ...postCreateValidators,
  createPostController);

postsRouter.get('/', inputCheckErrorsMiddleware, getPostsController)
postsRouter.get('/:id', blogIdValidator, findPostController)
postsRouter.delete('/:id', adminMiddleware, blogIdValidator, delPostController)
postsRouter.put('/:id', adminMiddleware, ...putUpdateValidators, blogIdValidator, putPostController)

// не забудьте добавить роут в апп
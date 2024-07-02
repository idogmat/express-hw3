import { Router } from 'express'
import { createPostController } from './controllers/createPostController'
import { getPostsController } from './controllers/getPostsController'
import { findPostController } from './controllers/findPostController'
import { delPostController } from './controllers/delPostController'
import { putPostController } from './controllers/putPostController'
import { commentContentValidator, findPostValidator, postCreateValidators, putUpdateValidators } from './middlewares/validators'
import { adminMiddleware } from '../../global-middlewares/admin-middleware'
import { createCommentInPostController } from './controllers/createCommentInPostController'
import { getCommentsInPostController } from './controllers/getCommentsInPostController'
import { inputCheckErrorsMiddleware } from '../../global-middlewares/inputCheckErrorsMiddleware'
import { tokenAuthorizationMiddleware } from '../../global-middlewares/tokenAuthorizationMiddleware '

export const postsRouter = Router()

postsRouter.post('/',
  adminMiddleware,
  ...postCreateValidators,
  createPostController);

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, delPostController)
postsRouter.put('/:id', adminMiddleware, ...putUpdateValidators, putPostController)
postsRouter.get('/:id/comments', findPostValidator, getCommentsInPostController)
postsRouter.post('/:id/comments',
  tokenAuthorizationMiddleware,
  commentContentValidator,
  inputCheckErrorsMiddleware,
  findPostValidator,
  createCommentInPostController)

import { Router } from 'express'
import { getDeviceController } from './controller/getDeviceController'
import { tokenRefreshMiddleware } from '../../global-middlewares/tokenRefreshMiddleware'


export const devicesRouter = Router()

// postsRouter.post('/',
//   adminMiddleware,
//   ...postCreateValidators,
//   createPostController);

// postsRouter.get('/', getPostsController)
devicesRouter.get('/', tokenRefreshMiddleware, getDeviceController)
// devicesRouter.delete('/', tokenAuthorizationMiddleware, findCommentValidator, deleteCommentController)
// devicesRouter.put('/:id', tokenAuthorizationMiddleware, commentValidators, putCommentController)

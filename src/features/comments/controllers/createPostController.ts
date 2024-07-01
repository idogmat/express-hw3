import { Response, Request } from 'express'
import { PostInputModel, PostViewModel } from '../../../input-output-types/posts-types'

export const createPostController = async (req: Request<any, any, PostInputModel>, res: Response<PostViewModel | unknown>) => {
  // const newPostId = await postsRepository.create(req.body)
  // if (!newPostId) {
  //   res.sendStatus(400);
  //   return;
  // }
  // const newPost = await postsRepository.findAndMap(newPostId as any)

  res
    .status(201)
}
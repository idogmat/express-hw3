import { Response, Request } from 'express'
import { PostInputModel, PostViewModel } from '../../../input-output-types/posts-types'
import { postsRepository } from '../postsRepository'
import { CommentInputModel, CommentViewModel } from '../../../input-output-types/comment-types'
import { commentsRepository } from '../../comments/commentsRepository'

export const createCommentInPostController = async (req: Request<{id: string}, any, CommentInputModel>, res: Response<CommentViewModel | unknown>) => {
  const newCommentId = await commentsRepository.create(req.body.content, req.params.id, req.userId)
  if (!newCommentId) {
    res.sendStatus(400);
    return;
  }
  const newComment = await commentsRepository.find(newCommentId)

  res
    .status(201)
    .json(newComment)
}
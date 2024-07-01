import { ObjectId } from 'mongodb'
import { commentCollection, postCollection, userCollection } from '../../app'
import { CommentTypeDB, PostTypeBD, UserTypeDB } from '../../db/db'
import { CommentInputModel, CommentViewModel } from '../../input-output-types/comment-types'
import { INormolizedQuery } from '../../utils/query-helper'
import { IReturnQueryList } from '../../input-output-types/query-types-output'

export const commentsRepository = {
  async create(content: string, postId: string, userId: string) {
    const user = await userCollection.findOne<UserTypeDB>({_id: new ObjectId(userId)})
    if (!user?.login) return false
    const newComment: Omit<CommentTypeDB, '_id'> = {
      content,
      postId,
      commentatorInfo: {
        userId,
        userLogin: user.login
      },
      createdAt: new Date(),
    };
    const result = await commentCollection.insertOne(newComment as Required<CommentTypeDB>);
    return result.insertedId
  },
  async getAll(postId: string, query: INormolizedQuery) {
    const totalCount = await commentCollection
      .find({postId}).toArray()

    const comments = await commentCollection
      .find({postId})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize).toArray()

    const queryForMap: IReturnQueryList<CommentViewModel> = {
      pagesCount: Math.ceil(totalCount.length / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length,
      items: comments.map(comment => this.map(comment)) 
    }
    return queryForMap
  },
  async find(id: ObjectId) {
    const comment = await commentCollection.findOne<CommentTypeDB>({ _id: new ObjectId(id) })
    if(comment?._id) {
      return this.map(comment)
    } else {
      return false
    } 
  },
  map(comment: CommentTypeDB): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      createdAt: comment.createdAt,
    }
  }
}
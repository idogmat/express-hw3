import { ObjectId } from 'mongodb'
import { commentCollection, postCollection, userCollection } from '../../app'
import { CommentTypeDB, PostTypeBD, UserTypeDB } from '../../db/db'
import { CommentInputModel, CommentViewModel } from '../../input-output-types/comment-types'
import { INormolizedQuery } from '../../utils/query-helper'
import { IReturnQueryList } from '../../input-output-types/query-types-output'

export const commentsRepository = {
  async create(content: string, postId: string, userId: string) {
    console.log(content, postId, userId)
    const user = await userCollection.findOne<UserTypeDB>({ _id: new ObjectId(userId) })
    console.log(user, 'user')
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
      .find({ postId }).toArray()

    const comments = await commentCollection
      .find({ postId })
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
  async delete(id: string | ObjectId, userId: string | ObjectId) {
    const permition = await commentCollection.findOne<CommentTypeDB>({ _id: new ObjectId(id), 'commentatorInfo.userId': userId })
    if (permition?._id) {
      const deleted = await commentCollection.deleteOne({ _id: new ObjectId(id) })
      if (deleted.deletedCount) {
        return true
      } else {
        return 'Forbidden'
      }
    } else {
      return 'Forbidden'
    }
  },
  async put(id: string | ObjectId, userId: string | ObjectId, content: string,) {
    const permition = await commentCollection.findOne<CommentTypeDB>({ _id: new ObjectId(id), 'commentatorInfo.userId': userId })
    if (permition?._id) {
      const updated = await commentCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: {content: content} }, {returnDocument: 'after'});
      if (updated?.content === content) {
        return true
      } else {
        return 'Forbidden'
      }
    } else {
      return 'Forbidden'
    }
  },
  async find(id: string | ObjectId) {
    const comment = await commentCollection.findOne<CommentTypeDB>({ _id: new ObjectId(id) })
    if (comment?._id) {
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
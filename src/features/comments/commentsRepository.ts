import { Types, ObjectId } from "mongoose";
import { commentCollection, userCollection } from '../../app'
import { CommentTypeDB, UserTypeDB } from '../../db/db'
import { CommentViewModel } from '../../input-output-types/comment-types'
import { INormolizedQuery } from '../../utils/query-helper'
import { IReturnQueryList } from '../../input-output-types/query-types-output'

export const commentsRepository = {
  async create(content: string, postId: string, userId: string) {
    const user = await userCollection.findOne<UserTypeDB>({ _id: new Types.ObjectId(userId) })
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
  async delete(id: string, userId: string | ObjectId) {
    const permition = await commentCollection.findOne<CommentTypeDB>({ _id: new Types.ObjectId(id)})
    if (permition?._id) {
      if(userId.toString() === permition.commentatorInfo.userId.toString()) {
        const deleted = await commentCollection.deleteOne({ _id: new Types.ObjectId(id) })
        if (deleted.deletedCount) {
          return true
        } 
      } else {
        return 'Forbidden'
      }
    }
    return false
  },
  async put(id: string, userId: string, content: string,) {
    const permition = await commentCollection.findOne<CommentTypeDB>({ _id: new Types.ObjectId(id)})
    if (permition?._id) {
      if(userId.toString() === permition.commentatorInfo.userId.toString()) {
        const updated = await commentCollection.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: {content: content} }, {returnDocument: 'after'});
        return true
      } else {
        return 'Forbidden'
      }
    } else {
      return false
    }
  },
  async find(id: string) {
    const comment = await commentCollection.findOne<CommentTypeDB>({ _id: new Types.ObjectId(id) })
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
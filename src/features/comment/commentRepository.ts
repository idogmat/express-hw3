import { Types, ObjectId } from "mongoose";
import {
  commentCollection,
  CommentTypeDB,
  userCollection,
  UserTypeDB,
} from "../../db";
import { INormolizedQuery } from "../../utils/query-helper";
import { CommentViewModel, IReturnQueryList } from "../../input-output-types";
import { getCurrentStatus, getLikeCount } from "../../utils/like-transform";

export class CommentRepository {
  static async create(content: string, postId: string, userId: string) {
    const user = await userCollection.findOne<UserTypeDB>({
      _id: new Types.ObjectId(userId),
    });
    if (!user?.login) return false;
    const newComment = {
      content,
      postId,
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      createdAt: new Date(),
      likesInfo: {
        like: 0,
        dislike: 0,
      },
    };
    const model = await new commentCollection(newComment);
    const result = await model.save();
    console.log(result);
    return result._id;
  }

  static async getAll(postId: string, query: INormolizedQuery, userId: string) {
    const totalCount = await commentCollection
      .find({ postId })
      .countDocuments();

    const comments = await commentCollection
      .find({ postId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    const queryForMap: IReturnQueryList<CommentViewModel> = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: comments.map((comment) => this.map(comment, userId)),
    };
    return queryForMap;
  }

  static async delete(id: string, userId: string | ObjectId) {
    const permition = await commentCollection.findOne<CommentTypeDB>({
      _id: new Types.ObjectId(id),
    });
    if (permition?._id) {
      if (userId.toString() === permition.commentatorInfo.userId.toString()) {
        const deleted = await commentCollection.deleteOne({
          _id: new Types.ObjectId(id),
        });
        if (deleted.deletedCount) {
          return true;
        }
      } else {
        return "Forbidden";
      }
    }
    return false;
  }

  static async put(id: string, userId: string, content: string) {
    const permition = await commentCollection.findOne<CommentTypeDB>({
      _id: new Types.ObjectId(id),
    });
    if (permition?._id) {
      if (userId.toString() === permition.commentatorInfo.userId.toString()) {
        const updated = await commentCollection.findOneAndUpdate(
          { _id: new Types.ObjectId(id) },
          { $set: { content: content } },
          { returnDocument: "after" },
        );
        return true;
      } else {
        return "Forbidden";
      }
    } else {
      return false;
    }
  }

  static async find(id: string) {
    const comment = await commentCollection.findOne<CommentTypeDB>({
      _id: new Types.ObjectId(id),
    });
    if (comment?._id) {
      return comment;
    } else {
      return false;
    }
  }

  static async setLike(id: string, userId: string, type: string) {
    const comment = await commentCollection.findById(id)
    if (comment) {
      comment.likesInfo.additionalLikes.set(userId, type);
      await comment.save();
      return true
    } else {
      return false
    }
  }

  static map(comment: CommentTypeDB, userId?: string): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: getLikeCount(comment.likesInfo.additionalLikes, 'Like'),
        dislikesCount: getLikeCount(comment.likesInfo.additionalLikes, 'Dislike'),
        myStatus: getCurrentStatus(comment.likesInfo.additionalLikes, userId || ''),
      },
    };
  }
}

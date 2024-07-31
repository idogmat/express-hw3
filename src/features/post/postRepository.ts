import "reflect-metadata";
import {
  PostInputModel,
  PostViewModel,
  IBlogWithPostsViewModelAfterQuery,
} from "../../input-output-types";
import { Types } from "mongoose";
import { blogCollection, postCollection, PostTypeBD } from "../../db";
import {
  INormolizedQuery,
  IQueryBlogWithPostsFilterTypeBD,
} from "../../utils/query-helper";
import { injectable } from "inversify";
import { PostQueryRepository } from "./postQueryRepository";
import { AuthRepository } from "../auth/authRepository";

@injectable()
export class PostRepository {
  constructor(
    protected postQueryRepository: PostQueryRepository,
    protected authRepository: AuthRepository,
  ) {}
  async create(post: PostInputModel) {
    const blog = await blogCollection.findOne({
      _id: new Types.ObjectId(post.blogId),
    });
    if (!blog?.name) return false;
    const newPost = {
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      createdAt: new Date(),
      blogName: blog.name,
      likesInfo: {
        like: 0,
        dislike: 0,
      },
    };
    const model = await new postCollection(newPost);
    const result = await model.save();
    return result._id;
  }

  async find(id: string, userId?: string) {
    const post = await postCollection.findOne<PostTypeBD>({
      _id: new Types.ObjectId(id),
    });
    if (post?._id) {
      return this.postQueryRepository.map(post, userId);
    }
    return false;
  }

  async findAndMap(id: string) {
    const post = await postCollection.findOne<PostTypeBD>({
      _id: new Types.ObjectId(id),
    });
    if (post?._id) {
      return this.postQueryRepository.map(post);
    }
    return false;
  }

  async delete(id: string) {
    const post = await postCollection.findOne({ _id: new Types.ObjectId(id) });
    if (!post?._id) return false;
    const result = await postCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    if (result.deletedCount) return true;
    return false;
  }

  async put(post: PostInputModel, id: string) {
    try {
      const res = await postCollection.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: post },
      );
      return !!res?._id;
    } catch (error) {
      return false;
    }
  }

  async setLike(id: string, userId: string, type: string) {
    const post = await postCollection.findById(id);
    if (post) {
      post.likesInfo.additionalLikes.set(userId, type);
      let index = -1;
      if (type === "Like") {
        const user = await this.authRepository.find(userId);
        post.likesInfo.newestLikes.forEach((el, i) => {
          if (el.userId === userId) {
            index = i;
          }
        });
        if (index === -1)
          post.likesInfo.newestLikes.unshift({
            userId,
            login: user?.login || "",
            addedAt: new Date().toISOString(),
          });
      } else {
        post.likesInfo.newestLikes.forEach((el, i) => {
          if (el.userId === userId) {
            index = i;
          }
        });
        if (index !== -1) post.likesInfo.newestLikes.splice(index, 1);
      }
      console.log(post.likesInfo.newestLikes);
      await post.save();
      return true;
    } else {
      return false;
    }
  }
}

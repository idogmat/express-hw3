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

export class PostRepository {
  static async create(post: PostInputModel) {
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

  static async find(id: string) {
    const post = await postCollection.findOne<PostTypeBD>({
      _id: new Types.ObjectId(id),
    });
    if (post?._id) {
      return this.map(post);
    }
    return false;
  }

  static async findAndMap(id: string) {
    const post = await postCollection.findOne<PostTypeBD>({
      _id: new Types.ObjectId(id),
    });
    if (post?._id) {
      return this.map(post);
    }
    return false;
  }

  static async getAll(query: INormolizedQuery) {
    const totalCount = await postCollection.find().countDocuments();

    const posts = await postCollection
      .find({})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    const queryForMap: IQueryBlogWithPostsFilterTypeBD = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: posts as PostTypeBD[],
    };
    return this.mapAfterQuery(queryForMap);
  }

  static async delete(id: string) {
    const post = await postCollection.findOne({ _id: new Types.ObjectId(id) });
    if (!post?._id) return false;
    const result = await postCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    if (result.deletedCount) return true;
    return false;
  }

  static async put(post: PostInputModel, id: string) {
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

  static map(post: PostTypeBD) {
    const postForOutput: PostViewModel = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      likesInfo: {
        like: post.likesInfo.like,
        dislike: post.likesInfo.dislike,
        myStatus: "None",
      },
    };
    return postForOutput;
  }

  static mapAfterQuery(blogs: IQueryBlogWithPostsFilterTypeBD) {
    const blogWithPostsForOutput: IBlogWithPostsViewModelAfterQuery = {
      ...blogs,
      items: blogs.items.map((b) => this.map(b)),
    };
    return blogWithPostsForOutput;
  }
}

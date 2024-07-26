import { INormolizedQuery } from "../../utils/query-helper";
import { Types } from "mongoose";
import {
  blogCollection,
  BlogTypeBD,
  postCollection,
  PostTypeBD,
} from "../../db";
import {
  BlogInputModel,
  BlogViewModel,
  PostInputModel,
  IBlogViewModelAfterQuery,
  IReturnQueryList,
} from "../../input-output-types";
import { PostRepository } from "../post/postRepository";

export class BlogRepository {
  static async create(blog: BlogInputModel) {
    const newBlog = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    const model = await new blogCollection(newBlog);
    const result = await model.save();
    console.log(result);
    return result._id;
  }

  static async find(id: string) {
    const blog = await blogCollection.findOne({ _id: new Types.ObjectId(id) });
    if (blog) {
      return this.map(blog);
    }
    return false;
  }

  static async findAndMap(id: string) {
    const blog = await blogCollection.findOne({ _id: new Types.ObjectId(id) });
    if (blog?._id) {
      return this.map(blog);
    }
    return false;
  }

  static async getPostsInBlog(blogId: string, query: INormolizedQuery) {
    const blog = await blogCollection.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog) {
      return false;
    }
    const totalCount = await postCollection
      .find({ blogId: blogId.toString() })
      .countDocuments();

    const posts = await postCollection
      .find({ blogId: blogId.toString() })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    const queryForMap = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return PostRepository.mapAfterQuery(queryForMap);
  }

  static async postPostsInBlog(blogId: string, post: PostInputModel) {
    const blog = await blogCollection.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog?.name) return false;
    const newPost = {
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: blogId,
      createdAt: new Date(),
      blogName: blog.name,
    } as PostTypeBD;
    const id = await PostRepository.create(newPost);
    if (!id) return false;
    const newPostForMap = await postCollection.findOne({
      _id: id,
    });
    if (newPostForMap?._id) {
      return PostRepository.map(newPostForMap);
    } else {
      return false;
    }
  }

  static async delete(id: string) {
    const blog = await blogCollection.findOne({ _id: new Types.ObjectId(id) });
    if (!blog?.name) return false;
    const deletedBlog = await blogCollection.deleteOne({
      _id: new Types.ObjectId(id),
    });
    const deletedPosts = await postCollection.deleteMany({
      blogId: id.toString(),
    });
    return true;
  }

  static async put(blog: BlogInputModel, id: string) {
    try {
      const result = await blogCollection.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: blog },
        { returnDocument: "after" },
      );
      return result;
    } catch {
      return false;
    }
  }

  static map(blog: BlogTypeBD) {
    const blogForOutput: BlogViewModel = {
      id: blog._id.toString(),
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      name: blog.name,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    return blogForOutput;
  }

  static mapAfterQuery(blogs: IReturnQueryList<BlogTypeBD>) {
    const blogForOutput: IBlogViewModelAfterQuery = {
      ...blogs,
      items: blogs.items.map((b: BlogTypeBD) => this.map(b)),
    };
    return blogForOutput;
  }
}

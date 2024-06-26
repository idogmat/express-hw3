import { PostInputModel, PostViewModel } from '../../input-output-types/posts-types'
import mongoose, { Types } from 'mongoose'
import { PostTypeBD, blogCollection, postCollection } from '../../db/db'
import { IBlogWithPostsViewModelAfterQuery } from '../../input-output-types/blogs-types'
import { INormolizedQuery, IQueryBlogWithPostsFilterTypeBD } from '../../utils/query-helper'

export const postsRepository = {
  async create(post: PostInputModel) {
    const blog = await blogCollection.findById(post.blogId)
    if (!blog?.name) return false;
    const newPost: PostInputModel = {
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      createdAt: new Date(),
      blogName: blog.name,
    };
    const model = await new postCollection({
      _id: new mongoose.Types.ObjectId(),
      ...newPost
    });
    const result = await model.save();
    return result._id;
  },
  async find(id: Types.ObjectId) {
    const post = await postCollection.findById(id)
    if (post?.id) {
      return this.map(post);
    }
    return false
  },
  async findAndMap(id: Types.ObjectId) {
    const post = await postCollection.findById(id);
    if (post) {
      return this.map(post);
    }
    return false
  },
  async getAll(query: INormolizedQuery) {
    const totalCount = await postCollection
    .find().countDocuments()

    const posts = await postCollection
    .find()
    .sort({[query.sortBy]: query.sortDirection})
    .skip((query.pageNumber - 1) * query.pageSize)
    .limit(query.pageSize)

    const queryForMap = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: posts
    }
    return postsRepository.mapAfterQuery(queryForMap)
  },
  async del(id: Types.ObjectId) {
    const post = await postCollection.findById(id);
    if (!post?.title) return false
    await postCollection.deleteOne({ _id: id });
    return true;
  },
  async put(post: PostInputModel, id: Types.ObjectId) {
    try {
      const res = await postCollection.findByIdAndUpdate(id, { ...post });
      return !!res?._id
    } catch (error) {
      return false
    }
  },
  map(post: PostTypeBD) {
    const postForOutput: PostViewModel = {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    }
    return postForOutput
  },
  mapAfterQuery(blogs: IQueryBlogWithPostsFilterTypeBD) {
    const blogWithPostsForOutput: IBlogWithPostsViewModelAfterQuery = {
      ...blogs,
      items: blogs.items.map(b => this.map(b)) 
    }
    return blogWithPostsForOutput
},
}
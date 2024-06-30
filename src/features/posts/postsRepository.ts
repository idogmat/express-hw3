import { PostInputModel, PostViewModel } from '../../input-output-types/posts-types'
import { Types } from 'mongoose'
import { INormolizedQuery, IQueryBlogWithPostsFilterTypeBD } from '../../utils/query-helper'
import { ObjectId } from 'mongodb'
import { blogCollection, postCollection } from '../../app'
import { IBlogWithPostsViewModelAfterQuery } from '../../input-output-types/blogs-types'
import { PostTypeBD } from '../../db/db'

export const postsRepository = {
  async create(post: PostInputModel) {
    const blog = await blogCollection.findOne({ _id: new ObjectId(post.blogId) })
    if (!blog?.name) return false;
    const newPost = {
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogId: new ObjectId(post.blogId),
      createdAt: new Date(),
      blogName: blog.name,
    } as PostTypeBD;
    const result = await postCollection.insertOne(newPost);
    return result.insertedId
  },
  async find(id: ObjectId) {
    const post = await postCollection.findOne<PostTypeBD>({ _id: new ObjectId(id) })
    if (post?._id) {
      return this.map(post);
    }
    return false
  },
  async findAndMap(id: ObjectId) {
    const post = (await postCollection.findOne<PostTypeBD>({ _id: new ObjectId(id) }));
    if (post?._id) {
      return this.map(post);
    }
    return false
  },
  async getAll(query: INormolizedQuery) {
    const totalCount = await postCollection
      .find().toArray()

    const posts = await postCollection
      .find({})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize).toArray()

    const queryForMap: IQueryBlogWithPostsFilterTypeBD = {
      pagesCount: Math.ceil(totalCount.length / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length,
      items: posts as PostTypeBD[]
    }
    return postsRepository.mapAfterQuery(queryForMap)
  },
  async del(id: ObjectId) {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post?._id) return false
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return true;
    return false
  },
  async put(post: PostInputModel, id: Types.ObjectId) {
    try {
      const res = await postCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: post });
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
      blogId: post.blogId.toString(),
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
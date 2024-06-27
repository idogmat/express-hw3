import mongoose from 'mongoose'
import {BlogDbType} from '../../db/blog-db-type'
import {BlogInputModel, BlogViewModel, IBlogViewModelAfterQuery} from '../../input-output-types/blogs-types'
import { INormolizedQuery, IQueryBlogWithPostsFilterTypeBD, IQueryBlogsFilterTypeBD } from '../../utils/query-helper';
import { postsRepository } from '../posts/postsRepository';
import { PostInputModel, PostViewModel } from '../../input-output-types/posts-types';
import { ObjectId } from 'mongodb';
import { blogCollection, postCollection } from '../../app';
import { PostTypeBD } from '../../db/db';

export const blogsRepository = {
    async create(blog: BlogInputModel) {
        const newBlog: Partial<BlogDbType> = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        };
        const result = await blogCollection.insertOne(newBlog);
        return result.insertedId;
    },
    async find(id: ObjectId) {
      const blog = await blogCollection.findOne({_id: new ObjectId(id)})
      if (blog) {
        return this.map(blog as any);
      }
      return false
    },
    async findAndMap(id: ObjectId) {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)});
        if (blog) {
          return this.map(blog as any);
        }
        return false
    },
    async getPostsInBlog(blogId: ObjectId, query: INormolizedQuery) {
      const blog = await blogCollection.findOne({blogId: new ObjectId(blogId)})
      if (!blog) {
        return false;
      }
      const totalCount = await postCollection
      .find({blogId: blogId}).toArray()

      const posts = await postCollection
      .find({blogId: blogId})
      .sort({[query.sortBy]: query.sortDirection})
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)

      const queryForMap = {
        pagesCount: Math.ceil(totalCount.length / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: totalCount.length,
        items: posts.toArray()
      }
      return postsRepository.mapAfterQuery(queryForMap as any)
    },
    async postPostsInBlog(blogId: ObjectId, post: PostInputModel) {
      const blog = await blogCollection.findOne({blogId: new ObjectId(blogId)})
      if (!blog?.name) return false;
      const newPost: PostInputModel = {
        title: post.title,
        content: post.content,
        shortDescription: post.shortDescription,
        blogId: blogId.toString(),
        createdAt: new Date(),
        blogName: blog.name,
      };
      const result = await postCollection.insertOne(newPost);
      result.insertedId
      const newPostForMap = await postCollection.findOne({_id: new ObjectId(result.insertedId)})
      if (newPostForMap?._id) {
        return postsRepository.map(newPostForMap as any);
      } else {
        return false
      }
    },
    async getAll(query: INormolizedQuery) {
      const totalCount = await blogCollection
      .find({name: {$regex: query.searchNameTerm || '', $options: 'i'}}).toArray()

      const blogs = await blogCollection
      .find({name: {$regex: query.searchNameTerm || '', $options: 'i'}})
      .sort({[query.sortBy]: query.sortDirection})
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize).toArray()
      const queryForMap = {
        pagesCount: Math.ceil(totalCount.length / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: totalCount.length,
        items: blogs
      }
      return this.mapAfterQuery(queryForMap);
    },
    async del(id: ObjectId) {
      const blog = await blogCollection.findOne({_id: new ObjectId(id)});
      if (!blog?.name) return false
      await blogCollection.deleteOne({_id: id});
      return true;
    },
    async put(blog: BlogInputModel, id: ObjectId) {
      try {
        const result = await blogCollection.findOneAndUpdate({_id: new ObjectId(id)}, { $set: blog }, {returnDocument: 'after'});
        return result
      } catch {
        return false
      }
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog._id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
        return blogForOutput
    },
    mapAfterQuery(blogs: any) {
      const blogForOutput: any = {
        ...blogs,
        items: blogs.items.map((b: any) => this.map(b)) 
      }
      return blogForOutput
  },
}
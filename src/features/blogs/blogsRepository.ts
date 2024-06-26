import mongoose from 'mongoose'
import {BlogDbType} from '../../db/blog-db-type'
import {BlogInputModel, BlogViewModel, IBlogViewModelAfterQuery} from '../../input-output-types/blogs-types'
import { BlogTypeBD, blogCollection, postCollection } from '../../db/db';
import { INormolizedQuery, IQueryBlogsFilterTypeBD } from '../../utils/query-helper';
import { postsRepository } from '../posts/postsRepository';
import { PostInputModel } from '../../input-output-types/posts-types';

export const blogsRepository = {
    async create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        };
        const model = new blogCollection({
          _id: new mongoose.Types.ObjectId(),
          ...newBlog
        });
        const result = await model.save()
        return result._id;
    },
    async find(id: mongoose.Types.ObjectId) {
      const blog = await blogCollection.findById(id)
      if (blog) {
        return this.map(blog);
      }
      return false
    },
    async findAndMap(id: mongoose.Types.ObjectId) {
        const blog = await blogCollection.findById(id);
        if (blog) {
          return this.map(blog);
        }
        return false
    },
    async getPostsInBlog(blogId: mongoose.Types.ObjectId, query: INormolizedQuery) {
      const blog = await blogCollection.findById(blogId)
      if (!blog) {
        return false;
      }
      const totalCount = await postCollection
      .find({blogId: blogId})
      .countDocuments()

      const posts = await postCollection
      .find({blogId: blogId})
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
    async postPostsInBlog(blogId: mongoose.Types.ObjectId, post: PostInputModel) {
      const blog = await blogCollection.findById(blogId)
      if (!blog?.name) return false;
      const newPost: PostInputModel = {
        title: post.title,
        content: post.content,
        shortDescription: post.shortDescription,
        blogId: blogId.toString(),
        createdAt: new Date(),
        blogName: blog.name,
      };
      const model = await new postCollection({
        _id: new mongoose.Types.ObjectId(),
        ...newPost
      });
      const result = await model.save();
      return postsRepository.map(result);
    },
    async getAll(query: INormolizedQuery) {
      const totalCount = await blogCollection
      .find({name: {$regex: query.searchNameTerm || '', $options: 'i'}})
      .countDocuments()

      const blogs = await blogCollection
      .find({name: {$regex: query.searchNameTerm || '', $options: 'i'}})
      .sort({[query.sortBy]: query.sortDirection})
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      const queryForMap = {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: blogs
      }
      return this.mapAfterQuery(queryForMap);
    },
    async del(id: mongoose.Types.ObjectId) {
      const blog = await blogCollection.findById(id);
      if (!blog?.name) return false
      await blogCollection.deleteOne({_id: id});
      return true;
    },
    async put(blog: BlogInputModel, id: mongoose.Types.ObjectId) {
      try {
        const res = await blogCollection.findByIdAndUpdate(id, {...blog});
        return !!res?._id
      } catch (error) {
        return false
      }
    },
    map(blog: BlogTypeBD) {
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
    mapAfterQuery(blogs: IQueryBlogsFilterTypeBD) {
      const blogForOutput: IBlogViewModelAfterQuery = {
        ...blogs,
        items: blogs.items.map(b => this.map(b)) 
      }
      return blogForOutput
  },
}
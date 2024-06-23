import mongoose from 'mongoose'
import {BlogDbType} from '../../db/blog-db-type'
import {BlogInputModel, BlogViewModel} from '../../input-output-types/blogs-types'
import { BlogTypeBD, blogCollection } from '../../db/db';

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
      return {}
    },
    async findAndMap(id: mongoose.Types.ObjectId) {
        const blog = await blogCollection.findById(id);
        if (blog) {
          return this.map(blog);
        }
        return {}
    },
    async getAll() {
      const blogs = await blogCollection.find();
      return blogs.map(b => this.map(b));
    },
    async del(id: mongoose.Types.ObjectId) {
      const blog = await blogCollection.findById(id);
      if (!blog?.name) return false
      await blogCollection.deleteOne({_id: id});
      return true;
    },
    async put(blog: BlogInputModel, id: mongoose.Types.ObjectId) {
      try {
        await blogCollection.findByIdAndUpdate(id, {...blog});
        return true
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
}
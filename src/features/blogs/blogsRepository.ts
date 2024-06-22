import mongoose from 'mongoose'
import { blogCollection } from '../../app'
import {BlogDbType} from '../../db/blog-db-type'
import {BlogInputModel, BlogViewModel} from '../../input-output-types/blogs-types'

export const blogsRepository = {
    async create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        const model = new blogCollection({
          _id: new mongoose.Types.ObjectId(),
          ...newBlog
        });
        const result = await model.save()
        return result._id;
    },
    async find(id: string) {
      const blog = await blogCollection.findById(id)
      return blog;
    },
    async findAndMap(id: mongoose.Types.ObjectId) {
        const blog = await blogCollection.findById(id);
        return blog;
    },
    async getAll() {
      const blogs = await blogCollection.find();
      return blogs;
    },
    async del(id: string) {
      const blog = await blogCollection.findById(id);
      if (!blog?.name) return false
      const result = await blogCollection.deleteOne({_id: id});
      return true;
    },
    async put(blog: BlogInputModel, id: string) {
      try {
        await blogCollection.findByIdAndUpdate(id, {...blog});
        return true
      } catch (error) {
        return false
      }
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        }
        return blogForOutput
    },
}
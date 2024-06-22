import {PostInputModel, PostViewModel} from '../../input-output-types/posts-types'
import {PostDbType} from '../../db/post-db-type'
import { blogCollection, postCollection } from '../../app'
import mongoose, { ObjectId, Types } from 'mongoose'

export const postsRepository = {
    async create(post: PostInputModel) {
      const blog = await blogCollection.findById(post.blogId)
      if(!blog?.name) return false;
        const newPost: PostInputModel = {
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blog.name,
        };
        const model = await new postCollection({
          _id: new mongoose.Types.ObjectId(),
          ...newPost
        });
        const result = await model.save();
        return result._id;
    },
    async find(id: string) {
        const post = await postCollection.findById(id)
        return post;
    },
    async findAndMap(id: Types.ObjectId) {
      const post = await postCollection.findById(id);
      return post;
    },
    async getAll() {
      const posts = await postCollection.find();
      return posts;
    },
    async del(id: string) {
      const post = await postCollection.findById(id);
      if (!post?.title) return false
      const result = await postCollection.deleteOne({_id: id});
      return true;
    },
    async put(post: PostInputModel, id: string) {
      try {
        const res = await postCollection.findByIdAndUpdate(id, {...post});
        return true
      } catch (error) {
        return false
      }
    },
    map(post: PostDbType) {
        const postForOutput: PostViewModel = {
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
        }
        return postForOutput
    },
}
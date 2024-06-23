import mongoose, { Model } from "mongoose";

export type PostTypeBD = {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  shortDescription: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type BlogTypeBD = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};
export const BlogSchema = new mongoose.Schema<BlogTypeBD, Model<BlogTypeBD>>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: false },
  isMembership: { type: Boolean, required: false }
})

export const PostSchema = new mongoose.Schema<PostTypeBD, Model<PostTypeBD>>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: false },
  createdAt: { type: Date, required: false },
})

export const blogCollection = mongoose.model('Blog', BlogSchema)
export const postCollection = mongoose.model('Post', PostSchema)

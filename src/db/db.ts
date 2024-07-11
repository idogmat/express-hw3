import mongoose, { Model } from "mongoose";
import { client } from "../app";
import { ObjectId } from "mongodb";



export type PostTypeBD = {
  _id: ObjectId;
  title: string;
  content: string;
  shortDescription: string;
  blogId: ObjectId | string;
  blogName: string;
  createdAt: Date;
};

export type PostTypeBDWithoutId = Omit<PostTypeBD, '_id'>

export type BlogTypeBD = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogTypeBDWithoutId = Omit<BlogTypeBD, '_id'>

export type UserTypeDB = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
}

export type EmailConfirmation = { 
  confirmationCode: `${string}-${string}-${string}-${string}-${string}`;
  expirationDate: Date;
  isConfirmed: boolean;
}

export type UserTypeDBWithoutId = Omit<UserTypeDB, '_id' | 'refreshToken'>;

export type CommentTypeDB = {
  _id: ObjectId;
  postId: ObjectId | string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
}

export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
}

export type LogTypeDB = {
  IP: string;
  URL: string;
  date: Date;
  count: number;
}

export type DeviceTypeDB = {
  _id: ObjectId;
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: ObjectId;
  refreshToken: string;
}

export type DeviceTypeDBWithoutId = Omit<DeviceTypeDB, '_id'>;


// export const BlogSchema = new mongoose.Schema<BlogTypeBD, Model<BlogTypeBD>>({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   websiteUrl: { type: String, required: true },
//   createdAt: { type: Date, required: false },
//   isMembership: { type: Boolean, required: false }
// })

// export const PostSchema = new mongoose.Schema<PostTypeBD, Model<PostTypeBD>>({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   shortDescription: { type: String, required: true },
//   blogId: { type: String, required: true },
//   blogName: { type: String, required: false },
//   createdAt: { type: Date, required: false },
// })

// const db = client.db('blogs')
// export const blogCollection = client.db('blogs').collection('Blog')
// export const postCollection = client.db('blogs').collection('Post')



import mongoose, { Model } from "mongoose";
import { client } from "../app";
import { ObjectId } from "mongodb";

export type PostTypeBD = {
  _id: ObjectId;
  title: string;
  content: string;
  shortDescription: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type PostTypeBDWithoutId = Omit<PostTypeBD, "_id">;

export type BlogTypeBD = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogTypeBDWithoutId = Omit<BlogTypeBD, "_id">;

export type UserTypeDB = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
};

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type UserTypeDBWithoutId = Omit<UserTypeDB, "_id" | "refreshToken">;

export type CommentTypeDB = {
  _id: ObjectId;
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
};

export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

export type LogTypeDB = {
  IP: string;
  URL: string;
  date: Date;
  count: number;
};

export type DeviceTypeDB = {
  _id: ObjectId;
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
  refreshToken: string;
};

export type DeviceTypeDBWithoutId = Omit<DeviceTypeDB, "_id">;

// blog
export const BlogSchema = new mongoose.Schema<BlogTypeBD, Model<BlogTypeBD>>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true, default: false },
});

// post
export const PostSchema = new mongoose.Schema<PostTypeBD, Model<PostTypeBD>>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

// comment
const CommentatorInfoSchema = new mongoose.Schema<
  CommentatorInfoType,
  Model<CommentatorInfoType>
>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

export const CommentSchema = new mongoose.Schema<
  CommentTypeDB,
  Model<CommentTypeDB>
>({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true },
});

// user
const EmailConfirmationSchema = new mongoose.Schema<
  EmailConfirmation,
  Model<EmailConfirmation>
>({
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true },
});

export const UserSchema = new mongoose.Schema<UserTypeDB, Model<UserTypeDB>>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: false },
  createdAt: { type: String, required: false },
  emailConfirmation: { type: EmailConfirmationSchema, required: false },
});

// log
export const LogSchema = new mongoose.Schema<LogTypeDB, Model<LogTypeDB>>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },
  count: { type: Number, required: true },
});

// device
export const DeviceSchema = new mongoose.Schema<
  DeviceTypeDB,
  Model<DeviceTypeDB>
>({
  userId: { type: String, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  deviceId: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

// const db = client.db('blogs')
// export const blogCollection = client.db('blogs').collection('Blog')
// export const postCollection = client.db('blogs').collection('Post')

export const blogCollection = mongoose.model("Blog", BlogSchema);
export const postCollection = mongoose.model("Post", PostSchema);
export const commentCollection = mongoose.model("Comment", CommentSchema);
export const userCollection = mongoose.model("User", UserSchema);
export const logCollection = mongoose.model("Log", LogSchema);
export const deviceCollection = mongoose.model("Device", DeviceSchema);

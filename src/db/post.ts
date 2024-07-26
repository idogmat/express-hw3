import mongoose, { Model, ObjectId } from "mongoose";
import { LikesInfo, LikesInfoSchema } from "./common-types";

export type PostTypeBD = {
  _id: ObjectId;
  title: string;
  content: string;
  shortDescription: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  likesInfo: LikesInfo;
};

// post
export const PostSchema = new mongoose.Schema<PostTypeBD, Model<PostTypeBD>>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  likesInfo: { type: LikesInfoSchema, required: false },
});

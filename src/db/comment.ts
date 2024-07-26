import mongoose, { Model, ObjectId } from "mongoose";
import { LikesInfo, LikesInfoSchema } from "./common-types";

export type CommentTypeDB = {
  _id: ObjectId;
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  likesInfo: LikesInfo;
};

export type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

// comment
const CommentatorInfoSchema = new mongoose.Schema<
  CommentatorInfoType,
  Model<CommentatorInfoType>
>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false },
);

export const CommentSchema = new mongoose.Schema<
  CommentTypeDB,
  Model<CommentTypeDB>
>({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true },
  likesInfo: { type: LikesInfoSchema, required: false },
});

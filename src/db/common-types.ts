import mongoose, { Model } from "mongoose";

export interface LikesInfo {
  like: number;
  dislike: number;
  additionalLikes: Map<string,string>
}

export const LikesInfoSchema = new mongoose.Schema<LikesInfo, Model<LikesInfo>>(
  {
    like: { type: Number, required: false, default: 0 },
    dislike: { type: Number, required: false, default: 0 },
    additionalLikes: { type: Map, of: String, default: {} },
  },
  { _id: false },
);

import mongoose, { Model } from "mongoose";

export interface LikesInfo {
  like: string[];
  dislike: string[];
}

export const LikesInfoSchema = new mongoose.Schema<LikesInfo, Model<LikesInfo>>(
  {
    like: { type: [String], required: false, default: [] },
    dislike: { type: [String], required: false, default: [] },
  },
  { _id: false },
);

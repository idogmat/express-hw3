import mongoose, { Model } from "mongoose";

export interface NewestLikes {
  userId: string;
  login: string;
  addedAt: string
}

export interface LikesInfo {
  like: number;
  dislike: number;
  additionalLikes: Map<string, string>;
  newestLikes: NewestLikes[];
}

export const NewestLikesSchema = new mongoose.Schema<NewestLikes, Model<NewestLikes>>({
  userId: { type: String, required: false },
  login: { type: String, required: false },
  addedAt: { type: String, required: false },
},
{ _id: false },
)


export const LikesInfoSchema = new mongoose.Schema<LikesInfo, Model<LikesInfo>>(
  {
    like: { type: Number, required: false, default: 0 },
    dislike: { type: Number, required: false, default: 0 },
    additionalLikes: { type: Map, of: String, default: {} },
    newestLikes: { type: [NewestLikesSchema], default: [] },
  },
  { _id: false },
);

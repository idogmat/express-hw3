import mongoose, { Model, ObjectId } from "mongoose";

export type BlogTypeBD = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

// blog
export const BlogSchema = new mongoose.Schema<BlogTypeBD, Model<BlogTypeBD>>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true, default: false },
});

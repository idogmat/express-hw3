import { BlogTypeBD, BlogSchema } from "./blog";
import { PostTypeBD, PostSchema } from "./post";
import { CommentTypeDB, CommentSchema } from "./comment";
import { UserSchema, UserTypeDB } from "./user";
import { DeviceSchema, DeviceTypeDB } from "./device";
import { LogTypeDB, LogSchema } from "./log";
import mongoose from "mongoose";

const blogCollection = mongoose.model("Blog", BlogSchema);
const postCollection = mongoose.model("Post", PostSchema);
const commentCollection = mongoose.model("Comment", CommentSchema);
const userCollection = mongoose.model("User", UserSchema);
const logCollection = mongoose.model("Log", LogSchema);
const deviceCollection = mongoose.model("Device", DeviceSchema);

export {
  BlogTypeBD,
  blogCollection,
  PostTypeBD,
  postCollection,
  CommentTypeDB,
  commentCollection,
  UserTypeDB,
  userCollection,
  DeviceTypeDB,
  deviceCollection,
  LogTypeDB,
  logCollection,
};

import { Router } from "express";
import {
  blogCollection,
  commentCollection,
  deviceCollection,
  fileCollection,
  logCollection,
  postCollection,
  userCollection,
} from "../../db";
import { gfs } from "../../app";
export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  await blogCollection.deleteMany({});
  await postCollection.deleteMany({});
  await commentCollection.deleteMany({});
  await userCollection.deleteMany({});
  await logCollection.deleteMany({});
  await deviceCollection.deleteMany({});
  await fileCollection.deleteMany({});
  await gfs!.drop();
  res.status(204).json({});
});

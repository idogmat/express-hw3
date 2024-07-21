import { Router } from "express";
import {
  blogCollection,
  commentCollection,
  deviceCollection,
  logCollection,
  postCollection,
  userCollection,
} from "../../db/db";
export const testingRouter = Router();

testingRouter.delete("/all-data", async (req, res) => {
  await blogCollection.deleteMany({});
  await postCollection.deleteMany({});
  await commentCollection.deleteMany({});
  await userCollection.deleteMany({});
  await logCollection.deleteMany({});
  await deviceCollection.deleteMany({});
  res.status(204).json({});
});

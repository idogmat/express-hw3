import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { blogsRouter } from "./features/blog";
import { testingRouter } from "./features/testing";
import { postsRouter } from "./features/post";
import dotenv from "dotenv";
import { authRouter } from "./features/auth";
import { usersRouter } from "./features/user";
import { commentsRouter } from "./features/comment";
import cookieParser from "cookie-parser";
import { loggerMiddleware } from "./global-middlewares/loggerMiddleware";
import { devicesRouter } from "./features/device";
import mongoose from "mongoose";
dotenv.config();
const tokenDB = process.env.CONNECTION || "";

export const connectDb = async () => {
  // Use connect method to connect to the server
  try {
    await mongoose.connect(tokenDB);
    console.log("Connected successfully to mongoDB server");
  } catch (error) {
    console.log("Can't connect to mongo server", error);
    await mongoose.disconnect();
  }
  return "done.";
};

export const app = express();
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors({ origin: true, credentials: true })); //
app.use(cookieParser());
// app.use(loggerMiddleware);
app.get("/", (req, res) => {
  res.status(200).json({ version: "2.1" });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.DEVICES, devicesRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);

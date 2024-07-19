import { Response, Request } from "express";
import {
  PostInputModel,
  PostViewModel,
} from "../../../input-output-types/posts-types";
import { PostRepository } from "../postRepository";

export const createPostController = async (
  req: Request<any, any, PostInputModel>,
  res: Response<PostViewModel | unknown>,
) => {
  const newPostId = await PostRepository.create(req.body);
  if (!newPostId) {
    res.sendStatus(400);
    return;
  }
  const newPost = await PostRepository.findAndMap(newPostId.toString());

  res.status(201).json(newPost);
};

import { Request, Response } from "express";
import { CommentInputModel, CommentViewModel, IBlogWithPostsViewModelAfterQuery, IReturnQueryList, PostInputModel, PostViewModel } from "../../input-output-types";
import { CommentRepository } from "../comment/commentRepository";
import { PostRepository } from "./postRepository";
import { IQuery, isValidObjectId, normolizedQuery } from "../../utils/query-helper";
import { Types } from "mongoose";


export class PostController {
  static async createCommentInPost(
    req: Request<{ id: string }, any, CommentInputModel>,
    res: Response<CommentViewModel | unknown>,
  ) {
    const newCommentId = await CommentRepository.create(
      req.body.content,
      req.params.id,
      req.userId,
    );
    if (!newCommentId) {
      res.sendStatus(400);
      return;
    }
    const newComment = await CommentRepository.find(newCommentId.toString());
    res.status(201).json(newComment);
  };

  static async createPost(
    req: Request<any, any, PostInputModel>,
    res: Response<PostViewModel | unknown>,
  ) {
    const newPostId = await PostRepository.create(req.body);
    if (!newPostId) {
      res.sendStatus(400);
      return;
    }
    const newPost = await PostRepository.findAndMap(newPostId.toString());
  
    res.status(201).json(newPost);
  };

  static async deletePost(
    req: Request<{ id: string }>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await PostRepository.delete(id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  };

  static async find(
    req: Request<{ id: string }>,
    res: Response<PostViewModel | {}>,
  ) {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const data = await PostRepository.find(id);
    if (data) res.status(200).json(data);
    else res.sendStatus(404);
  };

  static async getPosts(
    req: Request,
    res: Response<IBlogWithPostsViewModelAfterQuery>,
  ) {
    const query = normolizedQuery(req.query);
    const data = await PostRepository.getAll(query);
    res.status(200).json(data);
  };

  static async getCommentsInPost(
    req: Request<{ id: string }, {}, {}, IQuery>,
    res: Response<IReturnQueryList<CommentViewModel>>,
  ) {
    const query = normolizedQuery(req.query);
    const data = await CommentRepository.getAll(req.params.id, query);
    res.status(200).json(data);
  };

  static async updatePost(
    req: Request<{ id: string }, any, PostInputModel>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await PostRepository.put({ ...req.body }, id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  };
}
import "reflect-metadata";
import { Request, Response } from "express";
import {
  CommentInputModel,
  CommentViewModel,
  IBlogWithPostsViewModelAfterQuery,
  IReturnQueryList,
  PostInputModel,
  PostViewModel,
} from "../../input-output-types";
import { CommentRepository } from "../comment/commentRepository";
import { PostRepository } from "./postRepository";
import {
  IQuery,
  isValidObjectId,
  normolizedQuery,
} from "../../utils/query-helper";
import { Types } from "mongoose";
import { injectable } from "inversify";
import { PostQueryRepository } from "./postQueryRepository";
import { LikeStatus } from "../../input-output-types/comment-types";

@injectable()
export class PostController {
  constructor(
    protected commentRepository: CommentRepository,
    protected postRepository: PostRepository,
    protected postQueryRepository: PostQueryRepository,
  ) {}
  async createCommentInPost(
    req: Request<{ id: string }, any, CommentInputModel>,
    res: Response<CommentViewModel | any>,
  ) {
    const newCommentId = await this.commentRepository.create(
      req.body.content,
      req.params.id,
      req.userId,
    );
    if (!newCommentId) {
      res.sendStatus(400);
      return;
    }
    const newComment = await this.commentRepository.find(
      newCommentId.toString(),
    );
    if (!newComment) return res.sendStatus(400);
    return res.status(201).json(this.commentRepository.map(newComment));
  }

  async createPost(
    req: Request<any, any, PostInputModel>,
    res: Response<PostViewModel | unknown>,
  ) {
    const newPostId = await this.postRepository.create(req.body);
    if (!newPostId) {
      res.sendStatus(400);
      return;
    }
    const newPost = await this.postRepository.findAndMap(newPostId.toString());

    res.status(201).json(newPost);
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await this.postRepository.delete(id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  }

  async find(req: Request<{ id: string }>, res: Response<PostViewModel | {}>) {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const data = await this.postRepository.find(id, req?.userId);
    if (data) res.status(200).json(data);
    else res.sendStatus(404);
  }

  async getPosts(
    req: Request,
    res: Response<IBlogWithPostsViewModelAfterQuery>,
  ) {
    console.log(req.userId);
    const query = normolizedQuery(req.query);
    const data = await this.postQueryRepository.getAll(query, req?.userId);
    res.status(200).json(data);
  }

  async getCommentsInPost(
    req: Request<{ id: string }, {}, {}, IQuery>,
    res: Response<IReturnQueryList<CommentViewModel>>,
  ) {
    const query = normolizedQuery(req.query);
    const data = await this.commentRepository.getAll(
      req.params.id,
      query,
      req.userId,
    );

    res.status(200).json(data);
  }

  async updatePost(
    req: Request<{ id: string }, any, PostInputModel>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await this.postRepository.put({ ...req.body }, id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  }

  async setLike(req: Request<{ id: string }, any, LikeStatus>, res: Response) {
    const id = req?.userId;
    const post = await this.postRepository.find(req.params.id);
    console.log(post);
    if (post) {
      const field = req.body.likeStatus;
      const result = await this.postRepository.setLike(
        req.params.id,
        id,
        field,
      );
      console.log(result);
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
  }
}

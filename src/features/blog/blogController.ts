import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel, PostInputModel, PostViewModel } from "../../input-output-types";
import { BlogRepository } from "./blogRepository";
import { IQuery, isValidObjectId, normolizedQuery } from "../../utils/query-helper";
import { BlogQueryRepository } from "./blogQueryRepository";

export class BlogController {
  static async create(
    req: Request<{}, {}, BlogInputModel>,
    res: Response<BlogViewModel>,
  ) {
    const newBlogId = await BlogRepository.create(req.body);
    const newBlog = await BlogRepository.findAndMap(newBlogId.toString());
    newBlog ? res.status(201).json(newBlog) : res.sendStatus(400);
  };

  static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await BlogRepository.delete(id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  };

  static async find(
    req: Request<{ id: string }>,
    res: Response<BlogViewModel | {}>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await BlogRepository.find(id);
    if (data) res.status(200).json(data);
    else res.sendStatus(404);
  };

  static async get(
    req: Request<{}, {}, {}, IQuery>,
    res: Response<any>,
  ) {
    const query = normolizedQuery(req.query);
    const data = await BlogQueryRepository.getAll(query);
    res.status(200).json(data);
  };

  static async getPostsInBlog(
    req: Request<{id: string}, {}, {}, IQuery>,
    res: Response<any>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const query = normolizedQuery(req.query);
    const data = await BlogRepository.getPostsInBlog(id, query);
    data ? res.status(200).json(data) : res.sendStatus(404);
  };

  static async createPostInBlog(
    req: Request<{id: string}, {}, PostInputModel>,
    res: Response<PostViewModel>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await BlogRepository.postPostsInBlog(id, req.body);
    data ? res.status(201).json(data) : res.sendStatus(400);
  };

  static async update(
    req: Request<{ id: string }, {}, BlogInputModel>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await BlogRepository.put({ ...req.body }, id);
    // console.log(result, 'final')
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  };
}
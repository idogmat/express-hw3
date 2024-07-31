import "reflect-metadata";
import { Request, Response } from "express";
import {
  BlogInputModel,
  BlogViewModel,
  PostInputModel,
  PostViewModel,
} from "../../input-output-types";
import { BlogRepository } from "./blogRepository";
import {
  IQuery,
  isValidObjectId,
  normolizedQuery,
} from "../../utils/query-helper";
import { BlogQueryRepository } from "./blogQueryRepository";
import { injectable } from "inversify";

@injectable()
export class BlogController {
  constructor(
    protected blogRepository: BlogRepository,
    protected blogQueryRepository: BlogQueryRepository,
  ) {}
  async create(
    req: Request<{}, {}, BlogInputModel>,
    res: Response<BlogViewModel>,
  ) {
    const newBlogId = await this.blogRepository.create(req.body);
    const newBlog = await this.blogRepository.findAndMap(newBlogId.toString());
    newBlog ? res.status(201).json(newBlog) : res.sendStatus(400);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await this.blogRepository.delete(id);
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  }

  async find(req: Request<{ id: string }>, res: Response<BlogViewModel | {}>) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await this.blogRepository.find(id);
    if (data) res.status(200).json(data);
    else res.sendStatus(404);
  }

  async get(req: Request<{}, {}, {}, IQuery>, res: Response<any>) {
    const query = normolizedQuery(req.query);
    const data = await this.blogQueryRepository.getAll(query);
    res.status(200).json(data);
  }

  async getPostsInBlog(
    req: Request<{ id: string }, {}, {}, IQuery>,
    res: Response<any>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const query = normolizedQuery(req.query);
    const data = await this.blogRepository.getPostsInBlog(
      id,
      query,
      req?.userId,
    );
    data ? res.status(200).json(data) : res.sendStatus(404);
  }

  async createPostInBlog(
    req: Request<{ id: string }, {}, PostInputModel>,
    res: Response<PostViewModel>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await this.blogRepository.postPostsInBlog(id, req.body);
    data ? res.status(201).json(data) : res.sendStatus(400);
  }

  async update(
    req: Request<{ id: string }, {}, BlogInputModel>,
    res: Response,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const result = await this.blogRepository.put({ ...req.body }, id);
    // console.log(result, 'final')
    if (result) res.sendStatus(204);
    else res.sendStatus(404);
  }
}

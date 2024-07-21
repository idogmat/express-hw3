import { Request, Response } from "express";
import { IQuery, normolizedQuery } from "../../../utils/query-helper";
import { BlogQueryRepository } from "../blogQueryRepository";

export const getBlogsController = async (
  req: Request<{}, {}, {}, IQuery>,
  res: Response<any>,
) => {
  const query = normolizedQuery(req.query);
  const data = await BlogQueryRepository.getAll(query);
  res.status(200).json(data);
};

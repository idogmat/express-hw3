import { Request, Response } from "express";
import { IQuery, normolizedQuery } from "../../../utils/query-helper";
import { UserQueryRepository } from "../userQueryRepository";

export const getController = async (
  req: Request<any, any, any, IQuery>,
  res: Response<any>,
) => {
  const query = normolizedQuery(req.query);
  const data = await UserQueryRepository.getAll(query);
  res.status(200).json(data);
};

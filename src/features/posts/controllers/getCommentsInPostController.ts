import { Request, Response } from "express";
import { IQuery, normolizedQuery } from "../../../utils/query-helper";
import { CommentViewModel } from "../../../input-output-types/comment-types";
import { IReturnQueryList } from "../../../input-output-types/query-types-output";
import { CommentRepository } from "../../comments/commentRepository";

export const getCommentsInPostController = async (
  req: Request<{ id: string }, {}, {}, IQuery>,
  res: Response<IReturnQueryList<CommentViewModel>>,
) => {
  const query = normolizedQuery(req.query);
  const data = await CommentRepository.getAll(req.params.id, query);
  res.status(200).json(data);
};

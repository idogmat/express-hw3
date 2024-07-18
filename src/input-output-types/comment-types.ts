import { CommentatorInfoType } from "../db/db";

export type CommentInputModel = {
  content: string;
}

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
}
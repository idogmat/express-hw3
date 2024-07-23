import { CommentatorInfoType } from "../db/comment";

export type CommentInputModel = {
  content: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  likesInfo: {
    like: number;
    dislike: number;
    myStatus: string;
  };
};

import { CommentatorInfoType } from "../db/comment";

export type CommentInputModel = {
  content: string;
};

export type CommentLikeStatus = {
  likeStatus: "None" | "Like" | "Dislike";
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

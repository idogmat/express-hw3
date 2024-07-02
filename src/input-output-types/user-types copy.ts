import { CommentatorInfoType } from "../db/db";


export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}
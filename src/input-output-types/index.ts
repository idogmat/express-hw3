import { BlogInputModel, BlogViewModel } from "./blog-types";
import { PostInputModel, PostViewModel } from "./posts-types";
import { CommentInputModel, CommentViewModel } from "./comment-types";
import { UserViewModel } from "./user-types";
import { DeviceInputModel, DeviceViewModel } from "./device-types";

interface IReturnQueryList<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

type IBlogViewModelAfterQuery = IReturnQueryList<BlogViewModel>;

type IBlogWithPostsViewModelAfterQuery = IReturnQueryList<PostViewModel>;

type IUserViewModelAfterQuery = IReturnQueryList<UserViewModel>;

export {
  BlogInputModel,
  BlogViewModel,
  PostInputModel,
  PostViewModel,
  CommentInputModel,
  CommentViewModel,
  UserViewModel,
  DeviceInputModel,
  DeviceViewModel,
  IReturnQueryList,
  IBlogViewModelAfterQuery,
  IBlogWithPostsViewModelAfterQuery,
  IUserViewModelAfterQuery,
};

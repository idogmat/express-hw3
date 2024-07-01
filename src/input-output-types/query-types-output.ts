import { BlogViewModel } from "./blogs-types"
import { PostViewModel } from "./posts-types"

export interface IReturnQueryList<T> {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: T[]
}

export type IBlogViewModelAfterQuery = IReturnQueryList<BlogViewModel>

export type IBlogWithPostsViewModelAfterQuery = IReturnQueryList<PostViewModel>
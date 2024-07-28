import "reflect-metadata";
import {
  PostInputModel,
  PostViewModel,
  IBlogWithPostsViewModelAfterQuery,
} from "../../input-output-types";
import { Types } from "mongoose";
import { blogCollection, postCollection, PostTypeBD } from "../../db";
import {
  INormolizedQuery,
  IQueryBlogWithPostsFilterTypeBD,
} from "../../utils/query-helper";
import { injectable } from "inversify";
import { getCurrentStatus, getLikeCount } from "../../utils/like-transform";

@injectable()
export class PostQueryRepository {
  async getAll(query: INormolizedQuery, userId?: string) {
    const totalCount = await postCollection.find().countDocuments();

    const posts = await postCollection
      .find({})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);

    const queryForMap: IQueryBlogWithPostsFilterTypeBD = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: posts,
    };
    return this.mapAfterQuery(queryForMap, userId);
  }

  map(post: PostTypeBD, userId?: string) {
    const postForOutput: PostViewModel = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: getLikeCount(post.likesInfo.additionalLikes, "Like"),
        dislikesCount: getLikeCount(
          post.likesInfo.additionalLikes,
          "Dislike"),
        myStatus: getCurrentStatus(
          post.likesInfo.additionalLikes,
          userId || ""),
      newestLikes: post.likesInfo?.newestLikes?.length ? post.likesInfo.newestLikes.filter((e,i) => i < 3) : []
      },
    };
    return postForOutput;
  }

  mapAfterQuery(blogs: IQueryBlogWithPostsFilterTypeBD, userId?: string) {
    const blogWithPostsForOutput: IBlogWithPostsViewModelAfterQuery = {
      ...blogs,
      items: blogs.items.map((b) => this.map(b, userId)),
    };
    return blogWithPostsForOutput;
  }
}

import { BlogViewModel } from "../../input-output-types";
import { INormolizedQuery } from "../../utils/query-helper";
import { blogCollection, BlogTypeBD } from "../../db";
import {
  IBlogViewModelAfterQuery,
  IReturnQueryList,
} from "../../input-output-types";

export class BlogQueryRepository {
  static async getAll(query: INormolizedQuery) {
    const totalCount = await blogCollection
      .find({
        name: { $regex: new RegExp(`^${query.searchNameTerm || ""}`, "i") },
      })
      .countDocuments();

    const blogs = await blogCollection
      .find({
        name: { $regex: new RegExp(`^${query.searchNameTerm || ""}`, "i") },
      })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const queryForMap = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: blogs,
    };
    return this.mapAfterQuery(queryForMap);
  }

  static map(blog: BlogTypeBD) {
    const blogForOutput: BlogViewModel = {
      id: blog._id.toString(),
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      name: blog.name,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    return blogForOutput;
  }

  static mapAfterQuery(blogs: IReturnQueryList<BlogTypeBD>) {
    const blogForOutput: IBlogViewModelAfterQuery = {
      ...blogs,
      items: blogs.items.map((b: BlogTypeBD) => this.map(b)),
    };
    return blogForOutput;
  }
}

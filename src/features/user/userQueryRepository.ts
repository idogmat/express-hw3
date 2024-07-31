import { INormolizedQuery } from "../../utils/query-helper";
import { userCollection, UserTypeDB } from "../../db";
import {
  UserViewModel,
  IReturnQueryList,
  IUserViewModelAfterQuery,
} from "../../input-output-types";
import { injectable } from "inversify";

@injectable()
export class UserQueryRepository {
  async getAll(query: INormolizedQuery) {
    const filter = {
      $or: [
        {
          login: { $regex: new RegExp(`^${query.searchLoginTerm || ""}`, "i") },
        },
        {
          email: { $regex: new RegExp(`^${query.searchEmailTerm || ""}`, "i") },
        },
      ],
    };
    const totalCount = await userCollection.find(filter).countDocuments();
    const model = await userCollection
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const queryForMap = {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: model,
    };
    return this.mapAfterQuery(queryForMap);
  }

  map(user: UserTypeDB) {
    const userForOutput: UserViewModel = {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
    return userForOutput;
  }

  authMap(user: UserTypeDB) {
    const userForOutput = {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
    return userForOutput;
  }

  mapAfterQuery(users: IReturnQueryList<UserTypeDB>) {
    const userForOutput: IUserViewModelAfterQuery = {
      ...users,
      items: users.items.map((b: UserTypeDB) => this.map(b)),
    };
    return userForOutput;
  }
}

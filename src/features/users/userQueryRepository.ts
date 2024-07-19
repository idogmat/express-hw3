import { INormolizedQuery } from "../../utils/query-helper";
import { userCollection, UserTypeDB, UserTypeDBWithoutId } from "../../db/db";
import { UserViewModel } from "../../input-output-types/user-types";
import {
  IReturnQueryList,
  IUserViewModelAfterQuery,
} from "../../input-output-types/query-types-output";

export class UserQueryRepository {
  static async getAll(query: INormolizedQuery) {
    const filter = {
      $or: [
        { login: { $regex: new RegExp(`^${query.searchLoginTerm}`, "i") } },
        { email: { $regex: new RegExp(`^${query.searchEmailTerm}`, "i") } },
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

  static map(user: UserTypeDB) {
    const userForOutput: UserViewModel = {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
    return userForOutput;
  }

  static authMap(user: UserTypeDB) {
    const userForOutput = {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
    return userForOutput;
  }

  static mapAfterQuery(users: IReturnQueryList<UserTypeDB>) {
    const userForOutput: IUserViewModelAfterQuery = {
      ...users,
      items: users.items.map((b: UserTypeDB) => this.map(b)),
    };
    return userForOutput;
  }
}

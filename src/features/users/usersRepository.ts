
import { ObjectId } from 'mongoose';
import { INormolizedQuery } from '../../utils/query-helper';
import { userCollection, UserTypeDB, UserTypeDBWithoutId } from '../../db/db';
import { UserViewModel } from '../../input-output-types/user-types copy';
import { IReturnQueryList, IUserViewModelAfterQuery } from '../../input-output-types/query-types-output';
import mongoose from 'mongoose';

class User {
  constructor(public user: UserTypeDBWithoutId) {}
}

export class UserRepository {
  static async create(user: UserTypeDBWithoutId) {
    const model = await new userCollection({
      ...user
    });
    const result = await model.save();
    console.log(result);

    return result;
  }
  static async findById(id: string) {
    const model = await userCollection.findById(id);
    console.log(model);
    return model;
  }
  static async findByLoginOrEmail(login: string, email: string): Promise<UserTypeDB | null> {
    const model = await userCollection.findOne<UserTypeDB | null>({
      $or: [
        { email: email },
        { login: login }
      ]
    });
    return model;
  }
  static async delete(id: any) {
    const result = await userCollection.deleteOne({ _id: id});
    console.log(result)
    return result.deletedCount;
  }
  static async getAll(query: INormolizedQuery) {
    const filter = {
      $or: [
        { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
        { email: { $regex: query.searchEmailTerm || '', $options: 'i' } }
      ]
    };
    const totalCount = await userCollection.find(filter).countDocuments();
    const model = await userCollection.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
      const queryForMap = {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: totalCount,
        items: model
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
      items: users.items.map((b: any) => this.map(b))
    };
    return userForOutput;
  }
}

// export const usersRepository = {
//   async create(user: UserTypeDBWithoutId): Promise<any> {
//     const result = await userCollection.insertOne(user as UserTypeDB)
//     if (result.insertedId) {
//       const userInfo = await this.find(result.insertedId);
//       return userInfo;
//     } else {
//       return false;
//     }
//   },
//   async find(id: ObjectId) {
//     const result = await userCollection.findOne({ _id: new ObjectId(id) });
//     return result;
//   },
//   async delete(id: ObjectId) {
//     const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
//     return result.deletedCount;
//   },
//   async getAll(query: INormolizedQuery) {
//     const filter = {
//         $or: [
//           { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
//           { email: { $regex: query.searchEmailTerm || '', $options: 'i' } }
//         ]
//       };
//     const totalCount = await userCollection
//       .find(filter).toArray();
//     const users = await userCollection
//       .find(filter)
//       .sort({ [query.sortBy]: query.sortDirection })
//       .skip((query.pageNumber - 1) * query.pageSize)
//       .limit(query.pageSize).toArray();
//     const queryForMap = {
//       pagesCount: Math.ceil(totalCount.length / query.pageSize),
//       page: query.pageNumber,
//       pageSize: query.pageSize,
//       totalCount: totalCount.length,
//       items: users
//     };
//     return this.mapAfterQuery(queryForMap);
//   },
//   async findByLoginOrEmail(login: string, email: string): Promise<UserTypeDB | null> {
//     const user = await userCollection.findOne<UserTypeDB | null>({
//       $or: [
//         { email: email },
//         { login: login }
//       ]
//     });
//     return user;
//   },
//   map(user: UserTypeDB) {
//     const userForOutput: UserViewModel = {
//       id: user._id.toString(),
//       login: user.login,
//       email: user.email,
//       createdAt: user.createdAt,
//     };
//     return userForOutput;
//   },
//   authMap(user: UserTypeDB) {
//     const userForOutput = {
//       userId: user._id.toString(),
//       login: user.login,
//       email: user.email,
//     };
//     return userForOutput;
//   },
//   mapAfterQuery(users: IReturnQueryList<UserTypeDB>) {
//     const userForOutput: IUserViewModelAfterQuery = {
//       ...users,
//       items: users.items.map((b: any) => this.map(b))
//     };
//     return userForOutput;
//   },
// }
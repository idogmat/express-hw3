
import { ObjectId } from 'mongodb';
import { userCollection } from '../../app';
import { INormolizedQuery } from '../../utils/query-helper';
import { UserTypeDB, UserTypeDBWithoutId } from '../../db/db';
import { UserViewModel } from '../../input-output-types/user-types copy';
import { IReturnQueryList, IUserViewModelAfterQuery } from '../../input-output-types/query-types-output';



export const usersRepository = {
  async create(user: UserTypeDBWithoutId): Promise<any> {
    const result = await userCollection.insertOne(user as UserTypeDB)
    if (result.insertedId) {
      const userInfo = await this.find(result.insertedId)
      return userInfo
    } else {
      return false
    }
  },
  async find(id: ObjectId) {
    const result = await userCollection.findOne({ _id: new ObjectId(id) })
    return result
  },
  async delete(id: ObjectId) {
    const result = await userCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount
  },
  async getAll(query: INormolizedQuery) {
    const filter = {
        $or: [
          { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
          { email: { $regex: query.searchEmailTerm || '', $options: 'i' } }
        ]
      }
    const totalCount = await userCollection
      .find(filter).toArray()
    const users = await userCollection
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize).toArray()
    const queryForMap = {
      pagesCount: Math.ceil(totalCount.length / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount.length,
      items: users
    }
    return this.mapAfterQuery(queryForMap);
  },
  async findByLoginOrEmail(login: string, email: string): Promise<UserTypeDB | null> {
    const user = await userCollection.findOne<UserTypeDB | null>({
      $or: [
        { email: email },
        { login: login }
      ]
    })
    return user
  },
  map(user: UserTypeDB) {
    const blogForOutput: UserViewModel = {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }
    return blogForOutput
  },
  mapAfterQuery(users: IReturnQueryList<UserTypeDB>) {
    const blogForOutput: IUserViewModelAfterQuery = {
      ...users,
      items: users.items.map((b: any) => this.map(b))
    }
    return blogForOutput
  },
}
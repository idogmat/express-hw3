
import { ObjectId } from 'mongodb';
import { userCollection } from '../../app';

type UserDBType = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
}

export const authRepository = {
  async create(user: any): Promise<any> {
    const result = await userCollection.insertOne(user)
    if (result.insertedId) {
      const userInfo = await this.find(result.insertedId)
      // console.log(userInfo)

      return userInfo
    } else {
      false
    }
  },
  async find(id: ObjectId) {
    const result = await userCollection.findOne({ _id: new ObjectId(id) })
    return result
  },
  async findRefreshTokenUserId(refreshToken: string) {
    const result = await userCollection.findOne({refreshToken})
    return result
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    const user = await userCollection.findOne({
      $or: [
        { email: loginOrEmail },
        { login: loginOrEmail }
      ]
    })
    // console.log(user)
    return user
  }
}
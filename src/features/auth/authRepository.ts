
import { ObjectId } from 'mongodb';
import { userCollection } from '../../app';

type UserDBType = {
  _id: ObjectId;
  userName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
}

export const authRepository = {
  async create(user: UserDBType): Promise<any> {
    const result = await userCollection.insertOne(user)
    if (result.insertedId) {
      const userInfo = await this.find(result.insertedId)
      console.log(userInfo)

      return userInfo
    } else {
      false
    }
  },
  async find(id: ObjectId) {
    const result = await userCollection.findOne({ _id: new ObjectId(id) })
    return result
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    const user = await userCollection.findOne<UserDBType | null>({
      $or: [
        { email: loginOrEmail },
        { userName: loginOrEmail }
      ]
    })
    return user
  }
}
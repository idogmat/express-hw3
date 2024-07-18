
import { Types, ObjectId } from "mongoose";
import { userCollection } from '../../app';
import { UserTypeDB } from "../../db/db";
import { UserRepository } from "../users/usersRepository";


export const authRepository = {
  async create(user: UserTypeDB): Promise<any> {
    const result = await UserRepository.create(user)
    if (result) {
      return result
    } else {
      false
    }
  },
  async find(id: string) {
    const result = await UserRepository.findById(id)
    return result
  },
  async findRefreshTokenUserId(refreshToken: string) {
    const result = await userCollection.findOne({refreshToken})
    return result
  },
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserTypeDB | null> {
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
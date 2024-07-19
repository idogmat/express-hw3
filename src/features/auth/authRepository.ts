import { userCollection, UserTypeDB } from "../../db/db";
import { UserRepository } from "../users/userRepository";

export class AuthRepository {
  static async create(user: UserTypeDB): Promise<any> {
    const result = await UserRepository.create(user);
    if (result) {
      return result;
    } else {
      false;
    }
  }

  static async find(id: string) {
    const result = await UserRepository.findById(id);
    return result;
  }

  static async findRefreshTokenUserId(refreshToken: string) {
    const result = await userCollection.findOne({ refreshToken });
    return result;
  }

  static async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserTypeDB | null> {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    // console.log(user)
    return user;
  }
}

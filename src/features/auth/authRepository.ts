import { userCollection, UserTypeDB } from "../../db";
import { IPasswordFields } from "../../services/auth.service";
import { UserRepository } from "../user/userRepository";

export class AuthRepository {
  static async create(user: UserTypeDB): Promise<any> {
    const result = await UserRepository.create(user);
    if (result) {
      return result;
    } else {
      return false;
    }
  }

  static async setNewPassword(
    id: string,
    { passwordHash, passwordSalt }: IPasswordFields,
  ): Promise<any> {
    const result = await UserRepository.findById(id);
    if (result) {
      result.set({ passwordHash });
      result.set({ passwordSalt });
      result.set({ recoveryCode: "" });
      await result.save();
      return result;
    } else {
      return false;
    }
  }

  static async find(id: string) {
    const result = await UserRepository.findById(id);
    return result;
  }

  static async setRecoveryCode(id: string, recoveryCode: string) {
    const result = await userCollection.findById(id);
    if (!result) return false;
    result?.set({ recoveryCode });
    await result.save();
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

  static async findByEmail(email: string): Promise<UserTypeDB | null> {
    const model = await userCollection.findOne<UserTypeDB | null>({
      email: email,
    });
    return model;
  }
}

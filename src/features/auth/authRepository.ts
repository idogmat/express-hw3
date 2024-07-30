import "reflect-metadata";
import { userCollection, UserTypeDB } from "../../db";
import { IPasswordFields } from "../../services/auth.service";
import { injectable } from "inversify";

@injectable()
export class AuthRepository {
  async create(user: Omit<UserTypeDB, '_id'>): Promise<any> {
    const model = await new userCollection(user);
    const result = await model.save();
    if (result) {
      return result;
    } else {
      return false;
    }
  }

  async setNewPassword(
    id: string,
    { passwordHash, passwordSalt }: IPasswordFields,
  ): Promise<any> {
    const result = await userCollection.findById(id);
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

  async find(id: string) {
    const result = await userCollection.findById(id);
    return result;
  }

  async setRecoveryCode(id: string, recoveryCode: string) {
    const result = await userCollection.findById(id);
    if (!result) return false;
    result?.set({ recoveryCode });
    await result.save();
    return result;
  }

  async findRefreshTokenUserId(refreshToken: string) {
    const result = await userCollection.findOne({ refreshToken });
    return result;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserTypeDB | null> {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    // console.log(user)
    return user;
  }

  async findByLoginAndEmail(
    login: string,
    email: string,
  ): Promise<UserTypeDB | null> {
    const model = await userCollection.findOne<UserTypeDB | null>({
      $or: [{ email: email }, { login: login }],
    });
    return model;
  }

  async findByEmail(email: string): Promise<UserTypeDB | null> {
    const model = await userCollection.findOne<UserTypeDB | null>({
      email: email,
    });
    return model;
  }

  authMap(user: UserTypeDB) {
    const userForOutput = {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
    return userForOutput;
  }
}

// export const authRepository = new AuthRepository();

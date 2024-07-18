import { ObjectId } from "mongoose";
import { INormolizedQuery } from "../../utils/query-helper";
import { userCollection, UserTypeDB, UserTypeDBWithoutId } from "../../db/db";

export class UserRepository {
  static async create(user: UserTypeDBWithoutId) {
    const model = await new userCollection({
      ...user,
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
  static async findByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserTypeDB | null> {
    const model = await userCollection.findOne<UserTypeDB | null>({
      $or: [{ email: email }, { login: login }],
    });
    return model;
  }
  static async delete(id: string) {
    const result = await userCollection.deleteOne({ _id: id });
    console.log(result);
    return result.deletedCount;
  }
  static authMap(user: UserTypeDB) {
    const userForOutput = {
      userId: user._id.toString(),
      login: user.login,
      email: user.email,
    };
    return userForOutput;
  }
}

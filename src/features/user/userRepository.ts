import { userCollection, UserTypeDB } from "../../db";
import { injectable } from "inversify";

@injectable()
export class UserRepository {
  async create(user: Omit<UserTypeDB, "_id">) {
    const model = await new userCollection(user);
    const result = await model.save();
    console.log(result);
    return result;
  }

  async findById(id: string) {
    const model = await userCollection.findById(id);
    console.log(model);
    return model;
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

  async delete(id: string) {
    const result = await userCollection.deleteOne({ _id: id });
    console.log(result);
    return result.deletedCount;
  }
}

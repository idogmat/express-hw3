import { Request, Response } from "express";
import { UserRepository } from "./userRepository";
import { AuthService } from "../../services/auth.service";
import { UserQueryRepository } from "./userQueryRepository";
import { IQuery, isValidObjectId, normolizedQuery } from "../../utils/query-helper";

interface ICreateUserFields {
  login: string;
  email: string;
  password: string;
}

export class UserController {
  static async create(
    req: Request<{}, {}, ICreateUserFields>,
    res: Response<any>,
  ): Promise<any> {
    const { login, email, password } = req.body;
    const userFound = await UserRepository.findByLoginOrEmail(login, email);
    if (userFound?._id) return res.sendStatus(404);
    const user = await AuthService.createUser({ login, email, password });
    const result = await UserRepository.create({
      ...user,
      emailConfirmation: { ...user.emailConfirmation, isConfirmed: true },
    });
    // const code = user.emailConfirmation.confirmationCode;
    // try {
    //   await EmailService.sendMail(result.login, result.email, code)
    // } catch (error) {
    //   console.error('Send email error', error);
    // }
    if (result) res.status(201).json(UserQueryRepository.map(result));
    else res.sendStatus(400);
  };

  static async get(
    req: Request<any, any, any, IQuery>,
    res: Response<any>,
  ) {
    const query = normolizedQuery(req.query);
    const data = await UserQueryRepository.getAll(query);
    res.status(200).json(data);
  };

  static async delete (
    req: Request<{ id: string }, unknown, unknown, IQuery>,
    res: Response<any>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await UserRepository.delete(id);
    if (data) res.sendStatus(204);
    else res.sendStatus(404);
  };

}
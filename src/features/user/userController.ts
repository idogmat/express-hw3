import "reflect-metadata";
import { Request, Response } from "express";
import { UserRepository } from "./userRepository";
import { AuthService } from "../../services/auth.service";
import { UserQueryRepository } from "./userQueryRepository";
import {
  IQuery,
  isValidObjectId,
  normolizedQuery,
} from "../../utils/query-helper";
import { injectable } from "inversify";

interface ICreateUserFields {
  login: string;
  email: string;
  password: string;
}

@injectable()
export class UserController {
  constructor(
    protected authService: AuthService,
    protected userRepository: UserRepository,
    protected userQueryRepository: UserQueryRepository,
  ) {}
  async create(
    req: Request<{}, {}, ICreateUserFields>,
    res: Response<any>,
  ): Promise<any> {
    const { login, email, password } = req.body;
    const userFound = await this.userRepository.findByLoginAndEmail(
      login,
      email,
    );
    if (userFound?._id) return res.sendStatus(404);
    const user = await this.authService.createUser({ login, email, password });
    const result = await this.userRepository.create({
      ...user,
      emailConfirmation: { ...user.emailConfirmation, isConfirmed: true },
    });
    // const code = user.emailConfirmation.confirmationCode;
    // try {
    //   await EmailService.sendMail(result.login, result.email, code)
    // } catch (error) {
    //   console.error('Send email error', error);
    // }
    if (result) res.status(201).json(this.userQueryRepository.map(result));
    else res.sendStatus(400);
  }

  async get(req: Request<any, any, any, IQuery>, res: Response<any>) {
    const query = normolizedQuery(req.query);
    const data = await this.userQueryRepository.getAll(query);
    res.status(200).json(data);
  }

  async delete(
    req: Request<{ id: string }, unknown, unknown, IQuery>,
    res: Response<any>,
  ) {
    const id = isValidObjectId(req.params.id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const data = await this.userRepository.delete(id);
    if (data) res.sendStatus(204);
    else res.sendStatus(404);
  }
}

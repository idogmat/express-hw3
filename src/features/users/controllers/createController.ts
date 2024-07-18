import { Response, Request } from "express";
import { UserRepository } from "../userRepository";
import { AuthService } from "../../../services/auth.service";
import { UserQueryRepository } from "../userQueryRepository";
export interface ICreateUserFields {
  login: string;
  email: string;
  password: string;
}

export const createController = async (
  req: Request<{}, {}, ICreateUserFields>,
  res: Response<any>,
): Promise<any> => {
  const { login, email, password } = req.body;
  const userFound = await UserRepository.findByLoginOrEmail(login, email);
  if (userFound?._id) return res.sendStatus(404);
  const user = await AuthService.createUser({ login, email, password });
  const result = await UserRepository.create({
    ...user,
    emailConfirmation: { ...user.emailConfirmation, isConfirmed: true },
  });
  const code = user.emailConfirmation.confirmationCode;
  // try {
  //   await emailService.sendMail(result.login, result.email, code)
  // } catch (error) {
  //   console.error('Send email error', error);
  // }
  if (result) res.status(201).json(UserQueryRepository.map(result));
  else res.sendStatus(400);
};

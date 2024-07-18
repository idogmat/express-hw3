import { Request, Response } from "express";
import { UserRepository } from "../../users/usersRepository";
import { AuthService } from "../../../services/auth.service";

export interface ICreateUserFields {
  login: string;
  email: string;
  password: string
}

export const registrationController = async (req: Request<{}, {}, ICreateUserFields>, res: Response<any>): Promise<any> => {
  const { login, email, password } = req.body;
  const userFound = await UserRepository.findByLoginOrEmail(login, email);
  if(userFound?._id) return res.sendStatus(400);
  const user = await AuthService.createUser({ login, email, password });
  // console.log(user)
  const result = await UserRepository.create(user);
  const code = user.emailConfirmation.confirmationCode;
  console.log(result)
  try {
    // emailService.sendMail(result.login, result.email, code);
  } catch (error) {
    console.error('Send email error', error);
  }
  if (result) res.status(204).json(UserRepository.map(result));
  else res.sendStatus(400);
}
import { Request, Response } from "express";
import { usersRepository } from "../../users/usersRepository";
import { authService } from "../../../utils/authService";
import { emailService } from "../../../utils/emailService";

export interface ICreateUserFields {
  login: string;
  email: string;
  password: string
}

export const registrationController = async (req: Request<{}, {}, ICreateUserFields>, res: Response<any>): Promise<any> => {
  const { login, email, password } = req.body;
  const userFound = await usersRepository.findByLoginOrEmail(login, email);
  if(userFound?._id) return res.sendStatus(400);
  const user = await authService.createUser({ login, email, password });
  console.log(user)
  const result = await usersRepository.create(user);
  const code = user.emailConfirmation.confirmationCode;
  try {
    await emailService.sendMail(result.login, result.email, code);
  } catch (error) {
    console.error('Send email error', error);
  }
  if (result) res.status(204).json(usersRepository.map(result));
  else res.sendStatus(400);
}
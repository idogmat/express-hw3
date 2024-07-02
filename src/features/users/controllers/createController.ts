import { Response, Request } from 'express'
import { usersRepository } from '../usersRepository';
import { authService } from '../../../utils/authService';
import { emailService } from '../../../utils/emailService';
import {randomUUID} from "crypto";
import { dateSetter } from '../../../utils/date-methods';
import { UserTypeDB } from '../../../db/db';
export interface ICreateUserFields {
  login: string;
  email: string;
  password: string
}

export const createController = async (req: Request<{}, {}, ICreateUserFields>, res: Response<any>): Promise<any> => {
  const { login, email, password } = req.body
  const userFound = await usersRepository.findByLoginOrEmail(login, email)
  if(userFound?._id) return res.sendStatus(404)
  const user = await authService.createUser({ login, email, password })
  console.log(user)
  const result = await usersRepository.create(user)
  // const link = `http://localhost:8080/confirm-email?code${user.emailConfirmation.confirmationCode}`
  // try {
  //   await emailService.sendMail(result.login, result.email, link)
  // } catch (error) {
  //   console.error('Send email error', error);
  // }
  if (result) res.status(201).json(usersRepository.map(result))
  else res.sendStatus(400)
}
import { Response, Request } from "express";
import { AuthRepository } from "../authRepository";
import { EmailService } from "../../../services/email.service";
import { randomUUID } from "crypto";
import { JwtService } from "../../../services/jwt.service";
interface IEmail {
  email: string
}

export const passwordRecoveryController = async (
  req: Request<{}, IEmail>,
  res: Response<any>,
) => {
  const user = await AuthRepository.findByEmail(req.body.email);
  if (!user) return res.sendStatus(204);
  const code = await JwtService.createRecoveryCode(user._id.toString());
  await AuthRepository.setRecoveryCode(user._id.toString(), code)
  await EmailService.sendMailPasswordRecovery(user.login, user.email, code);
  // return res.status(200).json(code)
  return res.sendStatus(204);
};

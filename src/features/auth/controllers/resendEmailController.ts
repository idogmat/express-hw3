import { Response, Request } from 'express'
import { userCollection } from '../../../app';
import { emailService } from '../../../services/email.service';
import { AuthService } from '../../../services/auth.service';

interface IEmail {
  email: string;
}

export const resendEmailController = async (req: Request<{}, {}, IEmail>, res: Response<any>) => {
  const user = await userCollection.findOne({email: req.body.email});
  if (user) {
    // let code = user.emailConfirmation.confirmationCode;
    // if (user.emailConfirmation.expirationDate < new Date()) {
      const emailConfirmation = await AuthService.createConfirmCodeObject();
      await userCollection.findOneAndUpdate({ _id: user._id }, { $set: { emailConfirmation }});
      const code = emailConfirmation.confirmationCode
    // }
    await emailService.sendMail(user.login, user.email, code);
    return res.sendStatus(204);
  }
  return res.sendStatus(400);
}
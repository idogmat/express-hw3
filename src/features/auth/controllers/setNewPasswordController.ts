import { Response, Request } from "express";
import { AuthRepository } from "../authRepository";
import { AuthService } from "../../../services/auth.service";

interface INewPassword {
  newPassword: string;
  recoveryCode: string;
}

export const setNewPasswordController = async (
  req: Request<{}, INewPassword>,
  res: Response<any>,
) => {
  if (req.userId) {
    const password = await AuthService.createNewPassword(req.body.newPassword);
    const result = await AuthRepository.setNewPassword(req.userId, password);
    return res.sendStatus(204);
  } else {
    return res.sendStatus(204);
  }
};

import "reflect-metadata";
import { Request, Response } from "express";
import { deviceCollection, userCollection } from "../../db";
import mongoose, { Types } from "mongoose";
import { AuthService } from "../../services/auth.service";
import { JwtService } from "../../services/jwt.service";
import { DeviceRepository } from "../device/deviceRepository";
import { EmailService } from "../../services/email.service";
import { UserQueryRepository } from "../user/userQueryRepository";
import { UserRepository } from "../user/userRepository";
import { AuthRepository } from "./authRepository";
import { injectable } from "inversify";

interface ILoginFields {
  loginOrEmail: string;
  password: string;
}

interface ICreateUserFields {
  login: string;
  email: string;
  password: string;
}

interface INewPassword {
  newPassword: string;
  recoveryCode: string;
}

@injectable()
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected authRepository: AuthRepository,
    protected userQueryRepository: UserQueryRepository,
  ) {}
  async authMe(req: Request<{}, {}>, res: Response<any>) {
    const user = await userCollection.findOne({
      _id: new Types.ObjectId(req.userId),
    });
    if (user) return res.status(200).json(this.authRepository.authMap(user));
    else return res.sendStatus(401);
  }

  async confirmRegistration(
    req: Request<{}, {}, { code: string }>,
    res: Response<any>,
  ) {
    const user = await userCollection.findOne({
      $and: [
        { "emailConfirmation.confirmationCode": req.body.code },
        { "emailConfirmation.isConfirmed": false },
      ],
    });
    if (user) {
      const updated = await userCollection.findOneAndUpdate(
        { _id: user._id },
        { $set: { "emailConfirmation.isConfirmed": true } },
        { returnDocument: "after" },
      );
      if (updated?.emailConfirmation.isConfirmed) {
        return res.sendStatus(204);
      } else {
        return res.sendStatus(400);
      }
    }
    return res.sendStatus(400);
  }

  async login(
    req: Request<{}, {}, ILoginFields>,
    res: Response<any>,
  ): Promise<any> {
    if (!req.body.password || !req.body.loginOrEmail)
      return res.sendStatus(400);
    const loginOrEmail = req.body.loginOrEmail;
    const browser = req.get("user-agent");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const password = req.body.password;
    const { result, id } = await this.authService.checkCredential(
      loginOrEmail,
      password,
    );
    if (!result) {
      res.sendStatus(401);
      return;
    }
    const accessToken = await JwtService.createAccessToken(id);
    const session = await deviceCollection.findOne({
      userId: id,
      title: browser,
      ip: ip?.toString(),
    });
    if (session) {
      const refreshToken = await JwtService.createRefreshToken(
        id,
        browser,
        session.deviceId.toString(),
      );
      await DeviceRepository.update(session._id.toString(), refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
    } else {
      const deviceId = new mongoose.Types.ObjectId().toString();
      const refreshToken = await JwtService.createRefreshToken(
        id,
        browser,
        deviceId.toString(),
      );
      const device = {
        title: browser || "",
        userId: id,
        ip: ip?.toString() || "",
        deviceId,
        lastActiveDate: new Date().toISOString(),
        refreshToken,
      };
      await DeviceRepository.create(device);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
    }
    if (result) res.status(200).json({ accessToken });
    else res.sendStatus(401);
  }

  async logout(
    req: Request<{}, {}, ILoginFields>,
    res: Response<any>,
  ): Promise<any> {
    const id = req.userId;
    const oldRefreshToken = req.cookies.refreshToken;
    if (Types.ObjectId.isValid(id)) {
      const foundToken = await deviceCollection.findOne({
        refreshToken: oldRefreshToken,
      });
      if (!foundToken) return res.sendStatus(401);
      const result = await deviceCollection.deleteOne({ _id: foundToken._id });
      res.clearCookie("refreshToken", { httpOnly: true, secure: true });
      res.status(204).json({});
    } else {
      res.sendStatus(401);
    }
  }

  async passwordRecovery(
    req: Request<{}, { email: string }>,
    res: Response<any>,
  ) {
    const user = await this.authRepository.findByEmail(req.body.email);
    if (!user) return res.sendStatus(204);
    const code = await JwtService.createRecoveryCode(user._id.toString());
    await this.authRepository.setRecoveryCode(user._id.toString(), code);
    await EmailService.sendMailPasswordRecovery(user.login, user.email, code);
    return res.sendStatus(204);
  }

  async reftershToken(
    req: Request<{}, {}, {}>,
    res: Response<any>,
  ): Promise<any> {
    const id = req.userId;
    const oldRefreshToken = req.cookies.refreshToken;
    const browser = req.get("user-agent");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (Types.ObjectId.isValid(id)) {
      const session = await deviceCollection.findOne({
        refreshToken: oldRefreshToken,
      });
      if (!session) return res.sendStatus(401);
      const accessToken = await JwtService.createAccessToken(id);
      const refreshToken = await JwtService.createRefreshToken(
        id,
        browser,
        session.deviceId.toString(),
      );
      const result = await DeviceRepository.update(
        session._id.toString(),
        refreshToken,
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).json({ accessToken });
    } else {
      res.sendStatus(401);
    }
  }

  async registration(
    req: Request<{}, {}, ICreateUserFields>,
    res: Response<any>,
  ): Promise<any> {
    const { login, email, password } = req.body;
    const userFound = await this.authRepository.findByLoginAndEmail(
      login,
      email,
    );
    if (userFound?._id) return res.sendStatus(400);
    const user = await this.authService.createUser({ login, email, password });
    // console.log(user)
    const result = await this.authRepository.create(user);
    const code = user.emailConfirmation.confirmationCode;
    console.log(result);
    try {
      EmailService.sendMail(result.login, result.email, code);
    } catch (error) {
      console.error("Send email error", error);
    }
    if (result) res.status(204).json(this.userQueryRepository.map(result));
    else res.sendStatus(400);
  }

  async resendEmail(
    req: Request<{}, {}, { email: string }>,
    res: Response<any>,
  ) {
    const user = await userCollection.findOne({ email: req.body.email });
    if (user) {
      // let code = user.emailConfirmation.confirmationCode;
      // if (user.emailConfirmation.expirationDate < new Date()) {
      const emailConfirmation =
        await this.authService.createConfirmCodeObject();
      await userCollection.findOneAndUpdate(
        { _id: user._id },
        { $set: { emailConfirmation } },
      );
      const code = emailConfirmation.confirmationCode;
      // }
      await EmailService.sendMail(user.login, user.email, code);
      return res.sendStatus(204);
    }
    return res.sendStatus(400);
  }

  async setNewPassword(req: Request<{}, INewPassword>, res: Response<any>) {
    if (req.userId) {
      const password = await this.authService.createNewPassword(
        req.body.newPassword,
      );
      const result = await this.authRepository.setNewPassword(
        req.userId,
        password,
      );
      return res.sendStatus(204);
    } else {
      return res.sendStatus(204);
    }
  }
}

// export const authController = new AuthController();

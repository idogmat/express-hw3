import bcrypt from "bcrypt";
import { authRepository } from "../features/auth/authRepository";
import { randomUUID } from "crypto";
import { dateSetter } from "../utils/date-methods";
import { UserTypeDBWithoutId } from "../db/db";

export interface IAuthFields {
  login: string;
  email: string;
  password: string;
}

interface ICheckCredential {
  result: boolean;
  id: string;
}

export class AuthService {
  static async createUser({
    login,
    email,
    password,
  }: IAuthFields): Promise<UserTypeDBWithoutId> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      emailConfirmation: this.createConfirmCodeObject(),
    };
    return newUser;
  }

  static async checkCredential(
    loginOrEmail: string,
    password: string,
  ): Promise<ICheckCredential> {
    const user = await authRepository.findByLoginOrEmail(loginOrEmail);
    if (!user?._id) return { result: false, id: "" };
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    // or bcrypt.compare(password, user.passwordHash): return boolean
    return {
      result: user.passwordHash === passwordHash,
      id: user._id.toString(),
    };
  }

  static async checkRefreshToken(refreshToken: string): Promise<string | null> {
    const user = await authRepository.findRefreshTokenUserId(refreshToken);
    if (!user?._id) return null;
    return user?._id.toString();
  }

  static createConfirmCodeObject() {
    return {
      confirmationCode: randomUUID(),
      expirationDate: dateSetter(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      isConfirmed: false,
    };
  }

  static async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}

import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { dateSetter } from "../utils/date-methods";
import { AuthRepository } from "../features/auth/authRepository";

export interface IPasswordFields {
  passwordHash: string;
  passwordSalt: string;
}

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
  constructor(protected authRepository: AuthRepository) {}
  async createUser({ login, email, password }: IAuthFields) {
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

  async createNewPassword(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    return {
      passwordHash,
      passwordSalt,
    };
  }

  async checkCredential(
    loginOrEmail: string,
    password: string,
  ): Promise<ICheckCredential> {
    const user = await this.authRepository.findByLoginOrEmail(loginOrEmail);
    if (!user?._id) return { result: false, id: "" };
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    // or bcrypt.compare(password, user.passwordHash): return boolean
    return {
      result: user.passwordHash === passwordHash,
      id: user._id.toString(),
    };
  }

  async checkRefreshToken(refreshToken: string): Promise<string | null> {
    const user = await this.authRepository.findRefreshTokenUserId(refreshToken);
    if (!user?._id) return null;
    return user?._id.toString();
  }

  createConfirmCodeObject() {
    return {
      confirmationCode: randomUUID(),
      expirationDate: dateSetter(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      isConfirmed: false,
    };
  }

  async _generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}

// export const authService = new AuthService();
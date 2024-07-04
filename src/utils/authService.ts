import bcrypt from 'bcrypt'
import { authRepository } from "../features/auth/authRepository";
import { UserTypeDB } from "../db/db";
import { randomUUID } from 'crypto';
import { dateSetter } from './date-methods';

export interface IAuthFields {
  login: string;
  email: string;
  password: string
}

interface ICheckCredential { 
  result: boolean;
  id: string
}

export const authService = {
  async createUser({ login, email, password }: IAuthFields) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)
    const newUser = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date(),
      emailConfirmation: this.createConfirmCodeObject(),
    }
    return newUser
  },
  async checkCredential(loginOrEmail: string, password: string): Promise<ICheckCredential> {
    const user = await authRepository.findByLoginOrEmail(loginOrEmail)
    if (!user?._id) return { result: false, id: '' }
    const passwordHash = await this._generateHash(password, user.passwordSalt)
    // or bcrypt.compare(password, user.passwordHash): return boolean
    return { result: user.passwordHash === passwordHash, id: user._id.toString() }

  },
  createConfirmCodeObject() {
    return {
      confirmationCode: randomUUID(),
      expirationDate: dateSetter(new Date(), {
          // hours: 1,
          // minutes: 30,
          seconds:5
      }),
      isConfirmed: false
    }
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
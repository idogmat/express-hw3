import { ObjectId } from "mongodb";
import { IAuthFields } from "../features/auth/controllers/createController";
import bcrypt from 'bcrypt'
import { authRepository } from "../features/auth/authRepository";
import { UserTypeDB } from "../db/db";

export const authService = {
  async createUser({ login, email, password }: IAuthFields) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHas(password, passwordSalt)
    const newUser = {
      login: login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date()
    }
    return newUser as UserTypeDB
  },
  async checkCredentiald(loginOrEmail: string, password: string) {
    const user = await authRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const passwordHash = await this._generateHas(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) {
      return false
    }
    return true
  },
  async _generateHas(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
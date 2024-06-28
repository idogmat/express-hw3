import { ObjectId } from "mongodb";
import { IAuthFields } from "./controllers/createController";
import bcrypt from 'bcrypt'
import { authRepository } from "./authRepository";

export const authService = {
  async createUser({ login, email, password }: IAuthFields) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHas(password, passwordSalt)
    const newUser = {
      _id: new ObjectId(),
      userName: login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date()
    }
    return authRepository.create(newUser)
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
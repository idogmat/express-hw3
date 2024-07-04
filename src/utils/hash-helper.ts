import bcrypt from 'bcrypt'


export const hashHelper = {
  async createPasswordHash(password: string ) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)
    return passwordHash
  },
  async checkCredentiald(passwordFromDB: string, password: string) {
    const result = await bcrypt.compare(password, passwordFromDB)
    return result
  },
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
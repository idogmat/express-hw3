import jwt from "jsonwebtoken";
import "dotenv/config";

export interface IAuthFields {
  login: string;
  email: string;
  password: string;
}

const ACCESS_SECRET = process.env.ACCESS_SECRET_TOKEN || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET_TOKEN || "";
const ACCESS_EXPIRATION = process.env.ACCESS_SECRET_TOKEN_EXPIRATION || "1h";
const REFRESH_EXPIRATION = process.env.REFRESH_SECRET_TOKEN_EXPIRATION || "1h";

export class JwtService {
  static async createAccessToken(id: string): Promise<string> {
    return jwt.sign({ userId: id }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRATION,
    });
  }

  static async createRefreshToken(
    id: string,
    browser?: string,
    deviceId?: string,
    ip?: string,
  ): Promise<string> {
    return jwt.sign({ userId: id, browser, deviceId, ip }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRATION,
    });
  }

  static async decodeToken(token: string) {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error(`Can't decode token`);
      return null;
    }
  }

  static async verifyToken(token: string, type: "refresh" | "accsess") {
    try {
      return await jwt.verify(
        token,
        type !== "accsess" ? REFRESH_SECRET : ACCESS_SECRET,
      );
    } catch (error) {
      console.error(`Can't verify token`);
      return null;
    }
  }
}

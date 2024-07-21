import { Response, Request, NextFunction } from "express";
import { SETTINGS } from "../settings";

export const fromBase64ToUTF8 = (code: string) => {
  const buff = Buffer.from(code, "base64");
  const decodedAuth = buff.toString("utf8");
  return decodedAuth;
};
export const fromUTF8ToBase64 = (code: string) => {
  const buff2 = Buffer.from(code, "utf8");
  const codedAuth = buff2.toString("base64");
  return codedAuth;
};

export const adminMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) => {
  const auth = req?.headers?.["authorization"] as string;
  if (!auth) {
    res.status(401).json({});
    return;
  }
  const token = auth.split(" ");

  if (token?.length !== 2 || token[0] !== "Basic") {
    res.status(401).json({});
    return;
  }

  const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);
  if (token[1] !== codedAuth) {
    res.status(401).json({});
    return;
  }
  next();
};

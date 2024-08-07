import { Response, Request, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import "dotenv/config";

// FIXME *
export enum StatusEnum {
  SUCCESS = "success",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
}

export const tokenAuthorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req?.headers?.["authorization"] as string;
  console.log(auth);
  if (!auth) {
    res.status(401).json({});
    return;
  }
  const token = auth.split(" ");

  if (token?.length !== 2 || token[0] !== "Bearer") {
    res.status(401).json({});
    return;
  }
  const info = await JwtService.verifyToken(token[1], "accsess");
  console.log(info);
  if (!info) {
    res.status(401).json({});
    return;
  }

  if (info instanceof Object) {
    if (info?.exp && info?.exp * 1000 >= Date.now()) {
      req.userId = info!.userId;
    } else {
      res.status(401).json({});
      return;
    }
  }
  next();
};

export const tokenAuthorizationWithoutThrowErrorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req?.headers?.["authorization"] as string;
  console.log(auth);
  if (auth) {
    const token = auth?.split(" ");
    try {
      const info = await JwtService.verifyToken(token[1], "accsess");
      if (info instanceof Object) {
        if (info?.exp && info?.exp * 1000 >= Date.now()) {
          req.userId = info!.userId;
        }
      }
    } catch (e) {}
  }
  next();
};

import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  FieldNamesType,
  OutputErrorsType,
} from "../input-output-types/output-errors-type";

export const inputCheckErrorsMiddleware = (
  req: Request<any, any, any, any>,
  res: Response<OutputErrorsType>,
  next: NextFunction,
) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    const eArray = e.array({ onlyFirstError: true }) as {
      path: FieldNamesType;
      msg: string;
    }[];

    if ((eArray as any).find((e: any) => e?.path === "id")) {
      res.sendStatus(404);
      return;
    }

    res.status(400).json({
      errorsMessages: eArray.map((x) => ({ field: x.path, message: x.msg })),
    });
    return;
  }
  next();
};

export const inputCheckErrorsMiddlewareParms = (
  req: Request<any, any, any, any>,
  res: Response<OutputErrorsType>,
  next: NextFunction,
) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    const eArray = e.array({ onlyFirstError: true }) as {
      path: FieldNamesType;
      msg: string;
    }[];
    res.status(404).json({
      errorsMessages: eArray.map((x) => ({ field: x.path, message: x.msg })),
    });
    return;
  }
  next();
};

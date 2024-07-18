export enum ResultCode {
  Success,
  NoContent,
  Unauthorize,
  Forbidden,
  BadRequest,
  NotFound,
}

export type Result<T> = {
  data: T;
  resultCode: ResultCode;
  errorMessage?: string;
};

export const handleSuccessResult = <T>(data: T): Result<T> => {
  return {
    data,
    resultCode: ResultCode.Success,
  };
};
export const handleForbiddenResult = (message: string): Result<null> => {
  return {
    data: null,
    resultCode: ResultCode.Forbidden,
  };
};
export const handleNotFoundResult = (message: string): Result<null> => {
  return {
    data: null,
    resultCode: ResultCode.NotFound,
  };
};

export const resultCodeToHttpException = (resultCode: ResultCode): number => {
  switch (resultCode) {
    case ResultCode.Unauthorize:
      return 401;
    case ResultCode.BadRequest:
      return 400;
    case ResultCode.Forbidden:
      return 403;
    case ResultCode.NoContent:
      return 204;
    case ResultCode.Success:
      return 200;
    default:
      return 500;
  }
};

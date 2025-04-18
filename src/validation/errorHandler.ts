import { NextFunction, Response } from "express";
import ApiError from "./ApiError";
import ErrorTypes from "./ErrorTypes";

function errorHandler(
  err: TypeError | ApiError | CustomError,
  _: Request,
  res: Response,
  __: NextFunction
) {
  let customError = err;

  console.log(err);

  if (!(err instanceof ApiError)) {
    customError = new CustomError(`Something went very wrong.`, ErrorTypes.InternalError);
  } else {
    customError = new CustomError(err.message, err.status);
  }

  // we are not using the next function to prvent from triggering
  // the default error-handler. However, make sure you are sending a
  // response to client to prevent memory leaks in case you decide to
  // NOT use, like in this example, the NextFunction .i.e., next(new Error())
  res.status((customError as CustomError).status).json(customError);
};

export default errorHandler;

export class CustomError {
  message!: string;
  status!: number;
  additionalInfo!: any;

  constructor(message: string, status: number = 500, additionalInfo: any = {}) {
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo
  }
}
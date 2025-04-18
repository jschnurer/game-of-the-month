import { Response } from "express";
import { cloneDeep } from "lodash";
import ICurrentUser from "~/auth/ICurrentUser";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";

export function getCurrentUser(response: Response<any, Record<string, any>>): ICurrentUser {
  return response.locals.user as ICurrentUser;
}

export function throwBadRequestIfMissingFields(obj: any, fields: string[]) {
  if (!obj) {
    throw new ApiError("Invalid request.", ErrorTypes.BadRequest);
  }

  const errors = fields.filter(x => obj[x] === null || obj[x] === undefined || obj[x] === '' || !obj[x].toString().trim())
    .map(x => `The field '${x}' is required.`);

  if (errors.length) {
    throw new ApiError(errors.join(' '), ErrorTypes.BadRequest);
  }
}

export function stripDownToProps(obj: any, fields: string[]): any {
  const newObj = cloneDeep(obj);

  Object.keys(newObj).forEach(x => {
    if (!fields.some(z => z === x)) {
      delete newObj[x];
    }
  });

  return newObj;
}

export function stripOutProps(obj: any, fields: string[]): any {
  const newObj = cloneDeep(obj);

  Object.keys(newObj).forEach(x => {
    if (fields.some(z => z === x)) {
      delete newObj[x];
    }
  });

  return newObj;
}
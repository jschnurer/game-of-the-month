export function isErrorValidationErrorResponse(error: any): error is IValidationErrorResponse {
  if (error.title !== undefined
    && error.type !== undefined
    && error.status !== undefined
    && error.errors !== undefined) {
    return true;
  }
  return false;
}

export function reduceValidationErrors(error: IValidationErrorResponse, separator: string = ' '): string {
  return Object.keys(error.errors)
    .flatMap(k => error.errors[k])
    .join(separator);
}

export function getResponseErrorMessage(err: any) {
  if (isErrorValidationErrorResponse(err)) {
    return reduceValidationErrors(err);
  } else if (err.message) {
    return err.message;
  } else {
    return err.toString();
  }
}

export default interface IValidationErrorResponse
{
  "type": string,
  "title": string,
  "status": number,
  "traceId": string,
  "errors": IValidationErrors,
}

export interface IValidationErrors {
  [property: string]: string[],
}
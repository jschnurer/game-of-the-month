import settings from "~/settings/settings";
import { isErrorValidationErrorResponse } from "./validationErrorHelpers";

export async function throwIfResponseError(response: Response) {
  if (response.status === 500) {
    await throwHttp500Error(response, "The server encountered a fatal error.");
  } else if (response.status === 400) {
    await throwResponseError(response, "The request sent to the server was invalid.");
  } else if (response.status === 401) {
    await throwResponseError(response, "The requested resource requires authentication to access.");
  } else if (response.status === 403) {
    await throwResponseError(response, "You do not have permission to access the requested resource.");
  } else if (response.status === 404) {
    await throwResponseError(response, "The requested resource was not found.");
  } else if (response.status < 200 || response.status > 299) {
    await throwResponseError(response, `Server returned ${response.statusText}.`);
  }
}

async function throwHttp500Error(response: Response, defaultErrorMsg: string) {
  let responseText: string = "";
  try {
    responseText = await response.text();
  } catch {
    throw new Error(defaultErrorMsg);
  }

  if (responseText) {
    throw new Error(responseText.split('\n')[0]);
  }

  throw new Error(defaultErrorMsg);
}

async function throwResponseError(response: Response, defaultErrorMsg: string) {
  let jsonResponse: any;

  try {
    jsonResponse = await response.json();
  } catch {
    throw new Error(defaultErrorMsg);
  }

  const jsonMsg: any = jsonResponse.message;

  if (isErrorValidationErrorResponse(jsonResponse)) {
    throw jsonResponse;
  } else if (jsonMsg) {
    throw new Error(jsonMsg);
  } else {
    throw new Error(defaultErrorMsg);
  }
}

export function encodeObjForUrl(obj: any) {
  if (!obj
    || typeof obj !== "object") {
    return undefined;
  }

  return encodeURIComponent(JSON.stringify(obj));
}

/** Combines the base api url with the path you specify. */
export function getApiUrl(relativePath: string) {
  return `${settings.apiUrl}/${relativePath}`;
}
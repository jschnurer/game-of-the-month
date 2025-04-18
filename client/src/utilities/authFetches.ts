import settings from "../settings/settings";

export const authFetch = async (url: string,
  method: string,
  accept: string,
  contentType: string,
  body?: any,
  abortSignal?: AbortSignal,
  extraHeaders?: Headers): Promise<Response> => {
  const headers = new Headers();
  headers.append("Content-Type", contentType);
  headers.append("Accept", accept);
  headers.append("Authorization", `Bearer ${localStorage.getItem(settings.localStorageTokenName)}`);

  if (extraHeaders) {
    extraHeaders.forEach((val, key) => {
      headers.append(key, val);
    });
  }

  return await fetch(url, {
    method,
    body: body !== undefined
      && body !== null
      ? JSON.stringify(body)
      : body,
    headers,
    signal: abortSignal,
  });
};

export const authGet = async (url: string) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem(settings.localStorageTokenName)}`);
  return await fetch(url, {
    method: "GET",
    headers,
  });
};

// Shortcut methods:
export const authGetJson = async (values: IFetchValues) =>
  authFetch(values.url, 'GET', 'application/json', 'application/json', undefined, values.abortSignal, values.extraHeaders);

export const authPostJson = async (values: IFetchValues) =>
  authFetch(values.url, 'POST', 'application/json', 'application/json', values.data, values.abortSignal, values.extraHeaders);

export const authPutJson = async (values: IFetchValues) =>
  authFetch(values.url, 'PUT', 'application/json', 'application/json', values.data, values.abortSignal, values.extraHeaders);

export const authPatchJson = async (values: IFetchValues) =>
  authFetch(values.url, 'PATCH', 'application/json', 'application/json', values.data, values.abortSignal, values.extraHeaders);

export const authDeleteJson = async (values: IFetchValues) =>
  authFetch(values.url, 'DELETE', 'application/json', 'application/json', undefined, values.abortSignal, values.extraHeaders);

export interface IFetchValues {
  url: string,
  /** This object will be JSON.stringified before sending to server. */
  data?: object,
  abortSignal?: AbortSignal,
  extraHeaders?: Headers,
}
import settings from "../local.settings.json";

export default settings;

export function getApiUrl(path: string) {
  return settings.apiUrl + path;
}
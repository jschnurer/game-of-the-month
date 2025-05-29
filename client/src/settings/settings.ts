import settings from "../local.settings.json";

export default settings;

export function getApiUrl(subPath?: string): string {
  return settings.apiUrl + (subPath ? subPath : "");
}
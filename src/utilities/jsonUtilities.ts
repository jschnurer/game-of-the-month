export function jsonRegexReviver(_: any, value: any) {
  if (typeof value === "string") {
    const match = value.toString().match(/\/(.+?)\/(.+)?/);
    if (match) {
      return new RegExp(match[1], match[2] || "");
    } else {
      return value;
    }
  }
  return value;
}
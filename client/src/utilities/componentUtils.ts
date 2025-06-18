export function concatClasses(classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
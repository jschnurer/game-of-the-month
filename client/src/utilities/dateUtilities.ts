const monthsLong = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const monthsShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function getMonthName(
  month: number | string,
  type: "long" | "short" = "short"
): string {
  const monthIndex =
    typeof month === "string" ? parseInt(month, 10) - 1 : month - 1;

  if (monthIndex < 0 || monthIndex > 11 || isNaN(monthIndex)) {
    return "Invalid Month";
  }

  return type === "long" ? monthsLong[monthIndex] : monthsShort[monthIndex];
}
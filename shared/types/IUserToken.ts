export default interface IUserToken {
  /** The guid representing this bearer token. */
  token: string,
  /** The date of expiration for this token (stored as a number). Use new Date(expirationDate) to get a date object. */
  expirationDate: number,
}
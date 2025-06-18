export default interface ICurrentUser {
  username: string,
  email: string,
  isAdmin: boolean,
  currentToken: string,
}
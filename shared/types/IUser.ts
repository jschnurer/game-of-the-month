import IUserToken from "./IUserToken";

export default interface IUser {
  _id: string,
  email: string,
  username: string,
  password: string,
  isAdmin: boolean,
  tokens?: IUserToken[],
  passwordReset?: {
    code: string,
    expirationDate: number,
  },
}
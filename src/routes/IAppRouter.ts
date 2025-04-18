import { IRouter } from "express";

export default interface IAppRouter {
  baseRoute: string,
  router: IRouter,
}
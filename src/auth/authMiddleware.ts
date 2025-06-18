import expressAsyncHandler from "express-async-handler";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";
import getUserFromToken from "./tokenValidation";

export default function configureAuthMiddleware(app: any, exposedRoutes: string[]) {
  // Check token unless it's the login route.
  app.use("{*splat}", expressAsyncHandler(async (req, res, next) => {
    const ix = exposedRoutes.indexOf(req.baseUrl.toLowerCase());
    const isExposedRoute = ix !== -1
      || (!req.baseUrl.toLowerCase().startsWith("/api")
        && !req.baseUrl.toLowerCase().startsWith("/static"));

    if (!isExposedRoute) {
      const authHeader = req.header("authorization") || "";

      // Require authentication key for all requests other than logging in.
      if (!authHeader.trim()
        || authHeader.indexOf("Bearer ") !== 0) {
        throw new ApiError("Unauthorized.", ErrorTypes.Unauthorized);
      }

      // Trim off "Bearer " from the header.
      const token = authHeader.substring(7);

      const user = await getUserFromToken(token);

      if (!user) {
        throw new ApiError("You must be logged in to access this resource.", ErrorTypes.Unauthorized);
      }

      // Provide the current user to all routes.
      res.locals.user = user;
    }

    next();
  }));
}
import express from "express";
import asyncHandler from "express-async-handler";
import { ObjectId } from "mongodb";
import { v4 } from "uuid";
import { getMongo } from "~/persistence/mongo";
import IUser from "~/shared/types/IUser";
import { getCurrentUser, throwBadRequestIfMissingFields } from "~/utilities/apiUtilities";
import { comparePassword } from "~/utilities/passwordUtilities";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////////////
// Login
router.post("/login", asyncHandler(async (req, res) => {
  throwBadRequestIfMissingFields(req.body, ["email", "password"]);

  const email = req.body.email?.trim();
  const password = req.body.password;

  if (!email
    || password === undefined) {
    throw new ApiError("Both email and password are required.", ErrorTypes.BadRequest);
  }

  const mongo = await getMongo("users");

  const user = await mongo.collection?.findOne<IUser>({ email: new RegExp("^" + email + "$", "i") });

  if (!user) {
    throw new ApiError(`Invalid username or password.`, ErrorTypes.Unauthorized);
  }

  const isCorrectPassword = comparePassword(password, user.password);

  if (!isCorrectPassword) {
    throw new ApiError(`Invalid username or password.`, ErrorTypes.Unauthorized);
  }

  const token = v4();

  const now = new Date();

  user.tokens = (user.tokens || [])
    .filter((x: any) => new Date(x.expirationDate) > now)
    .concat({
      token,
      expirationDate: new Date(now.setDate(now.getDate() + 17)).getTime(),
    });

  await mongo.collection?.replaceOne({ _id: new ObjectId(user._id) }, user);

  res.status(200).json({
    token,
    email,
  });
}));

////////////////////////////////////////////////////////////////////////////////////////////////
// Get information about me.
router.get("/", asyncHandler(async (_, res) => {
  const currentUser = getCurrentUser(res);

  res.json({
    email: currentUser.email,
    name: currentUser.name,
  });
}));

const meRouter = {
  baseRoute: "/me",
  router,
};

export default meRouter;
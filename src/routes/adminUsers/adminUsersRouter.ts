import express from "express";
import expressAsyncHandler from "express-async-handler";
import { getMongo, stringToObjectId } from "~/persistence/mongo";
import { stripDownToProps, stripOutProps, throwBadRequestIfMissingFields } from "~/utilities/apiUtilities";
import { hashPassword } from "~/utilities/passwordUtilities";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";
import IAppRouter from "../IAppRouter";

const router = express.Router();

// Ensure anyone accessing this router is an admin.
// router.use("*", (_, res, next) => {
//   if (!getCurrentUser(res).isAdmin) {
//     throw new ApiError("Forbidden", ErrorTypes.Forbidden);
//   }

//   next();
// });

// Get users.
router.get("/", expressAsyncHandler(async (_, res) => {
  const mongo = await getMongo("users");

  const users = await mongo.collection.find({}, {
    projection: {
      _id: 1,
      name: 1,
      email: 1,
      isAdmin: 1,
      isDisabled: 1,
    },
  }).toArray();

  res.status(200).json(users);
}));

// Create a new user.
router.post("/", expressAsyncHandler(async (req, res) => {
  throwBadRequestIfMissingFields(req.body, ["email", "name", "passwordPlain", "isAdmin"]);
  const newUser = bodyToNewUser(req.body);

  const mongo = await getMongo("users");

  const existingUser = await mongo.collection.findOne({ email: { $regex: new RegExp("^" + newUser.email + "$", "i") } });

  if (existingUser) {
    throw new ApiError(`User with email ${newUser.email} already exists.`, ErrorTypes.BadRequest);
  }

  const hashedPwd = hashPassword(newUser.passwordPlain);
  await mongo.collection.insertOne({
    email: newUser.email,
    name: newUser.name,
    password: hashedPwd,
    isAdmin: newUser.isAdmin,
  });

  res.sendStatus(201);
}));

router.put("/:id", expressAsyncHandler(async (req, res) => {
  const expectedProps = ["isDisabled", "isAdmin"];

  throwBadRequestIfMissingFields(req.body, expectedProps);

  const newProps = stripDownToProps(req.body, expectedProps);

  const _id = stringToObjectId(req.params.id);

  const mongo = await getMongo("users");
  const existingUser = await mongo.collection.findOne({ _id });

  if (!existingUser) {
    throw new ApiError(`User not found.`, ErrorTypes.NotFound);
  }

  await mongo.collection.updateOne({ _id }, {
    $set: {
      ...newProps,
    },
  });

  res.status(200).json({
    ...stripOutProps(existingUser, ["password", "tokens"]),
    ...newProps,
  });
}));

router.post("/:id/setPassword", expressAsyncHandler(async (req, res) => {
  const expectedProps = ["newPassword"];

  throwBadRequestIfMissingFields(req.body, expectedProps);

  const { newPassword } = stripDownToProps(req.body, expectedProps);

  const _id = stringToObjectId(req.params.id);

  const mongo = await getMongo("users");
  const existingUser = await mongo.collection.findOne({ _id });

  if (!existingUser) {
    throw new ApiError(`User not found.`, ErrorTypes.NotFound);
  }

  const hashedPwd = hashPassword(newPassword);

  await mongo.collection.updateOne({ _id }, {
    $set: {
      password: hashedPwd,
    },
  });

  res.sendStatus(200);
}));

const adminUsersRouter: IAppRouter = {
  baseRoute: "/admin/users",
  router,
};

export default adminUsersRouter;

function bodyToNewUser(body: any): INewUser {
  return {
    email: body.email,
    name: body.name,
    passwordPlain: body.passwordPlain,
    isAdmin: Boolean(body.isAdmin),
  };
}

interface INewUser {
  email: string,
  name: string,
  passwordPlain: string,
  isAdmin: boolean,
}

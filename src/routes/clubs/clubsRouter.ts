import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getMongo, stringToObjectId } from "~/persistence/mongo";
import { getCurrentUser, throwBadRequestIfMissingFields } from "~/utilities/apiUtilities";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";
import IAppRouter from "../IAppRouter";
import ClubAccessibility from "shared/types/ClubAccessibility";
import IClub from "~/shared/types/IClub";

const collectionName = "clubs";

const router = express.Router();

router.get("/", expressAsyncHandler(async (_, res) => {
  const mongo = await getMongo(collectionName);

  const currUser = getCurrentUser(res);

  const users = await mongo.collection?.find({
    deleted: false,
    $or: [
      { accesibility: "public" },
      { members: { $regex: new RegExp(`^${currUser.email}$`, 'i') } }
    ],
  }).toArray();

  res.status(200).json(users);
}));

router.post("/", expressAsyncHandler(async (req, res) => {
  const club = validateAndGetClubFromRequest(req);
  club.owner = getCurrentUser(res).email;
  club.members = [];

  const mongo = await getMongo(collectionName);
  const result = await mongo.collection?.insertOne(club as any);

  res.status(201).json({
    _id: result?.insertedId,
    ...club,
  });
}));

router.put("/:id", expressAsyncHandler(async (req, res) => {
  // Are you the owner of this item?
  const _id = stringToObjectId(req.params.id);
  const mongo = await getMongo(collectionName);
  const existingItem = await mongo.collection?.findOne({ _id }) as IClub | null;

  if (!existingItem) {
    throw new ApiError(`Object not found for update.`, ErrorTypes.NotFound);
  }

  validateOwnership(res, existingItem);

  const club = validateAndGetClubFromRequest(req);

  await mongo.collection?.updateOne({ _id }, {
    $set: {
      ...club,
    },
  });

  res.status(200).json({
    ...existingItem,
    ...club,
  });
}));

const clubsRouter: IAppRouter = {
  baseRoute: "/clubs",
  router,
};

export default clubsRouter;

function validateAndGetClubFromRequest(req: Request): Partial<IClub> {
  throwBadRequestIfMissingFields(req.body, ["name", "accessibility"]);

  if (!Object.values(ClubAccessibility).includes(req.body.accesibility)) {
    throw new ApiError(`Invalid value for "accessibility". Must be one of: [${Object.values(ClubAccessibility)}].`, ErrorTypes.BadRequest);
  }

  return {
    name: req.body.name,
    accessibility: req.body.accessibility,
  };
}

function validateOwnership(res: Response, club: IClub) {
  const currUser = getCurrentUser(res);
  const isCurrUserOwner = currUser.email.localeCompare(club.owner, 'tr', { sensitivity: 'accent' }) === 0;

  if (!isCurrUserOwner) {
    throw new ApiError(`You do not have permission to perform updates on this item.`, ErrorTypes.Forbidden);
  }
}
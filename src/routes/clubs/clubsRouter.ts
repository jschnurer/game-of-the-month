import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getMongo, stringToObjectId } from "~/persistence/mongo";
import { getCurrentUser, throwBadRequestIfMissingFields } from "~/utilities/apiUtilities";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";
import IAppRouter from "../IAppRouter";
import IClub from "~/shared/types/IClub";

const collectionName = "clubs";

const router = express.Router();

router.get("/", expressAsyncHandler(async (_, res) => {
  const mongo = await getMongo(collectionName);

  const currUser = getCurrentUser(res);
  const userRegex = new RegExp(`^${currUser.email}$`, 'i');

  const clubs = await mongo.collection?.find({
    deleted: { "$ne": true },
    $or: [
      { accessType: 'Public' },
      { members: { $elemMatch: { $regex: userRegex } } },
      { owner: { $regex: userRegex } },
    ],
  }).toArray();

  res.status(200).json(clubs);
}));

router.get("/:slug", expressAsyncHandler(async (req, res) => {
  const mongoClubs = await getMongo(collectionName);

  const currUser = getCurrentUser(res);
  const userRegex = new RegExp(`^${currUser.email}$`, 'i');

  const club = await mongoClubs.collection?.findOne({
    slug: req.params.slug,
    deleted: { "$ne": true },
    $or: [
      { accessType: 'Public' },
      { members: { $elemMatch: { $regex: userRegex } } },
      { owner: { $regex: userRegex } },
    ],
  });

  if (!club) {
    throw new ApiError(`Club not found.`, ErrorTypes.NotFound);
  }

  const mongoGames = await getMongo("monthlyGames");

  const utcNow = new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth()
  ));

  const currentUtcYear = utcNow.getUTCFullYear();
  const currentUtcMonthIndex = utcNow.getUTCMonth() + 1; // Months are 0-indexed in JS, so we add 1 to get the correct month number.

  const nextMonthData = {
    year: currentUtcMonthIndex === 12 ? currentUtcYear + 1 : currentUtcYear, // If December, increment the year
    month: currentUtcMonthIndex === 12 ? 1 : currentUtcMonthIndex + 1, // Next month
  };

  // Find the current month's games as well as next month's games.
  const games = await mongoGames.collection?.find({
    clubId: club._id,
    deleted: { "$ne": true },
    $or: [
      { year: currentUtcYear, month: currentUtcMonthIndex },
      { year: nextMonthData.year, month: nextMonthData.month },
    ],
  })
    .sort({ year: 1, month: 1 }) // Order by earliest year/month first
    .toArray();

  res.status(200).json({
    club,
    currentAndUpcomingGames: games,
  });
}));

router.get("/manage/:id", expressAsyncHandler(async (req, res) => {
  const _id = stringToObjectId(req.params.id);

  const mongoClubs = await getMongo(collectionName);

  const currUser = getCurrentUser(res);
  const userRegex = new RegExp(`^${currUser.email}$`, 'i');

  const ownedClub = await mongoClubs.collection?.findOne({
    _id,
    deleted: { "$ne": true },
  });

  if (!ownedClub) {
    throw new ApiError("Club not found.", ErrorTypes.NotFound);
  }

  if (!userRegex.test(ownedClub.owner)) {
    throw new ApiError("You are not authorized to manage this club.", ErrorTypes.Unauthorized);
  }

  res.status(200).json(ownedClub);
}));

router.post("/", expressAsyncHandler(async (req, res) => {
  const club = validateAndGetClubFromRequest(req);
  club.owner = getCurrentUser(res).email;
  club.members = [];

  const slugBase = (club.name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

  const uniqueSuffix = Math.random().toString(36).substring(2, 8);
  club.slug = `${slugBase}-${uniqueSuffix}`;

  const mongo = await getMongo(collectionName);

  let existing = false;

  do {
    existing = !!(await mongo.collection?.findOne({ slug: club.slug }));

    if (existing) {
      const newSuffix = Math.random().toString(36).substring(2, 8);
      club.slug = `${slugBase}-${newSuffix}`;
    }
  } while (existing);

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
  throwBadRequestIfMissingFields(req.body, ["name", "accessType"]);

  if (!["Public", "InviteOnly"].includes(req.body.accessType)) {
    throw new ApiError(`Invalid value for "accessType". Must be one of: [Public, InviteOnly].`, ErrorTypes.BadRequest);
  }

  return {
    name: req.body.name,
    accessType: req.body.accessType,
    description: req.body.description || "",
  };
}

function validateOwnership(res: Response, club: IClub) {
  const currUser = getCurrentUser(res);
  const isCurrUserOwner = currUser.email.localeCompare(club.owner, 'tr', { sensitivity: 'accent' }) === 0;

  if (!isCurrUserOwner) {
    throw new ApiError(`You do not have permission to perform updates on this item.`, ErrorTypes.Forbidden);
  }
}
import express from "express";
import asyncHandler from "express-async-handler";
import { searchGamesByName } from "~/integrations/igdb/igdbIntegration";
import IIGDBGame from "~/shared/types/IIGDBGame";
import { throwBadRequestIfMissingFields } from "~/utilities/apiUtilities";
import ApiError from "~/validation/ApiError";
import ErrorTypes from "~/validation/ErrorTypes";

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////////////
// Lookup a game in the IGDB api.
router.post("/search", asyncHandler(async (req, res) => {
  throwBadRequestIfMissingFields(req.body, ["name"]);
  const { name: nameSearch } = req.body as { name: string };

  let searchResult: IIGDBGame[];

  try {
    searchResult = await searchGamesByName(nameSearch);
  } catch (error) {
    throw new ApiError(`Failed to search for games: ${error instanceof Error
      ? error.message
      : "Unknown error"}`,
      ErrorTypes.InternalError);
  }

  res.json(searchResult);
}));

const gamesRouter = {
  baseRoute: "/games",
  router,
};

export default gamesRouter;
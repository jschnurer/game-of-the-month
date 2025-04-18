import { getMongo } from "~/persistence/mongo";

export default async function getUserFromToken(token: string) {
  const mongo = await getMongo("users");

  const user = await mongo.collection?.findOne({
    "tokens.token": {
      $in: [token],
    },
  }, {
    projection: {
      email: 1,
      name: 1,
      isAdmin: 1,
    },
  });

  return user;
}
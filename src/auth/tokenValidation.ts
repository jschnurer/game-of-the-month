import { getMongo } from "~/persistence/mongo";
import ICurrentUser from "./ICurrentUser";

export default async function getUserFromToken(token: string): Promise<ICurrentUser | null> {
  const mongo = await getMongo("users");

  const user = await mongo.collection?.findOne({
    "tokens.token": {
      $in: [token],
    },
  }, {
    projection: {
      email: 1,
      username: 1,
      isAdmin: 1,
    },
  });

  if (!user) {
    return null;
  }

  return {
    currentToken: token,
    email: user.email,
    username: user.username || "",
    isAdmin: user.isAdmin || false,
  };
}
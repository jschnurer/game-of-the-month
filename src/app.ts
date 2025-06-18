import cors from "cors";
import express, { json } from "express";
import path from "path";
import IAppRouter from "./routes/IAppRouter";
import adminUsersRouter from "./routes/adminUsers/adminUsersRouter";
import settings from "./settings/settings";
import errorHandler from "./validation/errorHandler";
import clubsRouter from "./routes/clubs/clubsRouter";
import configureAuthMiddleware from "./auth/authMiddleware";
import meRouter from "./routes/me/meRouter";
import gamesRouter from "./routes/games/gamesRouter";
import { __dirname } from "./settings/settings";

const app = express();

app.use(cors());

// Handle JSON requests/responses.
app.use(json());

// Set up user authentication for all routes except the ones provided.
configureAuthMiddleware(app, ["/api/me/login"]);

// Add all routers here.
useRouter(adminUsersRouter);
useRouter(meRouter)
useRouter(clubsRouter);
useRouter(gamesRouter);

// All other GET requests not handled before will return our React app.
app.get("/{*splat}", (_, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Error logger and auto-formatter.
app.use(errorHandler as any);

// Start up the app and listen on the specified port.
app.listen(settings.port, () => {
  return console.log(`Express is listening at http://localhost:${settings.port}`);
});

function useRouter({ baseRoute, router }: IAppRouter) {
  app.use(`/api${baseRoute}`, router);
}
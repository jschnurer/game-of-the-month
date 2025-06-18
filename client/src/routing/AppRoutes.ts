enum AppRoutes {
  Login = "/",
  Dashboard = "/dashboard",
  Admin = "/admin",
  ManageClub = "/manage-club/:clubId",
  CreateClub = "/create-club",
  ManageClubGames = "/manage-club/:clubId/games",
  Club = "/clubs/:slug",
}

export default AppRoutes;

export function getAppRoute(route: AppRoutes, params: Record<string, string> = {}): string {
  let path = route.toString();

  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }

  if (path.includes(":")) {
    throw new Error(`Not all parameters were provided for route: ${route}. Missing: ${path}`);
  }

  return path;
}
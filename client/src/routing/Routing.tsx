import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "../components/pages/admin/AdminPage";
import DashboardPage from "../components/pages/dashboard/DashboardPage";
import AppRoutes from "./AppRoutes";
import LoginPage from "~/components/pages/login/LoginPage";
import ManageClub from "~/components/pages/club-mgmt/ManageClubPage";
import Club from "~/components/pages/club/ClubPage";
import ClubGameManagementPage from "~/components/pages/club-game-mgmt/ClubGameManagementPage";
import ClubGamePage from "~/components/pages/club-game/ClubGamePage";

export default function Routing() {
  return (
    <Routes>

      <Route
        path={AppRoutes.Admin.toString()}
        element={<AdminPage />}
      />

      <Route
        path={AppRoutes.Dashboard.toString()}
        element={<DashboardPage />}
      />

      <Route
        path={AppRoutes.Login.toString()}
        element={<LoginPage />}
      />

      <Route
        path={AppRoutes.CreateClub.toString()}
        element={<ManageClub />}
      />

      <Route
        path={AppRoutes.ManageClub.toString()}
        element={<ManageClub />}
      />

      <Route
        path={AppRoutes.Club.toString()}
        element={<Club />}
      />

      <Route
        path={AppRoutes.ManageClubGames.toString()}
        element={<ClubGameManagementPage />}
      />

      <Route
        path={AppRoutes.ClubGame.toString()}
        element={<ClubGamePage />}
      />

      <Route
        path="/"
        element={<Navigate to={AppRoutes.Dashboard} />}
      />

      <Route
        path="*"
        element={
          <div>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        }
      />

    </Routes>
  );
}
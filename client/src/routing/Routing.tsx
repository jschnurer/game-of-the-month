import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminPage from "../components/pages/admin/AdminPage";
import DashboardPage from "../components/pages/dashboard/DashboardPage";
import AppRoutes from "./AppRoutes";
import LoginPage from "~/components/pages/login/LoginPage";

export default function Routing() {
  return (
    <Router>
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

      </Routes>
    </Router>
  );
}
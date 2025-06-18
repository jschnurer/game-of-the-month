import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";
import { useUser } from "~/contexts/UserContext";

function Header() {
  const nav = useNavigate();

  const user = useUser();

  return (
    <div className={styles.header}>
      <span className={styles.title} onClick={() => nav(getAppRoute(AppRoutes.Dashboard))}>
        Game of the Month Clubs
      </span>

      <Link className={styles.userInfo} to={getAppRoute(AppRoutes.Login)}>
        {user.user?.username ?? "Log In"}
      </Link>
    </div>
  );
}

export default Header;
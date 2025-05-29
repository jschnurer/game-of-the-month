import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";

function Header() {
  const nav = useNavigate();

  return (
    <div className={styles.header}>
      <span className={styles.title} onClick={() => nav(getAppRoute(AppRoutes.Dashboard))}>
        Game of the Month Clubs
      </span>
    </div>
  );
}

export default Header;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./DashboardClub.module.scss";
import AppRoutes, { getAppRoute } from '~/routing/AppRoutes';

interface DashboardClubProps {
  name: string;
  owner: string;
  slug: string;
}

const DashboardClub: React.FC<DashboardClubProps> = ({ name, owner, slug }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getAppRoute(AppRoutes.Club, { clubId: slug }));
  };

  return (
    <div className={styles.dashboardClub} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.name}>{name}</div>
      <div className={styles.owner}>Owner: {owner}</div>
    </div>
  );
};

export default DashboardClub;
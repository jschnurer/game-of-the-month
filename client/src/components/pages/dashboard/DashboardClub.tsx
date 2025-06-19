import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./DashboardClub.module.scss";
import AppRoutes, { getAppRoute } from '~/routing/AppRoutes';
import IClubGame from '~/shared/types/IClubGame';

interface DashboardClubProps {
  name: string;
  owner: string;
  slug: string;
  description?: string;
  currentMonthGames?: IClubGame[];
}

const DashboardClub: React.FC<DashboardClubProps> = ({ name, slug, description, currentMonthGames }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getAppRoute(AppRoutes.Club, { slug }));
  };

  return (
    <div className={styles.dashboardClub} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.name}>{name}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.currentMonthGames}>
        {currentMonthGames && currentMonthGames.length > 0 ? (
          <ul>
            {currentMonthGames.map((game, index) => (
              <li key={index}>
                {game.name} {game.releaseYear ? `(${game.releaseYear})` : ''}
                {game.platform ? ` - ${game.platform}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <div>No games scheduled for this month.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardClub;
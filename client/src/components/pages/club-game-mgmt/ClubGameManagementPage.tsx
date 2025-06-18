import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IClubGame from '~/shared/types/IClubGame';
import { getApiUrl, throwIfResponseError } from '~/utilities/apiUtilities';
import { authGetJson } from '~/utilities/authFetches';
import { getMonthName } from '~/utilities/dateUtilities';
import styles from './ClubGameManagementPage.module.scss';
import SearchGameModal from '~/components/common/search-game-modal/SearchGameModal';

const ClubGameManagementPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clubGames, setClubGames] = useState<IClubGame[]>([]);
  const [schedulingData, setSchedulingData] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    if (!clubId) {
      setError("Club ID is required.");
      setLoading(false);
      return;
    };

    const fetchClubGames = async () => {
      setLoading(true);

      try {
        const resp = await authGetJson({ url: getApiUrl(`/clubs/${clubId}/manage/games`) });
        await throwIfResponseError(resp);
        const games = await resp.json() as IClubGame[];
        setClubGames(games);
        setLoading(false);
      } catch (error) {
        setError("Failed to load club games.");
        setLoading(false);
        return;
      }
    };

    fetchClubGames();
  }, [clubId]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const months = React.useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const date = new Date(currentYear, currentMonth - 1 + i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const games = clubGames.filter(g => g.year === year && g.month === month);

      return { year, month, games };
    });
  }, [clubGames, currentYear, currentMonth]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>Club Game Management</h1>

      {months.map(({ year, month, games }) => (
        <div key={`${year}-${month.toString().padStart(2, '0')}`}>
          <h3 className={styles.gameHeader}>
            <span>{getMonthName(month)} {year}</span>
          </h3>
          <div>
            {games.length > 0 ? (
              games.map(game => (
                <p key={game._id}>
                  {game.name} ({game.platform})
                </p>
              ))
            ) : (
              <p>
                No games scheduled for {getMonthName(month)} {year}.
              </p>
            )}

            <a onClick={() => setSchedulingData({ year, month })}>Schedule a new game</a>
          </div>
        </div>
      ))}

      {schedulingData &&
        <SearchGameModal
          onClose={() => setSchedulingData(null)}
          onChooseGame={(game) => {
            // TODO: Handle game selection logic.
            
          }}
        />
      }
    </>
  );
};

export default ClubGameManagementPage;
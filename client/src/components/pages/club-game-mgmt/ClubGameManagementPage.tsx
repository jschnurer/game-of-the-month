import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IClubGame from '~/shared/types/IClubGame';
import { getApiUrl, throwIfResponseError } from '~/utilities/apiUtilities';
import { authGetJson, authPostJson } from '~/utilities/authFetches';
import { getMonthName } from '~/utilities/dateUtilities';
import styles from './ClubGameManagementPage.module.scss';
import SearchGameModal from '~/components/common/search-game-modal/SearchGameModal';
import Spinner from '~/components/common/spinner/Spinner';
import AppRoutes, { getAppRoute } from '~/routing/AppRoutes';
import ModalSpinner from '~/components/common/modal-spinner/ModalSpinner';
import GameDisplay from '~/components/common/game-display/GameDisplay';

const ClubGameManagementPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clubGames, setClubGames] = useState<IClubGame[]>([]);
  const [schedulingData, setSchedulingData] = useState<{ year: number; month: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("Club ID is required.");
      setLoading(false);
      return;
    };

    const fetchClubGames = async () => {
      setLoading(true);

      try {
        const resp = await authGetJson({ url: getApiUrl(`/clubs/${slug}/manage/games`) });
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
  }, [slug]);

  const scheduleGame = useCallback(async (game: IClubGame) => {
    setIsSaving(true);

    try {
      const resp = await authPostJson({
        url: getApiUrl(`/clubs/${slug}/manage/games`),
        data: {
          ...game,
          year: schedulingData?.year,
          month: schedulingData?.month,
        },
      });

      await throwIfResponseError(resp);

      const savedGame = (await resp.json()) as IClubGame;

      setClubGames(prev => [...prev, savedGame]);
    } catch (err) {
      alert(`Failed to schedule game. Please refresh and try again.`);
    } finally {
      setIsSaving(false);
    }
  }, [setIsSaving, setClubGames, schedulingData]);

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
    return <Spinner />;
  } else if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>Club Game Management</h1>

      <Link to={getAppRoute(AppRoutes.Club, { slug: slug ?? "" })}>Back to Club</Link>

      {months.map(({ year, month, games }) => (
        <div key={`${year}-${month.toString().padStart(2, '0')}`} className={styles.col}>
          <h2 className={styles.gameHeader}>
            <span>{getMonthName(month)} {year}</span>
          </h2>

          <div className="row">
            {games.length > 0 ? (
              games.map(game => (
                <GameDisplay
                  key={game._id}
                  clubSlug={slug ?? ""}
                  game={game}
                  onEditClick={() => {
                    alert("TODO: Manage existing game.");
                  }}
                />
              ))
            ) : (
              <p>
                No games scheduled for {getMonthName(month)} {year}.
              </p>
            )}
          </div>

          <a onClick={() => setSchedulingData({ year, month })}>Schedule a new game</a>
        </div>
      ))}

      {schedulingData &&
        <SearchGameModal
          onClose={() => setSchedulingData(null)}
          onChooseGame={scheduleGame}
        />
      }

      {isSaving && <ModalSpinner />}
    </>
  );
};

export default ClubGameManagementPage;
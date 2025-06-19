import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import { authGetJson } from "~/utilities/authFetches";
import { useUser } from "~/contexts/UserContext";
import styles from "./ClubPage.module.scss";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";
import IClub from "~/shared/types/IClub";
import IClubGame from "~/shared/types/IClubGame";
import GameDisplay from "~/components/common/game-display/GameDisplay";

interface IClubDashboardData {
  club: IClub,
  currentAndUpcomingGames: IClubGame[],
}

const Club: React.FC = () => {
  const { slug: clubSlug } = useParams<{ slug: string }>();
  const [clubData, setClubData] = useState<IClubDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const isOwner = clubData && user?.email === clubData.club.owner;

  useEffect(() => {
    if (!clubSlug) {
      setError("No club ID provided.");
      setLoading(false);
      return;
    }

    const fetchClub = async () => {
      try {
        const res = await authGetJson({
          url: getApiUrl(`/clubs/${clubSlug}`)
        });

        await throwIfResponseError(res);

        setClubData(await res.json() as IClubDashboardData);
      } catch (err) {
        setError("Failed to load club.");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubSlug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!clubData) return <div>Club not found.</div>;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const currentGames = clubData.currentAndUpcomingGames.filter(
    game => game.year === currentYear && game.month === currentMonth
  );

  const nextMonthsGames = clubData.currentAndUpcomingGames.filter(
    game => !(game.year === currentYear && game.month === currentMonth)
  );

  return (
    <div className="col">
      <h1>{clubData.club.name}</h1>

      {!!clubData.club.description && (
        <p>{clubData.club.description}</p>
      )}

      {isOwner && <Link to={getAppRoute(AppRoutes.ManageClub, { slug: clubData.club.slug })}>Edit Club Details</Link>}
      {isOwner && <Link to={getAppRoute(AppRoutes.ManageClubGames, { slug: clubData.club.slug })}>Edit Game List</Link>}

      <GameList clubSlug={clubSlug ?? ""} games={currentGames} thisOrNext="this" />
      <GameList clubSlug={clubSlug ?? ""} games={nextMonthsGames} thisOrNext="next" />

    </div>
  );
};

export default Club;

function GameList(props: { clubSlug: string, games: IClubGame[], thisOrNext: "this" | "next" }) {
  const { clubSlug, games, thisOrNext } = props;
  return (
    <>
      <h2>{(thisOrNext === "this" ? "This" : "Next") + ` Month's Game${games.length > 1 ? "s" : ""}`}</h2>

      <div className={styles.gamesList}>
        {games.length > 0 ?
          games.map(game => (
            <GameDisplay
              key={game._id}
              clubSlug={clubSlug}
              goToGamePageOnTitleClick
              game={game}
            />
          ))
          : (
            <p>TBD</p>
          )}
      </div>
    </>
  );
}
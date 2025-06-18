import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import { authGetJson } from "~/utilities/authFetches";
import { useUser } from "~/contexts/UserContext";
import styles from "./Club.module.scss";

interface IClub {
  id: string;
  name: string;
  description: string;
  owner: string;
}

interface IClubGame {
  _id: string;
  name: string;
  platform: string;
  description: string;
  externalLink: string;
  year: number;
  month: number;
  imageUrl: string;
}

interface IClubDashboardData {
  club: IClub,
  currentAndUpcomingGames: IClubGame[],
}

const Club: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [clubData, setClubData] = useState<IClubDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const isOwner = clubData && user?.email === clubData.club.owner;

  useEffect(() => {
    if (!clubId) {
      setError("No club ID provided.");
      setLoading(false);
      return;
    }

    const fetchClub = async () => {
      try {
        const res = await authGetJson({
          url: getApiUrl(`/clubs/${clubId}`)
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
  }, [clubId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!clubData) return <div>Club not found.</div>;

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;

  const currentGames = clubData.currentAndUpcomingGames.filter(
    game => game.year === currentYear && game.month === currentMonth
  );

  const nextMonthsGames = clubData.currentAndUpcomingGames.filter(
    game => !(game.year === currentYear && game.month === currentMonth)
  );

  return (
    <div className="col">
      <h1>{clubData.club.name}</h1>
      <div>
        <strong>Owner:</strong> {clubData.club.owner}

        {isOwner && <button>Edit Club Data</button>}
      </div>

      {!!clubData.club.description && (
        <p>{clubData.club.description}</p>
      )}

      {isOwner && <button>Edit Monthly Games</button>}

      <GameList games={currentGames} thisOrNext="this" />
      <GameList games={nextMonthsGames} thisOrNext="next" />

    </div>
  );
};

export default Club;

function GameList(props: { games: IClubGame[], thisOrNext: "this" | "next" }) {
  const { games, thisOrNext } = props;
  return (
    <>
      <h2>{(thisOrNext === "this" ? "This" : "Next") + `Month's Game${games.length > 1 ? "s" : ""}`}</h2>

      <div className={styles.gamesList}>
        {games.length > 0 ? (
          <p>
            {games.map(game => (
              <span
                key={game._id}
              >
                {game.name} ({game.platform})
              </span>
            ))}
          </p>
        ) : (
          <p>TBD</p>
        )}
      </div>
    </>
  );
}
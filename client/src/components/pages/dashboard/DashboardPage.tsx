import { useMemo, useState } from "react";
import PageTitle from "../../layout/page/page-title/PageTitle";
import IClub from "~/shared/types/IClub";
import LoadingDisplay from "~/components/common/loadingDisplay/LoadingDisplay";
import { getApiUrl } from "~/utilities/apiUtilities";
import { useNavigate } from "react-router-dom";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";
import DashboardClub from "./DashboardClub";
import IClubGame from "~/shared/types/IClubGame";

type IClubWithGames = {
  club: IClub;
  currentMonthGames: IClubGame[];
}

export default function DashboardPage() {
  const [clubsWithGames, setClubsWithGames] = useState<IClubWithGames[]>([]);
  const fetchValues = useMemo(() => ({ url: getApiUrl("/clubs") }), []);
  const nav = useNavigate();

  return (
    <>
      <PageTitle
        title="My Dashboard"
      />

      <LoadingDisplay
        fetchValues={fetchValues}
        setResponse={setClubsWithGames}
      >
        <div className="col">
          <button
            onClick={() => nav(getAppRoute(AppRoutes.CreateClub))}
          >
            Create a Club
          </button>

          {!clubsWithGames.length &&
            <div>
              You aren't a member in any Game of the Month clubs!
            </div>
          }

          {clubsWithGames.map(club =>
            <DashboardClub
              name={club.club.name}
              owner={club.club.owner}
              slug={club.club.slug}
              key={club.club._id}
              description={club.club.description}
              currentMonthGames={club.currentMonthGames}
            />
          )}
        </div>
      </LoadingDisplay>
    </>
  );
}
import { useMemo, useState } from "react";
import PageTitle from "../../layout/page/page-title/PageTitle";
import IClub from "~/shared/types/IClub";
import LoadingDisplay from "~/components/common/loadingDisplay/LoadingDisplay";
import { getApiUrl } from "~/utilities/apiUtilities";
import { useNavigate } from "react-router-dom";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";
import DashboardClub from "./DashboardClub";

export default function DashboardPage() {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const fetchValues = useMemo(() => ({ url: getApiUrl("/clubs") }), []);
  const nav = useNavigate();

  return (
    <>
      <PageTitle
        title="My Dashboard"
      />

      <LoadingDisplay
        fetchValues={fetchValues}
        setResponse={setClubs}
      >
        <div className="col">
          <button
            onClick={() => nav(getAppRoute(AppRoutes.CreateClub))}
          >
            Create a Club
          </button>

          {!clubs.length &&
            <div>
              You aren't a member in any Game of the Month clubs!
            </div>
          }

          {clubs.map(club =>
            <DashboardClub
              name={club.name}
              owner={club.owner}
              slug={club.slug}
              key={club._id}
            />
          )}
        </div>
      </LoadingDisplay>
    </>
  );
}
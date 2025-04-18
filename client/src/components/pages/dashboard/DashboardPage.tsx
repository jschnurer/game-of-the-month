import { useMemo, useState } from "react";
import PageTitle from "../../layout/page/page-title/PageTitle";
import { getApiUrl } from "~/settings/settings";
import IClub from "~/shared/types/IClub";
import LoadingDisplay from "~/components/common/loadingDisplay/LoadingDisplay";

export default function DashboardPage() {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const fetchValues = useMemo(() => ({ url: getApiUrl("/clubs") }), []);

  return (
    <>
      <PageTitle
        title="My Dashboard"
      />

      <LoadingDisplay
        fetchValues={fetchValues}
        setResponse={setClubs}
      >
        {!clubs.length &&
          <div>
            You aren't a member in any Game of the Month clubs!
          </div>
        }
        {clubs.map(club =>
          <div className="club">
            {club.name} (Owner: {club.owner})
          </div>
        )}
      </LoadingDisplay>
    </>
  );
}
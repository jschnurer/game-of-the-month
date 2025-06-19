import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalSpinner from "~/components/common/modal-spinner/ModalSpinner";
import Spinner from "~/components/common/spinner/Spinner";
import PageTitle from "~/components/layout/page/page-title/PageTitle";
import IClub from "~/shared/types/IClub";
import IClubGame from "~/shared/types/IClubGame";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import { authGetJson } from "~/utilities/authFetches";

export default function ClubGamePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    club: IClub,
    game: IClubGame
  } | null>(null);
  const { slug, gameId } = useParams<{ slug: string, gameId: string }>();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const clubRespPromise = authGetJson({
          url: getApiUrl(`/clubs/${slug}`)
        });

        const gameRespPromise = authGetJson({
          url: getApiUrl(`/clubs/${slug}/games/${gameId}`)
        });

        const [clubResp, gameResp] = await Promise.all([clubRespPromise, gameRespPromise]);

        await throwIfResponseError(clubResp);
        await throwIfResponseError(gameResp);

        const club = await clubResp.json() as IClub;
        const game = await gameResp.json() as IClubGame;

        setData({ game, club })
      } catch (err) {
        alert("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

  }, [setIsLoading, setData, slug, gameId]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      <PageTitle
        title={data.club.name}
      />

      {isLoading && <ModalSpinner />}
    </>
  );
}
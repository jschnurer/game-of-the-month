import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import { authGetJson } from "~/utilities/authFetches";
import { useUser } from "~/contexts/UserContext";

interface Club {
  id: string;
  name: string;
  description: string;
  owner: string;
}

const Club: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const isOwner = club && user?.email === club.owner;

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

        setClub(await res.json() as Club);
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
  if (!club) return <div>Club not found.</div>;

  return (
    <div className="col">
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{club.name}</h1>
      <div>
        <strong>Owner:</strong> {club.owner}
      </div>

      {!!club.description && (
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{club.description}</p>
      )}


    </div>
  );
};

export default Club;
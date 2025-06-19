import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from "./ManageClubPage.module.scss";
import { getApiUrl, throwIfResponseError } from '~/utilities/apiUtilities';
import { authGetJson, authPostJson, authPutJson } from '~/utilities/authFetches';
import AppRoutes, { getAppRoute } from '~/routing/AppRoutes';
import IClub from '~/shared/types/IClub';
import PageTitle from '~/components/layout/page/page-title/PageTitle';

const defaultClub: IClub = {
  name: '',
  description: '',
  accessType: 'Public',
  _id: '',
  slug: '',
  members: [],
  owner: '',
};

const ManageClub: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [club, setClub] = useState<IClub>(defaultClub);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setLoading(true);

      const loader = async () => {
        try {
          const res = await authGetJson({
            url: getApiUrl(`/clubs/${slug}/manage`)
          });

          await throwIfResponseError(res);

          const data = await res.json();
          if (data) {
            setClub(data as IClub);
          } else {
            throw new Error('Club not found');
          }
        } catch (err) {
          alert('Error loading club: ' + (err instanceof Error ? err.message : 'Unknown error'));
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };

      loader();
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClub(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClub(prev => ({
      ...prev,
      accessType: e.target.value as 'Public' | 'InviteOnly',
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = slug ? 'PUT' : 'POST';
    const url = slug ? `/clubs/${slug}` : '/clubs';
    try {
      const res = method === 'PUT'
        ? await authPutJson({
          url: getApiUrl(url),
          data: club,
        }) : await authPostJson({
          url: getApiUrl(url),
          data: club,
        });

      await throwIfResponseError(res);

      if (res.ok) {
        alert("Club saved successfully!");
        navigate(getAppRoute(AppRoutes.Club, { slug: club.slug }));
      }
    } catch (err) {
      alert('Error saving club: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageTitle
        title={club._id ? "Edit Club Details" : "New Club"}
      />

      <form onSubmit={handleSubmit} className={styles.manageClubForm}>
        <div>
          <label>
            Club Name:
            <input
              type="text"
              name="name"
              value={club.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={club.description}
              onChange={handleChange}
              required
              rows={8}
            />
          </label>
        </div>
        <div className={styles.accessType}>
          <span>Access Type:</span>
          <label>
            <input
              type="radio"
              name="accessType"
              value="Public"
              checked={club.accessType === 'Public'}
              onChange={handleAccessTypeChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="accessType"
              value="InviteOnly"
              checked={club.accessType === 'InviteOnly'}
              onChange={handleAccessTypeChange}
            />
            Invite Only
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </>
  );
};

export default ManageClub;
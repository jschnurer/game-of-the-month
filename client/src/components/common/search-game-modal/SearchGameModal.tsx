import React, { useCallback, useState } from 'react';
import Modal from '../modal/Modal';
import IIGDBGame from "~/shared/types/IIGDBGame";
import { authPostJson } from '~/utilities/authFetches';
import { getApiUrl, throwIfResponseError } from '~/utilities/apiUtilities';
import IClubGame from '~/shared/types/IClubGame';
import styles from "./SearchGameModal.module.scss";

interface SearchGameModalProps {
  onClose: () => void;
  onChooseGame: (game: IClubGame) => void;
}

const SearchGameModal: React.FC<SearchGameModalProps> = ({ onClose, onChooseGame }) => {
  const [gameName, setGameName] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [stage, setStage] = useState<'searching' | 'results' | 'finalize'>('searching');
  const [searchResults, setSearchResults] = useState<IIGDBGame[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clubGame, setClubGame] = useState<IClubGame>({
    _id: "",
    clubId: "",
    description: "",
    name: "",
    platform: "",
    month: 0,
    year: 0,
    releaseYear: undefined,
    externalLink: "",
    imageUrl: "",
  });

  const cancelButton = (
    <button
      className="secondary"
      onClick={onClose}
      disabled={isWorking}
    >
      Cancel
    </button>
  );

  const enterManuallyButton = (
    <button
      className="tertiary"
      disabled={isWorking}
      onClick={() => goToFinalizeStage(null)}
    >
      Enter game data manually
    </button>
  );

  const goToFinalizeStage = (game: IIGDBGame | null, platform?: string, releaseYear?: number) => {
    setClubGame({
      _id: "",
      clubId: "",
      description: game?.summary || "",
      name: game?.name || "",
      platform: platform,
      month: 0,
      year: 0,
      releaseYear: releaseYear,
      externalLink: game?.url || '',
      imageUrl: game?.cover?.url ? game.cover.url.replace('t_thumb', 't_cover_big') : '',
    });
    setStage('finalize');
    setError(null);
  };

  const searchGames = useCallback(async (name: string) => {
    setIsWorking(true);
    setStage('searching');
    setError(null);

    try {
      const resp = await authPostJson({
        url: getApiUrl('/games/search'),
        data: {
          name,
        }
      });

      await throwIfResponseError(resp);

      const games: IIGDBGame[] = await resp.json();

      setSearchResults(games);
      setStage('results');
    } catch (error) {
      setError('Failed to search for games. Please try again later.');
    } finally {
      setIsWorking(false);
    }
  }, [setIsWorking, setStage, setError, setSearchResults]);

  const controls = stage === 'searching' ? (
    <>
      {enterManuallyButton}

      {cancelButton}

      <button
        className="primary"
        onClick={() => searchGames(gameName.trim())}
        disabled={isWorking}
      >
        Search
      </button>
    </>
  ) : (stage === "results"
    ? (
      <>
        {enterManuallyButton}

        {cancelButton}

        <button
          className="secondary"
          onClick={() => setStage('searching')}
          disabled={isWorking}
        >
          Back
        </button>
      </>
    ) : (
      <>
        {cancelButton}

        <button
          className="secondary"
          onClick={() => setStage('searching')}
          disabled={isWorking}
        >
          Start Over
        </button>

        <button
          className="primary"
          onClick={() => {
            if (clubGame
              && clubGame.name.trim()) {
              onChooseGame(clubGame);
              onClose();
            }
          }}
        >
          Schedule Game
        </button>
      </>
    ));


  return (
    <Modal
      isOpen={true}
      header="Search for a Game"
      onCloseButtonClicked={onClose}
      showCloseButton
      controls={controls}
    >
      {stage === 'searching' && (
        <>
          <input
            type="text"
            placeholder="Enter game name"
            value={gameName}
            onChange={e => setGameName(e.target.value)}
            autoFocus
            onKeyUp={e => {
              if (e.key === 'Enter' && !isWorking && gameName.trim()) {
                e.preventDefault();
                searchGames(gameName.trim());
              }
            }}
          />

          {isWorking && <p>Searching...</p>}
        </>
      )}

      {stage === 'results' && (
        <>
          {searchResults.length === 0 ? (
            <p>No games found.</p>
          ) : (
            <div className="search-results-list">
              {searchResults.map(game => (
                <div key={game.id}>
                  <b>{game.name}</b>

                  <div className={styles.releaseList}>
                    {game.release_dates?.map(release => (
                      <div key={release.id}>
                        {release.platform?.name || 'Unknown Platform'}, {release.date ? new Date(release.date * 1000).getFullYear() : 'Unknown Year'} <a className="neutral" onClick={() => goToFinalizeStage(game, release.platform?.name, new Date(release.date * 1000).getFullYear())}>Choose</a>
                      </div>
                    ))}

                    {!game.release_dates?.length &&
                      <div>Unknown Platform, Unknown Year <a className="neutral" onClick={() => goToFinalizeStage(game)}>Choose</a></div>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {stage === 'finalize' && (
        <>
          <h3>Finalize Game Details</h3>

          <div className={styles.finalizeGame}>
            <label>
              Name:
              <input
                type="text"
                value={clubGame?.name || ''}
                onChange={e => setClubGame({ ...clubGame, name: e.target.value })}
              />
            </label>

            <label>
              Platform:
              <input
                type="text"
                value={clubGame?.platform || ''}
                onChange={e => setClubGame({ ...clubGame, platform: e.target.value })}
              />
            </label>

            <label>
              Release Year:
              <input
                type="number"
                value={clubGame?.releaseYear || ''}
                onChange={e => setClubGame({ ...clubGame, releaseYear: parseInt(e.target.value) })}
              />
            </label>

            <label>
              Description:
              <textarea
                value={clubGame?.description || ''}
                onChange={e => setClubGame({ ...clubGame, description: e.target.value })}
              />
            </label>

            {clubGame?.imageUrl && (
              <img
                src={clubGame.imageUrl}
                alt={`${clubGame.name} cover`}
                className={styles.coverImage}
              />
            )}
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </Modal>
  );
};

export default SearchGameModal;

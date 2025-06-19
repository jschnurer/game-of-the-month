import IClubGame from "~/shared/types/IClubGame";
import styles from "./GameDisplay.module.scss";
import { Link } from "react-router-dom";
import AppRoutes, { getAppRoute } from "~/routing/AppRoutes";

interface IGameDisplayProps {
  clubSlug: string;
  game: IClubGame;
  goToGamePageOnTitleClick?: boolean;
  onEditClick?: () => void;
}

export default function GameDisplay({ clubSlug, game, goToGamePageOnTitleClick, onEditClick }: IGameDisplayProps) {
  return (
    <div className={styles.gameDisplay}>
      {game.imageUrl ?
        <img src={game.imageUrl} />
        : null
      }

      <div>
        <span className={styles.gameName}>
          {goToGamePageOnTitleClick
            ? <Link to={getAppRoute(AppRoutes.ClubGame, { slug: clubSlug, gameId: game._id })}>{game.name}</Link>
            : game.name
          }
        </span>

        <span className={styles.releaseData}>
          {game.platform}, {game.releaseYear ?? "Unknown Release Year"}
        </span>

        <p className={styles.description}>
          {game.description}
        </p>

        {onEditClick &&
          <a onClick={onEditClick}>
            Manage Game
          </a>
        }
      </div>
    </div>
  );
}
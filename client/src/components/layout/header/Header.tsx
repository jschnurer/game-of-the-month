import styles from "./Header.module.scss";

function Header() {
  return (
    <div className={styles.header}>
      <span className={styles.title}>
        node-react-mongo-skeleton
      </span>
    </div>
  );
}

export default Header;
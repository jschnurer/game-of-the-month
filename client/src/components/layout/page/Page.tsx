import styles from "./Page.module.scss";

interface PageProps {
  children: React.ReactNode,
}

export default function Page(props: PageProps) {
  return (
    <div className={styles.page}>
      {props.children}
    </div>
  );
}
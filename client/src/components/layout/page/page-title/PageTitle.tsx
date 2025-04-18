import styles from "./PageTitle.module.scss";

interface IPageTitleProps {
  title: string,
}

export default function PageTitle(props: IPageTitleProps) {
  document.title = props.title;

  return (
    <h2 className={styles.pageTitle}>
      {props.title}
    </h2>
  );
}
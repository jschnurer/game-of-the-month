import styles from "./AppForm.module.scss";

export interface IAppFormProps {
  children: React.ReactNode,
}

export default function AppForm(props: IAppFormProps) {
  return (
    <div className={styles.form}>
      {props.children}
    </div>
  );
}
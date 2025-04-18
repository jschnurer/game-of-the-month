import styles from "./FormRow.module.scss";

interface IFormRowProps {
  label: string,
  hint?: string,
  children?: React.ReactNode,
}

export default function FormRow(props: IFormRowProps) {
  return (
    <div className={styles.formRow}>
      <label>{props.label}</label>
      {props.children}
    </div>
  );
}
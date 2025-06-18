import { concatClasses } from "~/utilities/componentUtils";
import styles from "./AppForm.module.scss";

export interface IAppFormProps {
  children: React.ReactNode,
  className?: string,
}

export default function AppForm(props: IAppFormProps) {
  return (
    <div className={concatClasses([styles.form, props.className])}>
      {props.children}
    </div>
  );
}
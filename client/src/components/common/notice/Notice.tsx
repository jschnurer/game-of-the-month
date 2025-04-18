import { ReactNode } from "react";
import styles from "./Notice.module.scss";

export enum NoticeTypes {
  Error = "error",
  Success = "success",
  Info = "info",
  Warning = "warning",
}

interface INoticeProps {
  type: NoticeTypes,
  children: ReactNode,
}

export default function Notice(props: INoticeProps) {
  return (
    <div className={styles.notice + " " + props.type}>
      {props.children}
    </div>
  );
}